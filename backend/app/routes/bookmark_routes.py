import os
import tempfile
from flask import Blueprint, request, jsonify, redirect, url_for, Response
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
import segno
from app.utils.routes_utils import extract_meta_keywords, extract_title

# Blueprints
bp = Blueprint('bookmarks_api', __name__, url_prefix='/api')
short_bp = Blueprint('short', __name__, url_prefix='/')


# HOME (API welcome)
@short_bp.route('/')
def home():
    return jsonify({"message": "Flask API is running"}), 200


# DASHBOARD DATA
@bp.route('/', methods=['GET'])
@login_required
def dashboard():
    user_id = current_user.id
    username = current_user.username

    total_bookmarks = UserBookmark.query.filter_by(user_id=user_id).count()
    archived_count = UserBookmark.query.filter_by(user_id=user_id, archived=True).count()

    return jsonify({
        "username": username,
        "total_bookmarks": total_bookmarks,
        "archived": archived_count
    }), 200


# SHORT URL REDIRECT 
@short_bp.route('/<short_code>')
def redirect_short(short_code):
    bookmark = Bookmark.query.filter_by(short_url=short_code).first_or_404()
    bookmark.updated_at = datetime.utcnow()
    db.session.commit()
    return redirect(bookmark.url)


# CREATE BOOKMARK
@bp.route('/bookmarks', methods=['POST'])
@login_required
def create_bookmark():
    data = request.get_json()
    url = data.get('url')
    notes = data.get('notes', '')
    tags = data.get('tags', [])
    archived = data.get('archived', False)
    title = data.get('title')
    user_id = current_user.id

    if not url:
        return jsonify({"error": "URL is required"}), 400

    norm_url = normalize_url(url)
    url_hash = generate_url_hash(norm_url)

    existing = Bookmark.query.filter_by(hash_url=url_hash).first()

    if not tags:
        auto_tags = extract_meta_keywords(norm_url)
        if auto_tags:
            tags = auto_tags

    # If bookmark exists
    if existing:
        already = UserBookmark.query.filter_by(
            user_id=user_id,
            bookmark_id=existing.id
        ).first()

        if already:
            return jsonify({"error": "You already saved this link"}), 409

        bookmark = existing
        if not title:
            title = extract_title(norm_url) or "Untitled"
    else:
        bookmark = Bookmark(url=norm_url)
        bookmark.set_hash()
        bookmark.set_short_url()
        db.session.add(bookmark)
        db.session.flush()

        if not title:
            title = extract_title(norm_url) or "Untitled"

    # Create UserBookmark entry
    ub = UserBookmark(
        user_id=user_id,
        bookmark_id=bookmark.id,
        title=title,
        notes=notes,
        archived=archived
    )
    db.session.add(ub)

    # Tags
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
        "message": "Bookmark created",
        "bookmark": bookmark.to_dict(user_id=user_id)
    }), 201


# GET SINGLE BOOKMARK
@bp.route('/bookmarks/<int:bookmark_id>', methods=['GET'])
@login_required
def get_bookmark(bookmark_id):
    bookmark = Bookmark.query.get(bookmark_id)
    if not bookmark:
        return jsonify({"error": "Bookmark not found"}), 404

    user_id = current_user.id
    return jsonify(bookmark.to_dict(user_id=user_id)), 200


# UPDATE BOOKMARK
@bp.route('/bookmarks/<int:bookmark_id>', methods=['PUT'])
@login_required
def update_bookmark(bookmark_id):
    data = request.get_json()
    user_id = current_user.id

    ub = UserBookmark.query.filter_by(
        user_id=user_id, bookmark_id=bookmark_id
    ).first()

    if not ub:
        return jsonify({"error": "Not found or unauthorized"}), 404

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
        # Remove existing tags for this user
        db.session.execute(
            tag_user_bookmarks.delete().where(
                tag_user_bookmarks.c.bookmark_id == bookmark_id,
                tag_user_bookmarks.c.user_id == user_id
            )
        )
        # Add new tags
        for tag_name in data['tags']:
            tag_name = tag_name.strip().lower()
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

    bookmark = Bookmark.query.get(bookmark_id)

    return jsonify({
        "message": "Bookmark updated",
        "bookmark": bookmark.to_dict(user_id=user_id)
    }), 200


