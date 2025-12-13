from app import db
from .user_bookmark import UserBookmark
import secrets
import string
from urllib.parse import urlparse
from flask import url_for
from app.utils.bookmark_utils import generate_url_hash, generate_short_code, normalize_url


class Bookmark(db.Model):
    __tablename__ = 'bookmark'

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False, unique=True)
    hash_url = db.Column(db.String(32), nullable=False, unique=True)
    short_url = db.Column(db.String(20), nullable=False, unique=True)

    # relationships
    user_bookmarks = db.relationship(
        'UserBookmark',
        back_populates='bookmark',
        cascade='all, delete-orphan',
        lazy='dynamic'
    )
    tags = db.relationship(
        'Tag',
        secondary='tag_user_bookmark',
        back_populates='bookmarks',
        lazy='dynamic'
    )

    def set_hash(self):
        self.hash_url = generate_url_hash(self.url)

    def set_short_url(self):
        self.short_url = generate_short_code()

    def to_dict(self, user_id=None):
        data = {
            'id': self.id,
            'url': self.url,
            'hash_url': self.hash_url,
            'short_url': self.short_url,
            'full_short_url': url_for('short.redirect_short', short_code=self.short_url, _external=True),
            'tags': [t.name for t in self.tags]
        }
        if user_id:
            ub = self.user_bookmarks.filter_by(user_id=user_id).first()
            if ub:
                data.update({
                    'title': ub.title,
                    'notes': ub.notes,
                    'archived': ub.archived,
                    'created_at': ub.created_at.isoformat() + 'Z',
                    'updated_at': ub.updated_at.isoformat() + 'Z' if ub.updated_at else None
                })
        return data