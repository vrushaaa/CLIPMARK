import os
import tempfile
from flask import Blueprint, current_app, render_template, request, jsonify, session, url_for, redirect, Response
from flask_login import login_required, current_user
from app import db
from app.models.bookmark import Bookmark, generate_url_hash, normalize_url 
from app.models.tag import Tag
from app.models.user import User
from app.models.user_bookmark import UserBookmark
from app.models.tag_user_bookmark import tag_user_bookmarks
from urllib.parse import urljoin
import pytz
from datetime import datetime
import requests
from bs4 import BeautifulSoup
import segno
from app.utils.routes_utils import extract_meta_keywords, extract_title

# blueprints
bp = Blueprint('bookmarks_api', __name__, url_prefix='/api')
short_bp = Blueprint('short', __name__, url_prefix='/') 

# home page
@short_bp.route('/')
def home():
    # Check if user is already logged in
    if current_user.is_authenticated:
        return redirect(url_for('bookmarks_api.dashboard'))
    return render_template('landing.html'), 200
    

    

@bp.route('/', methods=['GET'])
@login_required
def dashboard():
    # Get username from Flask-Login's current_user
    username = current_user.username
    user_id = current_user.id
    total_bookmarks = UserBookmark.query.filter_by(user_id=user_id).count()
    archived_bookmarks = UserBookmark.query.filter_by(user_id=user_id, archived=True).count()

    return render_template('welcome.html',username=username), 200


# short url redirect
@short_bp.route('/<short_code>')
def redirect_short(short_code):   
    bookmark = Bookmark.query.filter_by(short_url=short_code).first_or_404()
    bookmark.updated_at = datetime.utcnow()
    db.session.commit()
    return redirect(bookmark.url)



# bookmark creation route
@bp.route('/bookmarks', methods=['POST'])
@login_required
def create_bookmark():
    data = request.get_json()
    url = data.get('url')
    user_id = current_user.id
    notes = data.get('notes', '')
    tags = data.get('tags', [])
    archived = data.get('archived', False)
    title = data.get('title')

    if not url:
        return jsonify({'error': 'url required'}), 400

    norm_url = normalize_url(url)
    url_hash = generate_url_hash(norm_url)
    existing = Bookmark.query.filter_by(hash_url=url_hash).first()

    if not tags:  
        auto_tags = extract_meta_keywords(norm_url)
        if auto_tags:
            tags = auto_tags

    if existing:
        # Check if user already has this bookmark
        ub = UserBookmark.query.filter_by(
            user_id=user_id,
            bookmark_id=existing.id
        ).first()
        
        if ub:
            return jsonify({'error': 'You already saved this link'}), 409
        
        bookmark = existing
        if not title:
            title = extract_title(norm_url) or "Untitled Link"
    else:
        bookmark = Bookmark(url=norm_url)
        bookmark.set_hash()
        bookmark.set_short_url()
        db.session.add(bookmark)
        db.session.flush()

        if not title:
            title = extract_title(norm_url) or "Untitled Link"

    # Create UserBookmark
    ub = UserBookmark(
        user_id=user_id,
        bookmark_id=bookmark.id,
        title=title,
        notes=notes,
        archived=archived
    )
    db.session.add(ub)

    # Handle tags
    if tags:
        for tag_name in tags:
            tag_name = tag_name.strip().lower()
            if tag_name:
                tag = Tag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = Tag(name=tag_name)
                    db.session.add(tag)
                    db.session.flush()
                db.session.execute(
                    tag_user_bookmarks.insert().values(
                        tag_id=tag.id,
                        user_id=user_id,
                        bookmark_id=bookmark.id
                    )
                )

    db.session.commit()

    return jsonify({
        'message': 'Bookmark saved successfully',
        'bookmark': bookmark.to_dict(user_id=user_id)
    }), 201


# get single bookmark
@bp.route('/bookmarks/<int:bookmark_id>', methods=['GET'])
@login_required
def get_bookmark(bookmark_id):
    bookmark = Bookmark.query.get(bookmark_id)
    if not bookmark:
        return render_template('noBookmark.html',message='Bookmark not found', SCode=404) , 404
    user_id = request.args.get('user_id', type=int)
    return jsonify(bookmark.to_dict(user_id=user_id)), 200

