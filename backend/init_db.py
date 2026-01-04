"""
CLIPMARK Dummy Data Initializer (Auth-Ready)
Run:  python init_db.py
"""

from app import create_app, db
from app.models.bookmark import Bookmark, normalize_url, generate_url_hash
from app.models.tag import Tag
from app.models.user import User
from app.models.user_bookmark import UserBookmark
from app.models.tag_user_bookmark import tag_user_bookmarks
from datetime import datetime
import random

# ----------------------------------------------------------------------
# Dummy data
# ----------------------------------------------------------------------
DUMMY_USERS = [
    {"username": "alice", "name": "Alice Smith",   "email": "alice@example.com"},
    {"username": "bob",   "name": "Bob Johnson",  "email": "bob@example.com"},
    {"username": "carol", "name": "Carol Lee",    "email": "carol@example.com"},
    {"username": "dave",  "name": "Dave Brown",   "email": "dave@example.com"},
]

DUMMY_BOOKMARKS = [
    {"url": "https://github.com",               "title": "GitHub",               "notes": "Code hosting",          "tags": ["code", "git"],          "archived": False, "is_favourite":  False},
    {"url": "https://python.org",               "title": "Python Official",      "notes": "Python site",           "tags": ["python", "dev"],        "archived": False, "is_favourite": True},
    {"url": "https://flask.palletsprojects.com","title": "Flask Docs",           "notes": "Flask framework",       "tags": ["flask", "web"],         "archived": False, "is_favourite": True},
    {"url": "https://getbootstrap.com",         "title": "Bootstrap",            "notes": "CSS framework",         "tags": ["css", "web"],           "archived": True, "is_favourite": False},
    {"url": "https://stackoverflow.com",        "title": "Stack Overflow",       "notes": "Q&A site",              "tags": ["help", "coding"],       "archived": False, "is_favourite": True},
    {"url": "https://reactjs.org",              "title": "React",                "notes": "JS frontend",           "tags": ["react", "javascript"],  "archived": False, "is_favourite": True},
    {"url": "https://nodejs.org",               "title": "Node.js",              "notes": "JS backend",            "tags": ["nodejs", "javascript"], "archived": False, "is_favourite": True},
    {"url": "https://vuejs.org",                "title": "Vue.js",               "notes": "Frontend framework",    "tags": ["vue", "javascript"],    "archived": False, "is_favourite": True},
    {"url": "https://angular.io",               "title": "Angular",              "notes": "Frontend framework",    "tags": ["angular", "typescript"],"archived": False, "is_favourite": True},
    {"url": "https://linux.org",                "title": "Linux Info",           "notes": "OS info",               "tags": ["linux", "oss"],         "archived": True, "is_favourite": True},
    {"url": "https://docker.com",               "title": "Docker",               "notes": "Container platform",    "tags": ["docker", "devops"],     "archived": False, "is_favourite": False},
    {"url": "https://kubernetes.io",            "title": "Kubernetes",           "notes": "Orchestration",         "tags": ["k8s", "devops"],        "archived": False, "is_favourite": True},
    {"url": "https://aws.amazon.com",           "title": "AWS Cloud",            "notes": "Cloud provider",        "tags": ["cloud", "aws"],         "archived": False, "is_favourite": False},
    {"url": "https://azure.microsoft.com",      "title": "Azure Cloud",          "notes": "Microsoft cloud",       "tags": ["cloud", "azure"],       "archived": False, "is_favourite": False},
    {"url": "https://cloud.google.com",         "title": "Google Cloud",         "notes": "GCP",                   "tags": ["cloud", "gcp"],         "archived": False, "is_favourite": True},
    {"url": "https://mongodb.com",              "title": "MongoDB",              "notes": "NoSQL DB",              "tags": ["database", "nosql"],    "archived": False, "is_favourite": True},
    {"url": "https://postgresql.org",           "title": "PostgreSQL",           "notes": "Relational DB",         "tags": ["database", "sql"],      "archived": False, "is_favourite": True},
    {"url": "https://redis.io",                 "title": "Redis",                "notes": "In‑memory DB",          "tags": ["database", "cache"],    "archived": False, "is_favourite": True},
    {"url": "https://rabbitmq.com",             "title": "RabbitMQ",             "notes": "Message broker",        "tags": ["mq", "devops"],         "archived": False, "is_favourite": True},
    {"url": "https://jenkins.io",               "title": "Jenkins",              "notes": "CI/CD tool",            "tags": ["ci", "cd"],             "archived": False, "is_favourite": True},
] + [
    {"url": f"https://example.com/tutorial{i}",
     "title": f"Tutorial {i}",
     "notes": f"Learning topic {i}",
     "tags": ["tutorial", "learning"],
     "archived": False,
    "is_favourite": random.choice([True, False])}
    for i in range(1, 21)
]

