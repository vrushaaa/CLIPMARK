from app import db

class Tag(db.Model):
    __tablename__ = 'tag'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    bookmarks = db.relationship(
        'Bookmark',
        secondary='tag_user_bookmark',
        back_populates='tags',
        lazy='dynamic'
    )