# update bookmark
@bp.route('/bookmarks/<int:bookmark_id>', methods=['PUT'])
def update_bookmark(bookmark_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid or missing JSON'}), 400

    # user_id = data.get('user_id')
    user_id = current_user.id
    if not user_id:
        return render_template('noBookmark.html', message='user_id required'), 400

    ub = UserBookmark.query.filter_by(user_id=user_id, bookmark_id=bookmark_id).first()
    if not ub:
        return jsonify({'error': 'Access denied or not found'}), 404

    bookmark = Bookmark.query.get(bookmark_id)
    updated = False

    if 'title' in data:
        ub.title = data['title']
        updated = True

    if 'notes' in data:
        ub.notes = data['notes']
        updated = True

    if 'archived' in data:
        ub.archived = data['archived']
        updated = True

    if 'tags' in data:

        db.session.execute(
            tag_user_bookmarks.delete().where(
                tag_user_bookmarks.c.bookmark_id == bookmark_id,
                tag_user_bookmarks.c.user_id == user_id
            )
        )
        for tag_name in data.get('tags', []):
            tag_name = tag_name.strip().lower()
            if tag_name:
                tag = Tag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = Tag(name=tag_name)
                    db.session.add(tag)
                    db.session.flush()
                db.session.execute(
                    tag_user_bookmarks.insert().values(
                        tag_id=tag.id,
                        user_id=user_id,
                        bookmark_id=bookmark_id
                    )
                )
        updated = True

    if updated:
        ub.updated_at = datetime.utcnow()

    db.session.commit()
    return jsonify({
        'message': 'Updated',
        'bookmark': bookmark.to_dict(user_id=user_id)
    }), 200

# archive toggle
@bp.route('/bookmarks/<int:bookmark_id>/archive', methods=['PATCH'])
@login_required
def toggle_archive(bookmark_id):
    # user_id = request.args.get('user_id', type=int)
    user_id = current_user.id
    if not user_id:
        return jsonify({'error': 'user_id required'}), 400

    ub = UserBookmark.query.filter_by(user_id=user_id, bookmark_id=bookmark_id).first()
    if not ub:
        return jsonify({'error': 'Not found or access denied'}), 404

    ub.archived = not ub.archived
    ub.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        'message': 'Archive toggled',
        'archived': ub.archived
    }), 200

# delete bookmark
@bp.route('/bookmarks/<int:bookmark_id>', methods=['DELETE'])
@login_required
def delete_bookmark(bookmark_id):
    # user_id = request.args.get('user_id', type=int)
    user_id = current_user.id
    
    if not user_id:
        return jsonify({'error': 'user_id required'}), 400

    ub = UserBookmark.query.filter_by(user_id=user_id, bookmark_id=bookmark_id).first()
    if not ub:
        return jsonify({'error': 'Not found or access denied'}), 404

    try:
        # Step 1: Delete all tag associations for this user-bookmark combination
        db.session.execute(
            tag_user_bookmarks.delete().where(
                db.and_(
                    tag_user_bookmarks.c.user_id == user_id,
                    tag_user_bookmarks.c.bookmark_id == bookmark_id
                )
            )
        )
        
        # Step 2: Delete the UserBookmark entry
        db.session.delete(ub)
        
        # Step 3: Commit both operations
        db.session.commit()
        
        return jsonify({'message': 'Bookmark removed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete bookmark', 'details': str(e)}), 500
    
