# app/routes/user_routes.py
from flask import Blueprint, request, jsonify
from app.models.user import User
from app.models.user_bookmark import UserBookmark
from app.models.bookmark import Bookmark
from app.models.tag import Tag
from app import db
from sqlalchemy.exc import IntegrityError
import re

user_bp = Blueprint('user',__name__)  

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@user_bp.route('', methods=['POST'])
def create_user():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Invalid JSON payload'}), 400

    username = data.get('username')
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([username, name, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    if len(username.strip()) < 3:
        return jsonify({'error': 'Username must be at least 3 characters'}), 400
    if not username.replace('_', '').replace('-', '').isalnum():
        return jsonify({'error': 'Username can only contain letters, numbers, _ and -'}), 400

    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already taken'}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    try:
        user = User(username=username.strip(), name=name.strip(), email=email.strip())
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return jsonify(user.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Database error: could not create user'}), 500

@user_bp.route('/<int:user_id>/bookmarks', methods=['GET'])
def get_user_bookmarks(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    query = user.saved_bookmarks

    tag = request.args.get('tag')
    if tag:
        tag = tag.strip().lower()
        if not tag:
            return jsonify({'error': 'Tag cannot be empty'}), 400
        query = query.join(Bookmark.tags).filter(Tag.name.ilike(tag))

    archived = request.args.get('archived')
    if archived is not None:
        if archived.lower() not in ['true', 'false']:
            return jsonify({'error': 'archived must be true or false'}), 400
        archived_bool = archived.lower() == 'true'
        query = query.filter(UserBookmark.archived == archived_bool)

    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    if page < 1: page = 1
    if per_page < 1: per_page = 20

    try:
        paginated = query.order_by(Bookmark.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        return jsonify({
            "bookmarks": [ub.bookmark.to_dict(user_id=user_id) for ub in paginated.items],
            "total": paginated.total,
            "pages": paginated.pages,
            "page": page,
            "per_page": per_page
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve bookmarks', 'details': str(e)}), 500

# Error handling
@user_bp.errorhandler(400)
def bad_request(e):
    return jsonify({'error': 'Bad Request', 'message': str(e.description) if hasattr(e, 'description') else 'Invalid input'}), 400

@user_bp.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not Found', 'message': 'Resource not found'}), 404

@user_bp.errorhandler(409)
def conflict(e):
    return jsonify({'error': 'Conflict', 'message': str(e.description) if hasattr(e, 'description') else 'Resource already exists'}), 409

@user_bp.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal Server Error', 'message': 'Something went wrong'}), 500