# TOGGLE ARCHIVE
@bp.route('/bookmarks/<int:bookmark_id>/archive', methods=['PATCH'])
@login_required
def toggle_archive(bookmark_id):
    user_id = current_user.id
    ub = UserBookmark.query.filter_by(user_id=user_id, bookmark_id=bookmark_id).first()

    if not ub:
        return jsonify({"error": "Bookmark not found"}), 404

    ub.archived = not ub.archived
    ub.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "Archive toggled", "archived": ub.archived}), 200


# DELETE BOOKMARK
@bp.route('/bookmarks/<int:bookmark_id>', methods=['DELETE'])
@login_required
def delete_bookmark(bookmark_id):
    user_id = current_user.id

    ub = UserBookmark.query.filter_by(user_id=user_id, bookmark_id=bookmark_id).first()

    if not ub:
        return jsonify({"error": "Not found or unauthorized"}), 404

    try:
        db.session.execute(
            tag_user_bookmarks.delete().where(
                tag_user_bookmarks.c.user_id == user_id,
                tag_user_bookmarks.c.bookmark_id == bookmark_id
            )
        )

        db.session.delete(ub)
        db.session.commit()

        return jsonify({"message": "Bookmark deleted"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Delete failed", "details": str(e)}), 500


# EXPORT BOOKMARKS (HTML DOWNLOAD)
# @bp.route('/export', methods=['GET'])
# @login_required
# def export_bookmarks():
#     user_id = current_user.id

#     bookmarks = db.session.query(Bookmark).join(UserBookmark)\
#         .filter(UserBookmark.user_id == user_id).all()

#     if not bookmarks:
#         return jsonify({"error": "No bookmarks found"}), 404

#     ist = pytz.timezone('Asia/Kolkata')

#     html = """
# <html>
# <head>
#   <title>ClipMark Export</title>
#   <style>
#     body { font-family: Arial; padding: 20px; }
#     h1 { color: #1b98b1; }
#     li { margin-bottom: 8px; }
#   </style>
# </head>
# <body>
# <h1>Your Bookmarks</h1>
# <ul>
# """


#     for b in bookmarks:
#         html += f"<li><a href='{b.url}'>{b.url}</a></li>"

#     html += "</ul></body></html>"

#     return Response(
#         html,
#         mimetype="text/html",
#         headers={
#             "Content-Disposition": f"attachment; filename=bookmarks_{datetime.now().strftime('%Y%m%d')}.html"
#         }
#     )


# EXPORT BOOKMARKS (HTML DOWNLOAD)
@bp.route('/export', methods=['GET'])
@login_required
def export_bookmarks():
    user_id = current_user.id

    bookmarks = (
        db.session.query(Bookmark)
        .join(UserBookmark)
        .filter(UserBookmark.user_id == user_id)
        .all()
    )

    if not bookmarks:
        return jsonify({"error": "No bookmarks found"}), 404

    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>ClipMark – Bookmarks Export</title>
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial;
      background: #e9f9fc;
      color: #07262c;
      margin: 0;
      padding: 40px;
    }}

    .container {{
      max-width: 900px;
      margin: auto;
      background: #ffffff;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 10px 30px rgba(33, 190, 222, 0.15);
    }}

    h1 {{
      color: #1b98b1;
      margin-bottom: 8px;
    }}

    .subtitle {{
      color: #5f7f87;
      margin-bottom: 24px;
      font-size: 14px;
    }}

    ul {{
      list-style: none;
      padding: 0;
      margin: 0;
    }}

    li {{
      padding: 14px 16px;
      border: 1px solid #d3f2f8;
      border-radius: 12px;
      margin-bottom: 12px;
      transition: background 0.2s ease;
    }}

    li:hover {{
      background: #f4fdff;
    }}

    a {{
      color: #147285;
      text-decoration: none;
      font-weight: 500;
      word-break: break-all;
    }}

    a:hover {{
      text-decoration: underline;
    }}

    footer {{
      margin-top: 32px;
      font-size: 12px;
      color: #7a9da6;
      text-align: center;
    }}
  </style>
</head>
<body>
  <div class="container">
    <h1>📌 Your ClipMark Bookmarks</h1>
    <div class="subtitle">
      Exported on {datetime.now().strftime('%d %B %Y')}
    </div>

    <ul>