# export bookmark
@bp.route('/export', methods=['GET'])
@login_required
def export_bookmarks():
    # user_id = request.args.get('user_id', type=int)
    user_id = current_user.id

    if not user_id:
        return jsonify({'error': 'user_id required'}), 400

    bookmarks = db.session.query(Bookmark).join(UserBookmark).filter(UserBookmark.user_id == user_id).all()
    if not bookmarks:
        return jsonify({'error': 'No bookmarks found'}), 404

    ist = pytz.timezone('Asia/Kolkata')
    
    html = """<!DOCTYPE NETSCAPE-Bookmark-file-1>
                <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
                <TITLE>LinkVault Export</TITLE>

            <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                background: #000000;
                background-image: radial-gradient(circle at 20% 50%, rgba(180, 255, 57, 0.05) 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(193, 227, 40, 0.05) 0%, transparent 50%);
                min-height: 100vh;
                padding: 48px 20px;
                line-height: 1.6;
                color: #ffffff;
            }

            .container {
                max-width: 1152px;
                margin: 0 auto;
            }

            .header-section {
                margin-bottom: 32px;
                padding-bottom: 24px;
                border-bottom: 1px solid #1f1f1f;
            }

            .header-title {
                font-size: 42px;
                font-weight: 700;
                color: #b4ff39;
                margin-bottom: 8px;
                letter-spacing: -0.5px;
            }

            .header-subtitle {
                color: #9ca3af;
                font-size: 16px;
                font-weight: 400;
            }

            DL {
                display: block;
                width: 100%;
            }

            DT {
                margin-bottom: 24px;
            }

            .bookmark-card {
                display: block;
                background: #111111;
                border: 1px solid #1f1f1f;
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 24px;
                text-decoration: none;
                transition: all 0.3s ease;
                backdrop-filter: blur(8px);
            }

            .bookmark-card:hover {
                border-color: rgba(193, 227, 40, 0.6);
                box-shadow: 0 0 15px rgba(193, 227, 40, 0.15);
                transform: translateY(-2px);
            }

            .bookmark-title {
                font-size: 24px;
                font-weight: 600;
                color: #ffffff;
                margin-bottom: 12px;
                display: block;
            }

            .bookmark-url {
                color: #9ca3af;
                font-size: 16px;
                word-break: break-all;
                display: block;
                margin-bottom: 8px;
                text-decoration: none;
            }

            .bookmark-url:hover {
                color: #c1e328;
            }

            .bookmark-url::before {
                content: "🔗 ";
            }

            .bookmark-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 12px;
            }

            .tag {
                background: #263a19;
                color: #b4ff39;
                padding: 4px 12px;
                border-radius: 9999px;
                font-size: 14px;
                font-weight: 500;
            }

            DD {
                background: rgba(17, 17, 17, 0.6);
                padding: 16px 24px;
                border-radius: 12px;
                font-size: 14px;
                color: #d1d5db;
                line-height: 1.6;
                border-left: 3px solid #263a19;
                margin-bottom: 24px;
                margin-left: 0;
            }

            DD::before {
                content: "Notes: ";
                color: #9ca3af;
                font-weight: 600;
            }

            .timestamp {
                font-size: 12px;
                color: #6b7280;
                margin-top: 8px;
            }

            /* Responsive design */
            @media (max-width: 768px) {
                body {
                    padding: 24px 16px;
                }

                .header-title {
                    font-size: 32px;
                }

                .bookmark-card {
                    padding: 20px;
                }

                .bookmark-title {
                    font-size: 20px;
                }
            }

            /* Print styles */
            @media print {
                body {
                    background: white;
                    color: black;
                }

                .header-title {
                    color: #000000;
                }

                .bookmark-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    box-shadow: none;
                }

                .bookmark-card:hover {
                    transform: none;
                }

                .bookmark-title {
                    color: #000000;
                }

                .tag {
                    background: #e5e7eb;
                    color: #000000;
                }

                DD {
                    background: #f3f4f6;
                    color: #000000;
                }
            }
        </style>

<div class="container">
    <div class="header-section">
        <h1 class="header-title">Your Bookmarks</h1>
        <p class="header-subtitle">Exported on """ + datetime.now().strftime('%B %d, %Y at %I:%M %p IST') + """</p>
    </div>
    <DL><p>
"""

    for b in bookmarks:
        ub = UserBookmark.query.filter_by(bookmark_id=b.id, user_id=user_id).first()
        tags = ",".join(t.name for t in b.tags)
        title = (ub.title if ub else b.url).replace('&', '&amp;').replace('<', '&lt;')
        created_ist = (ub.created_at if ub else b.created_at).replace(tzinfo=pytz.UTC).astimezone(ist)
        add_date = int(created_ist.timestamp())
        
        html += f'    <DT><A HREF="{b.url}" ADD_DATE="{add_date}" TAGS="{tags}" class="bookmark-card">\n'
        html += f'        <span class="bookmark-title">{title}</span>\n'
        html += f'        <span class="bookmark-url">{b.url}</span>\n'
        
        if tags:
            html += f'        <div class="bookmark-tags">\n'
            for tag in tags.split(','):
                html += f'            <span class="tag">{tag.strip()}</span>\n'
            html += f'        </div>\n'
        
        html += f'    </A></DT>\n'
    html += """    </DL></p>
</div>"""

    return Response(
        html,
        mimetype="text/html",
        headers={"Content-Disposition": f"attachment;filename=linkvault_user{user_id}_{datetime.now().strftime('%Y%m%d')}.html"}
    )

