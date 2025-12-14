from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from config import Config
import os
from flask_cors import CORS
from flask_mail import Mail



db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
login_manager = LoginManager()
mail = Mail()

def create_app():
    app = Flask(
        __name__
    )

    CORS(app, supports_credentials=True)
    
    app.config.from_object(Config)

    app.config['SECRET_KEY'] = 'your-secret-key'

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)

    login_manager.login_view = "None"
    # login_manager.login_message_category = None

    
    @login_manager.user_loader
    def load_user(user_id):
        from app.models.user import User
        return User.query.get(int(user_id))

    from app.models.user import User
    from app.models.bookmark import Bookmark
    from app.models.tag import Tag
    from app.models.user_bookmark import UserBookmark
    from app.models.tag_user_bookmark import tag_user_bookmarks

    # Blueprints
    from app.routes.bookmark_routes import bp as bookmark_bp, short_bp
    from app.routes.user_routes import user_bp

    app.register_blueprint(bookmark_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(short_bp)

    # auto update tag_user_bookmark.bookmark_count
    from sqlalchemy import event
    from app.models.bookmark import Bookmark
    from app.models.user_bookmark import UserBookmark
    from app.models.tag import Tag
    from app.models.tag_user_bookmark import tag_user_bookmarks

    @event.listens_for(db.session, "after_commit")
    def update_tag_counts(session):
        # Cllect affected user_ids and tag_ids
        affected_pairs = set()

        for obj in session.new.union(session.dirty).union(session.deleted):
            # bookmark modified → check its tag associations + all users who saved it
            if isinstance(obj, Bookmark):
                # all users who saved this bookmark
                users = obj.user_bookmarks.all()
                tags = obj.tags.all()
                for ub in users:
                    for t in tags:
                        affected_pairs.add((ub.user_id, t.id))

            # userBookmark created/updated/deleted
            elif isinstance(obj, UserBookmark):
                # bookmark may have tags
                tags = obj.bookmark.tags.all()
                for t in tags:
                    affected_pairs.add((obj.user_id, t.id))

        # no updates needed
        if not affected_pairs:
            return

        # recalc bookmark_count for each (user, tag)
        for (user_id, tag_id) in affected_pairs:
            count = session.execute(
                db.select(db.func.count())
                .select_from(tag_user_bookmarks)
                .where(tag_user_bookmarks.c.user_id == user_id)
                .where(tag_user_bookmarks.c.tag_id == tag_id)
            ).scalar()

            # update all rows for this (user_id, tag_id)
            session.execute(
                db.update(tag_user_bookmarks)
                .where(tag_user_bookmarks.c.user_id == user_id)
                .where(tag_user_bookmarks.c.tag_id == tag_id)
                .values(bookmark_count=count)
            )

        session.commit()

    from app.auth.auth import auth  # added auth blueprint import
    app.register_blueprint(auth, url_prefix='/auth')  # registered auth blueprint
    app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key")  # added secret key for sessions

    def http_url(url):
        if url.startswith('http://') or url.startswith('https://'):
            return url
        return 'https://' + url
    app.jinja_env.globals.update(http_url=http_url)

    def short_http_url(url):
        if url.startswith('http://') or url.startswith('https://'):
            return url
        return 'http://127.0.0.1:5000/' + url
    app.jinja_env.globals.update(short_http_url=short_http_url)


    return app