from app import db

tag_user_bookmarks = db.Table(
    'tag_user_bookmark',
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('bookmark_id', db.Integer, db.ForeignKey('bookmark.id'), primary_key=True),
    db.Column('bookmark_count', db.Integer, default=0),  # ← YES, here
    db.UniqueConstraint('tag_id', 'user_id', 'bookmark_id', name='uq_tag_user_bookmark')
)