"""

    for b in bookmarks:
        html += f"""
      <li>
        <a href="{b.url}" target="_blank">{b.url}</a>
      </li>
"""

    html += """
    </ul>

    <footer>
      Generated by <strong>ClipMark</strong>
    </footer>
  </div>
</body>
</html>
"""

    return Response(
        html,
        mimetype="text/html",
        headers={
            "Content-Disposition": f"attachment; filename=clipmark_export_{datetime.now().strftime('%Y%m%d')}.html"
        }
    )



# TAG LIST
@bp.route('/tags', methods=['GET'])
@login_required
def list_tags():
    user_id = current_user.id

    tags_result = db.session.query(
        Tag.name,
        db.func.count(tag_user_bookmarks.c.bookmark_id).label("count")
    ).join(
        tag_user_bookmarks, Tag.id == tag_user_bookmarks.c.tag_id
    ).filter(
        tag_user_bookmarks.c.user_id == user_id
    ).group_by(
        Tag.id, Tag.name
    ).all()

    tags = [{"name": name, "count": count} for name, count in tags_result]

    return jsonify(tags), 200

# LIST ALL BOOKMARKS (NO JINJA)
@bp.route('/bookmarks', methods=['GET'])
@login_required
def list_bookmarks():
    user_id = current_user.id

    tag_filter = request.args.get('tag')
    q = request.args.get('q')
    archived_filter = request.args.get('archived')
    favourite_filter = request.args.get('favourite')

    query = db.session.query(Bookmark).join(UserBookmark).filter(
        UserBookmark.user_id == user_id
    )

    if tag_filter:
        query = query.join(
            tag_user_bookmarks,
            tag_user_bookmarks.c.bookmark_id == Bookmark.id
        ).join(
            Tag, Tag.id == tag_user_bookmarks.c.tag_id
        ).filter(Tag.name.ilike(tag_filter))

    if q:
        search = f"%{q}%"
        query = query.filter(
            db.or_(
                UserBookmark.title.ilike(search),
                UserBookmark.notes.ilike(search),
                Bookmark.url.ilike(search)
            )
        )

    if archived_filter is not None:
        query = query.filter(
            UserBookmark.archived == (archived_filter == 'true')
        )

    if favourite_filter is not None:
        query = query.filter(
            UserBookmark.is_favourite == (favourite_filter == 'true')
        )

    bookmarks = query.order_by(UserBookmark.created_at.desc()).all()

    return jsonify({
        "bookmarks": [b.to_dict(user_id=user_id) for b in bookmarks],
        "total": len(bookmarks)
    }), 200


# GENERATE QR
@bp.route('/bookmarks/<int:bookmark_id>/qr', methods=['GET'])
@login_required
def gen_qr(bookmark_id):
    user_id = current_user.id

    ub = UserBookmark.query.filter_by(user_id=user_id, bookmark_id=bookmark_id).first()
    if not ub:
        return jsonify({"error": "Not authorized"}), 404

    bookmark = Bookmark.query.get(bookmark_id)
    if not bookmark:
        return jsonify({"error": "Bookmark not found"}), 404

    qr = segno.make(bookmark.url)
    qr_data = qr.png_data_uri(scale=5)

    return jsonify({
        "qr_data_uri": qr_data,
        "title": ub.title,
        "url": bookmark.url
    }), 200

@bp.route('/bookmarks/<int:bookmark_id>/favourite', methods=['PATCH'])
@login_required
def toggle_favourite(bookmark_id):
    user_id = current_user.id
    ub = UserBookmark.query.filter_by(user_id=user_id, bookmark_id=bookmark_id).first()
    
    if not ub:
        return jsonify({"error": "Bookmark not found"}), 404
    
    ub.is_favourite = not ub.is_favourite
    ub.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({"message": "Favourite toggled", "is_favourite": ub.is_favourite}), 200

# ERROR HANDLERS (JSON ONLY)
@bp.errorhandler(400)
def bad_request(e):
    return jsonify({"error": "Bad request", "message": str(e)}), 400

@bp.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found"}), 404

@bp.errorhandler(500)
def internal_error(e):
    db.session.rollback()
    return jsonify({"error": "Internal server error"}), 500
