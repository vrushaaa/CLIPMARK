# app/routes/auth.py

from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from app import db, bcrypt
from app.models.user import User

auth = Blueprint('auth', __name__)


# ----------------------------
# SIGNUP (JSON ONLY)
# ----------------------------
@auth.route('/signup', methods=['POST'])
def signup():
    if current_user.is_authenticated:
        return jsonify({"message": "Already logged in"}), 200

    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    # Field validation
    if not all([name, email, username, password]):
        return jsonify({"error": "All fields are required"}), 400

    # Duplicate check
    if User.query.filter_by(username=username.lower()).first():
        return jsonify({"error": "Username already exists"}), 409

    if User.query.filter_by(email=email.lower()).first():
        return jsonify({"error": "Email already registered"}), 409

    # Create user
    user = User(
        name=name.strip(),
        email=email.strip().lower(),
        username=username.strip().lower()
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Signup successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "username": user.username
        }
    }), 201


# ----------------------------
# LOGIN (JSON ONLY)
# ----------------------------
@auth.route('/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return jsonify({"message": "Already logged in"}), 200

    data = request.get_json()

    identifier = data.get('username')  # can be username or email
    password = data.get('password')

    if not identifier or not password:
        return jsonify({"error": "username/email and password required"}), 400

    # Find user (username OR email)
    user = (
        User.query.filter_by(username=identifier.lower()).first() or
        User.query.filter_by(email=identifier.lower()).first()
    )

    if user and user.check_password(password):
        login_user(user)
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401


# ----------------------------
# LOGOUT (JSON ONLY)
# ----------------------------
@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"}), 200


# ----------------------------
# AUTH CHECK (OPTIONAL)
# ----------------------------
@auth.route('/me', methods=['GET'])
@login_required
def check_auth():
    """React can call this to check if user is logged in."""
    if current_user.is_authenticated:
        return jsonify({
            "logged_in": True,
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "email": current_user.email
            }
        }), 200

    return jsonify({"logged_in": False}), 200


# ----------------------------
# ERROR HANDLERS (JSON ONLY)
# ----------------------------
@auth.errorhandler(400)
def bad_request(e):
    return jsonify({"error": "Bad request", "details": str(e)}), 400

@auth.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found"}), 404

@auth.errorhandler(409)
def conflict(e):
    return jsonify({"error": "Conflict", "details": str(e)}), 409

@auth.errorhandler(500)
def internal_error(e):
    db.session.rollback()
    return jsonify({"error": "Server error"}), 500
