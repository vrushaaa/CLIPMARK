from app import db
from datetime import datetime

class UserBookmark(db.Model):
    __tablename__ = 'user_bookmark'

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    bookmark_id = db.Column(db.Integer, db.ForeignKey('bookmark.id'), primary_key=True)
    title = db.Column(db.String(255), nullable=False, default='Untitled')
    notes = db.Column(db.Text, default='')
    archived = db.Column(db.Boolean, default=False)
    is_favourite = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    # relationships
    user = db.relationship('User', back_populates='saved_bookmarks')
    bookmark = db.relationship('Bookmark', back_populates='user_bookmarks')

    def to_dict(self, user_id=None):
        data = {
            'title': self.title,
            'notes': self.notes,
            'archived': self.archived,
            'is_favourite': self.is_favourite,
            'created_at': self.created_at.isoformat() + 'Z',
            'updated_at': self.updated_at.isoformat() + 'Z' if self.updated_at else None
        }
        if user_id:
            data.update(self.bookmark.to_dict(user_id=user_id))
        return data