from app import db
from app.models.bookmark import Bookmark
from app.models.tag_user_bookmark import tag_user_bookmarks
from app.models.user_bookmark import UserBookmark
from sqlalchemy import select, func, update, delete


def recalc_user_tag_count(user_id, tag_id):
    # Count bookmarks for this (user, tag)
    count = db.session.scalar(
        select(func.count())
        .select_from(tag_user_bookmarks)
        .where(
            tag_user_bookmarks.c.user_id == user_id,
            tag_user_bookmarks.c.tag_id == tag_id
        )
    )

    if count == 0:
        # Remove rows for this (user, tag)
        db.session.execute(
            delete(tag_user_bookmarks).where(
                tag_user_bookmarks.c.user_id == user_id,
                tag_user_bookmarks.c.tag_id == tag_id
            )
        )
        return

    # Update all rows for this (user, tag)
    db.session.execute(
        update(tag_user_bookmarks)
        .where(
            tag_user_bookmarks.c.user_id == user_id,
            tag_user_bookmarks.c.tag_id == tag_id
        )
        .values(bookmark_count=count)
    )