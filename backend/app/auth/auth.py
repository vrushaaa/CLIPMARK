# app/routes/auth.py
from flask import Blueprint, request, jsonify, render_template, redirect, url_for, flash, current_app
from flask_login import login_user, logout_user, login_required, current_user
from flask_dance.contrib.google import google
from flask_dance.contrib.github import github
from itsdangerous import URLSafeTimedSerializer
from app import db, bcrypt
from app.models.user import User
from flask_mail import Message

auth = Blueprint('auth', __name__)

# REGISTER 
@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('bookmarks_api.dashboard'))

    if request.method == 'POST' and request.form:
        name = request.form.get('name')
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')

        # Validate all fields
        if not all([name, email, username, password]):
            flash('Please fill all fields', 'error')
            return redirect(url_for('auth.signup'))

        if User.query.filter_by(username=username).first():
            flash('Username already exists', 'error')
            return redirect(url_for('auth.signup'))

        if User.query.filter_by(email=email).first():
            flash('Email already registered', 'error')
            return redirect(url_for('auth.signup'))

        # Create user
        user = User(
            name=name.strip(),
            email=email.strip().lower(),
            username=username.strip().lower()
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        flash('Registered successfully! Please login.', 'success')
        return redirect(url_for('auth.login'))

    elif request.is_json:
        data = request.get_json()
        name = data.get('name')  
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        if not all([name, email, username, password]):
            return jsonify({
                'error': 'All fields are required: name, email, username, password'
            }), 400

        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 400

        user = User(
            name=name.strip(),
            email=email.strip().lower(),
            username=username.strip().lower()
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        return jsonify({
            'message': 'Registered successfully!',
            'user': {
                'id': user.id,
                'name': user.name,       
                'email': user.email,
                'username': user.username
            }
        }), 201

    return render_template('signup.html')

# LOGIN 
@auth.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('bookmarks_api.dashboard'))
    
    if request.method == 'POST' and request.form:
        identifier = request.form.get('username')  
        password = request.form.get('password')

        if not identifier or not password:
            flash('Please fill all fields', 'error')
            return redirect(url_for('auth.login'))

        user = (
            User.query.filter_by(username=identifier.lower()).first() or
            User.query.filter_by(email=identifier.lower()).first()
        )

        if user and user.check_password(password):
            login_user(user)
            flash(f'Welcome back, {user.username}!', 'success')
            return redirect(url_for('bookmarks_api.dashboard'))

        flash('Invalid username/email or password', 'error')
        return redirect(url_for('auth.login'))

    elif request.is_json:
        data = request.get_json()
        identifier = data.get('username')
        password = data.get('password')

        if not identifier or not password:
            return jsonify({'error': 'username/email and password required'}), 400

        # Login via username or email
        user = (
            User.query.filter_by(username=identifier.lower()).first() or
            User.query.filter_by(email=identifier.lower()).first()
        )

        if user and user.check_password(password):
            login_user(user)
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            }), 200

        return jsonify({'error': 'Invalid credentials'}), 401

    return render_template('login.html')

# LOGOUT 
@auth.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully', 'success')
    
    if request.is_json:
        return jsonify({'message': 'Logged out'}), 200
    
    return redirect(url_for('auth.login'))


@auth.errorhandler(400)
def bad_request(e):
    mainMessage = "Bad Request"
    subMessage = str(e.description) if hasattr(e, 'description') else "Invalid input"

    if request.accept_mimetypes.accept_html:
        return render_template('noBookmark.html', SCode=400, message=mainMessage, subMessage=subMessage), 400

    return jsonify({'error': mainMessage, 'details': subMessage}), 400

@auth.errorhandler(404)
def not_found(e):
    mainMessage = "Not Found"
    subMessage = "Resource not found"

    if request.accept_mimetypes.accept_html:
        return render_template('noBookmark.html', SCode=404, message=mainMessage, subMessage=subMessage), 404

    return jsonify({'error': mainMessage, 'details': subMessage}), 404

@auth.errorhandler(409)
def conflict(e):
    mainMessage = "Conflict"
    subMessage = str(e.description) if hasattr(e, 'description') else "Resource already exists"

    if request.accept_mimetypes.accept_html:
        return render_template('noBookmark.html', SCode=409, message=mainMessage, subMessage=subMessage), 409

    return jsonify({'error': mainMessage, 'details': subMessage}), 409

@auth.errorhandler(500)
def internal_error(e):
    mainMessage = "Internal Server Error"
    subMessage = "Something went wrong"

    if request.accept_mimetypes.accept_html:
        return render_template('noBookmark.html', SCode=500, message=mainMessage, subMessage=subMessage), 500

    return jsonify({'error': mainMessage, 'details': subMessage}), 500