@bp.route('/tags', methods=['GET'])
@login_required
def list_tags():
    user_id = current_user.id
    
    # Count actual tag occurrences for this user
    tags_result = db.session.query(
        Tag.name,
        db.func.count(tag_user_bookmarks.c.bookmark_id).label('count')
    ).join(
        tag_user_bookmarks,
        Tag.id == tag_user_bookmarks.c.tag_id
    ).filter(
        tag_user_bookmarks.c.user_id == user_id
    ).group_by(
        Tag.id, Tag.name
    ).having(
        db.func.count(tag_user_bookmarks.c.bookmark_id) > 0
    ).order_by(
        db.desc('count'), Tag.name
    ).all()
    
    # Convert tuples to dictionaries
    tags = [{'name': name, 'count': count} for name, count in tags_result]

    # Check if request wants JSON (API call)
    if request.is_json or 'application/json' in request.headers.get('Accept', ''):
        return jsonify(tags)
    
    # Otherwise render HTML template
    return render_template('tags.html', tags=tags, username=current_user.username)

@bp.route('/bookmarks', methods=['GET'])
@login_required
def list_bookmarks():
    """List all bookmarks with filtering (no pagination)"""
    user_id = current_user.id

    # Filters
    tag_filter = request.args.get('tag')
    search_query = request.args.get('q')
    archived_filter = request.args.get('archived')

    # Start base query
    query = db.session.query(Bookmark).join(
        UserBookmark
    ).filter(
        UserBookmark.user_id == user_id
    )

    # validate allowed query parameters
    allowed_params = {'page', 'per_page', 'tag', 'q', 'archived', 'id'}
    invalid_params = set(request.args.keys()) - allowed_params
    if invalid_params:
        mainMessage = "Invalid query parameter(s) provided."
        subMessage = f"Invalid: {', '.join(invalid_params)}. Allowed: {', '.join(allowed_params)}"

        if request.accept_mimetypes.accept_html:
        # Render custom error page
            return render_template(
            'noBookmark.html',
            SCode=400,
            message=mainMessage,
            subMessage=subMessage
        ), 400

    # Default JSON response
        return jsonify({
        'error': mainMessage,
        'details': subMessage,
        'correct_url_example': url_for('bookmarks_api.list_bookmarks', _external=True)
    }), 400


    # Apply tag filter
    if tag_filter:
        query = query.join(
            tag_user_bookmarks,
            db.and_(
                tag_user_bookmarks.c.bookmark_id == Bookmark.id,
                tag_user_bookmarks.c.user_id == user_id
            )
        ).join(
            Tag,
            Tag.id == tag_user_bookmarks.c.tag_id
        ).filter(
            Tag.name.ilike(tag_filter.lower())
        )

    # Apply search filter
    if search_query:
        search = f"%{search_query}%"
        query = query.filter(
            db.or_(
                UserBookmark.title.ilike(search),
                UserBookmark.notes.ilike(search),
                Bookmark.url.ilike(search)
            )
        )

    # Apply archived filter
    if archived_filter is not None:
        archived_bool = archived_filter.lower() == 'true'
        query = query.filter(UserBookmark.archived == archived_bool)

    # Fetch all bookmarks (no pagination)
    bookmarks = query.order_by(UserBookmark.created_at.desc()).all()

    # Convert to dict
    bookmark_data = [b.to_dict(user_id=user_id) for b in bookmarks]

    # JSON response
    wants_json = (
        request.headers.get('Accept') == 'application/json' or
        request.args.get('format') == 'json' or
        request.is_json
    )

    if wants_json:
        return jsonify({
            'bookmarks': bookmark_data,
            'total': len(bookmark_data),
            'current_tag': tag_filter
        }), 200

    # Render HTML template
    return render_template(
        'tag_filter.html',
        bookmarks=bookmark_data,
        user_id=user_id,
        total=len(bookmark_data),
        tag=tag_filter,
        q=search_query,
        current_tag=tag_filter
    )