# ----------------------------------------------------------------------
def init_db_with_data():
    app = create_app()
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("Creating tables...")
        db.create_all()

        # ------------------- USERS -------------------
        users = []
        print(f"\nCreating {len(DUMMY_USERS)} users...")
        for ud in DUMMY_USERS:
            user = User(
                username=ud["username"],
                name=ud["name"],
                email=ud["email"]
            )
            user.set_password("password123")   # same password for demo
            db.session.add(user)
            db.session.flush()
            users.append(user)
            print(f"  → {user.username} (id={user.id})")

        # ------------------- BOOKMARKS & TAGS -------------------
        bookmarks = []
        print(f"\nAdding {len(DUMMY_BOOKMARKS)} bookmarks...")
        for item in DUMMY_BOOKMARKS:
            norm = normalize_url(item["url"])
            h = generate_url_hash(norm)

            bm = Bookmark.query.filter_by(hash_url=h).first()
            if not bm:
                bm = Bookmark(url=norm)
                bm.set_hash()
                bm.set_short_url()
                db.session.add(bm)
                db.session.flush()

            bookmarks.append(bm)

        db.session.commit()
        print("Bookmarks created!")

        # ------------------- ASSIGN BOOKMARKS TO USERS -------------------
        print("\nAssigning bookmarks to users (shared + private)...")
        for bm in bookmarks:
            chosen = random.sample(users, k=random.randint(1, 3))

            for user in chosen:
                src = next((x for x in DUMMY_BOOKMARKS if normalize_url(x["url"]) == bm.url), None)
                title = src["title"] if src else "Untitled"
                notes = src["notes"] + f" (saved by {user.username})" if src else ""
                archived = src["archived"] if src else False
                is_favourite = src["is_favourite"] if src and "is_favourite" in src else False  # ← NEW

                ub = UserBookmark(
                    user_id=user.id,
                    bookmark_id=bm.id,
                    title=title,
                    notes=notes,
                    archived=archived,
                    is_favourite=is_favourite  
                )
                db.session.add(ub)

                if src:
                    for tname in src["tags"]:
                        tname = tname.lower()
                        tag = Tag.query.filter_by(name=tname).first()
                        if not tag:
                            tag = Tag(name=tname)
                            db.session.add(tag)
                            db.session.flush()
                        db.session.execute(
                            tag_user_bookmarks.insert().values(
                                tag_id=tag.id,
                                user_id=user.id,
                                bookmark_id=bm.id
                            )
                        )
        db.session.commit()
        print("Assignment complete – tag counts auto-updated by after_flush")

        # ------------------- DONE -------------------
        print("\nDB initialization complete!\n")
        print("Sample curl commands:")
        for u in users:
            print(f'curl "http://127.0.0.1:5000/api/bookmarks?user_id={u.id}"')
        print("\nLogin (Flask-Login ready):")
        for u in users:
            print(f'curl -X POST http://127.0.0.1:5000/auth/login '
                  f'-H "Content-Type: application/json" '
                  f'-d \'{{"username":"{u.username}","password":"password123"}}\' -c cookie.txt')


if __name__ == "__main__":
    init_db_with_data()
