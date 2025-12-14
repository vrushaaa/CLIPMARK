# app/routes/auth.py

from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from app import db, bcrypt
from app.models.user import User
from authlib.integrations.flask_client import OAuth
import os
import requests
from flask_mail import Message
from app import mail
from app.models.user import User



import re
from app.models.user_bookmark import UserBookmark
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

# # ----------------------------
# # UPDATE PROFILE (PUT /auth/me)
# # ----------------------------
@auth.route('/me', methods=['PUT'])
@login_required
def update_profile():
    data = request.get_json() or {}

    updated = False

    # Update username if provided
    if 'username' in data:
        new_username = data['username'].strip().lower()
        if not new_username:
            return jsonify({"error": "Username cannot be empty"}), 400
            
        if not re.match(r'^[a-z0-9_]{3,20}$', new_username):
            return jsonify({"error": "Username must be 3-20 characters (letters, numbers, underscore only)"}), 400

        existing = User.query.filter(
            User.username == new_username,
            User.id != current_user.id
        ).first()
        if existing:
            return jsonify({"error": "Username already taken"}), 409

        current_user.username = new_username
        updated = True

    # Update email if provided
    email = data.get('email')
    if email:
        email = email.strip().lower()
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            return jsonify({"error": "Invalid email format"}), 400
        
        existing = User.query.filter(
            User.email == email,
            User.id != current_user.id
        ).first()
        if existing:
            return jsonify({"error": "Email already registered"}), 409
            
        current_user.email = email
        updated = True

    if not updated:
        return jsonify({
            "message": "No changes made",
            "user": current_user.to_dict()
        }), 200

    try:
        db.session.commit()
        
        # Refresh session with updated user
        login_user(User.query.get(current_user.id))
        
        return jsonify({
            "message": "Profile updated successfully",
            "user": current_user.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update profile"}), 500

# ----------------------------
# Delete account
# ----------------------------
@auth.route('/me', methods=['DELETE'])
@login_required
def delete_account():
    try:
        user_id = current_user.id
        deleted = UserBookmark.query.filter_by(user_id=user_id).delete()
        print(f"Deleted {deleted} UserBookmark entries for user {user_id}")  
        
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            print(f"Deleted user {user_id}") 
        else:
            print("User not found for deletion")
        
        db.session.commit()
        
        logout_user()
        
        return jsonify({
            "message": "Account and all data deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Delete error: {e}")  
        return jsonify({"error": "Failed to delete account"}), 500
    
    
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

# ----------------------------
# GOOGLE LOGIN / SIGNUP
# ----------------------------
@auth.route('/google', methods=['POST'])
def google_login():
    if current_user.is_authenticated:
        return jsonify({"message": "Already logged in"}), 200

    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({"error": "Google token required"}), 400

    # 🔹 Fetch user info from Google using ACCESS TOKEN
    google_response = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    if google_response.status_code != 200:
        return jsonify({"error": "Invalid Google token"}), 401

    userinfo = google_response.json()

    email = userinfo.get("email")
    name = userinfo.get("name")

    if not email:
        return jsonify({"error": "Email not provided by Google"}), 400

    # 🔹 Check if user exists
    user = User.query.filter_by(email=email.lower()).first()

    if not user:
        username_base = email.split("@")[0].lower()
        username = username_base
        counter = 1

        while User.query.filter_by(username=username).first():
            username = f"{username_base}{counter}"
            counter += 1

        user = User(
            name=name or username,
            email=email.lower(),
            username=username
        )

        user.password_hash = None  # Google users don't need password

        db.session.add(user)
        db.session.commit()

    login_user(user)

    return jsonify({
        "message": "Google login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 200

#forgot password 
@auth.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email.lower()).first()

    if not user:
        return jsonify({"message": "If that email exists, a reset link was sent"}), 200

    token = user.generate_reset_token()

    reset_url = f"http://localhost:5173/auth/reset-password/{token}"

    msg = Message(
        subject="Reset Your Clipmark Password",
        recipients=[user.email],
        body=f"""
Hi {user.name},

Click the link below to reset your password:

{reset_url}

This link expires in 1 hour.
"""
    )

    mail.send(msg)

    return jsonify({"message": "Password reset link sent"}), 200

#reset password
@auth.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json()
    password = data.get('password')

    if not password:
        return jsonify({"error": "Password required"}), 400

    user = User.verify_reset_token(token)

    if not user:
        return jsonify({"error": "Invalid or expired token"}), 400

    user.set_password(password)
    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200