@bp.route('/bookmarkstwo', methods=['GET'])
@login_required
def dashboard2():
    user_id = current_user.id

    # Pagination (optional, default all)
    page = request.args.get('page', 1, type=int)
    per_page = 5  # you can adjust or paginate
     
    bookmarks_query = (
        db.session.query(Bookmark)
        .join(UserBookmark)
        .filter(
            UserBookmark.user_id == user_id,
            UserBookmark.archived == False    # ⬅ hide archived bookmarks
        )
        .order_by(UserBookmark.created_at.desc())
    )

    total = bookmarks_query.count()
    total_pages = (total + per_page - 1) // per_page
    bookmarks = bookmarks_query.offset((page-1)*per_page).limit(per_page).all()
    bookmark_data = [b.to_dict(user_id=user_id) for b in bookmarks]

    return render_template(
        'all_bookmarks.html',
        bookmarks=bookmark_data,
        user_id=user_id,
        page=page,
        per_page=per_page,
        total=total,
        total_pages=total_pages
    )

@bp.route('/bookmarks/<int:bookmark_id>/qr', methods=['GET'])
def gen_qr(bookmark_id):
    # 1️⃣ Check if user is logged in
    user_id = current_user.id

    # 2️⃣ Check if this bookmark belongs to the user
    from app.models.user_bookmark import UserBookmark

    ub = UserBookmark.query.filter_by(
        user_id=user_id,
        bookmark_id=bookmark_id
    ).first()

    if not ub:
        return jsonify({'error': 'Unauthorized or bookmark not found'}), 404

    # 3️⃣ Fetch the bookmark
    bookmark = Bookmark.query.get(bookmark_id)
    if not bookmark:
        return jsonify({'error': 'Bookmark not found'}), 404

    # 4️⃣ Generate QR
    qr = segno.make(bookmark.url)
    qr_data_uri = qr.png_data_uri(scale=5)

    return jsonify({
        'qr_data_uri': qr_data_uri,
        'qr_title': ub.title,       # user's title override
        'qr_url': bookmark.url
    }), 200


@bp.route('/bookmarks/archived')
@login_required
def archived_bookmarks():
    user_id = current_user.id
    bookmarks = Bookmark.query.filter_by(user_id=user_id, archived=True).all()
    return render_template("archived.html", bookmarks=bookmarks, user_id=user_id)

@bp.route('/archived', methods=['GET'])
@login_required
def archived_page():
    user_id = current_user.id

    archived_query = (
        db.session.query(Bookmark)
        .join(UserBookmark)
        .filter(
            UserBookmark.user_id == user_id,
            UserBookmark.archived == True        # only archived
        )
        .order_by(UserBookmark.created_at.desc())
    )

    bookmarks = archived_query.all()
    bookmark_data = [b.to_dict(user_id=user_id) for b in bookmarks]

    return render_template(
        'archived.html',
        bookmarks=bookmark_data,
        user_id=user_id
    )

# error handling
# error handling with template rendering
from flask import request

@bp.errorhandler(400)
def bad_request(e):
    if request.accept_mimetypes.accept_html:
        return render_template('noBookmark.html', SCode=400, message=str(e)), 400
    return jsonify({'error': 'Bad Request', 'message': str(e)}), 400

@bp.errorhandler(404)
def not_found(e):
    if request.accept_mimetypes.accept_html:
        return render_template('noBookmark.html', SCode=404, message='Page not found'), 404
    return jsonify({'error': 'Not Found', 'message': str(e)}), 404

@bp.errorhandler(500)
def internal_error(e):
    db.session.rollback()
    if request.accept_mimetypes.accept_html:
        return render_template('noBookmark.html', SCode=500, message='Internal server error'), 500
    return jsonify({'error': 'Server Error', 'message': str(e)}), 500