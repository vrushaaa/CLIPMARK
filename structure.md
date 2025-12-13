
## frontend structure
clipmark-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Spinner.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ForgotPasswordForm.jsx
│   │   ├── bookmarks/
│   │   │   ├── BookmarkCard.jsx
│   │   │   ├── BookmarkList.jsx
│   │   │   ├── AddBookmarkModal.jsx
│   │   │   ├── EditBookmarkModal.jsx
│   │   │   └── DeleteConfirmModal.jsx
│   │   ├── tags/
│   │   │   ├── TagCard.jsx
│   │   │   └── TagList.jsx
│   │   └── layout/
│   │       ├── Navbar.jsx
│   │       ├── Sidebar.jsx
│   │       └── Layout.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Bookmarks.jsx
│   │   ├── Tags.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── bookmarkService.js
│   │   └── tagService.js
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useBookmarks.js
│   │   └── useTags.js
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .env
├── .env.example
├── package.json
├── tailwind.config.js
└── README.md


## Entire project structure:
ClipMark/                   # Root project folder
│
├── backend/                # Flask backend
│   ├── app/                # Main app package
│   │   ├── __init__.py     # App factory, DB, LoginManager, bcrypt init
│   │   ├── config.py       # App configs (Dev, Prod, DB URI, secrets)
│   │   │
│   │   ├── models/         
│   │   │   ├── user.py     # User model
│   │   │   ├── tag.py      # Tag model
│   │   │   ├── bookmark.py # Bookmark model
│   │   │   └── __init__.py
│   │   │
│   │   ├── routes/         
│   │   │   ├── auth.py     # Authentication routes (login, register, forgot, OTP, etc)
│   │   │   ├── bookmark.py # Bookmark CRUD routes
│   │   │   ├── tag.py      # Tag filtering/management routes
│   │   │   └── __init__.py
│   │   │
│   │   ├── services/       
│   │   │   ├── scraper.py  # BeautifulSoup scraping logic
│   │   │   ├── hashing.py  # URL normalization + hashing logic
│   │   │   ├── qr.py       # QR generation logic
│   │   │   └── __init__.py
│   │   │
│   │   ├── utils/          
│   │   │   ├── decorators.py  # Custom decorators (if any)
│   │   │   ├── pagination.py  # JSON pagination helper
│   │   │   └── __init__.py
│   │   │
│   │   ├── templates/      # Jinja templates (if using any server-side UI later)
│   │   ├── static/         
│   │   └── extensions.py   # Optional extension setup (Mail, OAuth, etc)
│   │
│   ├── migrations/         # DB migrations (Flask-Migrate)
│   ├── tests/              # Backend API tests
│   │   ├── test_auth.py
│   │   ├── test_bookmark.py
│   │   └── __init__.py
│   │
│   ├── venv/               # Virtual environment (optional)
│   ├── requirements.txt    # Python dependencies
│   ├── run.py              # Entry point (calls app factory and runs server)
│   ├── .env                # Environment variables (secrets, DB creds)
│   ├── Dockerfile          # Docker build
│   └── .gitignore
│
│
├── frontend/               # React frontend
│   ├── public/             
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── components/     
│   │   │   ├── Navbar.jsx
│   │   │   ├── BookmarkCard.jsx
│   │   │   ├── TagSidebar.jsx
│   │   │   └── ui/         # Optional reusable UI parts
│   │   │
│   │   ├── pages/          
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx   # Home for bookmarks
│   │   │   ├── Archived.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── context/        
│   │   │   ├── AuthContext.jsx # Login/session context
│   │   │   ├── BookmarkContext.jsx
│   │   │   └── __init__.js
│   │   │
│   │   ├── services/       
│   │   │   ├── api.js          # Axios/fetch wrapper
│   │   │   ├── authService.js
│   │   │   ├── bookmarkService.js
│   │   │   └── tagService.js
│   │   │
│   │   ├── assets/         
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── routes/         # Optional client routing folder
│   │
│   ├── package.json        # NPM dependencies
│   ├── tailwind.config.js
│   ├── Dockerfile          # Optional if containerizing frontend separately
│   └── .gitignore
│
│
├── docker-compose.yml      # Optional: Run both backend+frontend locally
├── README.md              # Project documentation
└── docs/                  # Optional extra docs (ER diagrams, API spec, etc)




### New Structure:
CLIPMARK/
├── backend/
│   ├── run.py
│   ├── init_db.py
│   ├── config.py
│   ├── .env                  (example environment file, not shared)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models/
│   │   │   ├── __init__.py   (implied)
│   │   │   ├── bookmark.py
│   │   │   ├── user.py
│   │   │   ├── tag.py
│   │   │   ├── user_bookmark.py
│   │   │   └── tag_user_bookmark.py
│   │   ├── routes/
│   │   │   ├── bookmark_routes.py
│   │   │   ├── user_routes.py
│   │   ├── utils/
│   │   │   ├── bookmark_utils.py
│   │   │   ├── routes_utils.py
│   │   │   └── tag_counter.py
│   │   └── auth/
│   │       └── auth.py       
│   └── requirements.txt      
│
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   ├── contexts/
    │   │   ├── AppProvider.jsx
    │   │   ├── AuthContext.jsx
    │   │   ├── BookmarkContext.jsx
    │   │   └── TagContext.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── bookmarkService.js
    │   │   └── tagService.js
    │   ├── components/
    │   │   ├── AuthComponents.jsx
    │   │   ├── Button.jsx
    │   │   ├── NavBar.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── modals/
    │   │       ├── AddBookmarkModal.jsx
    │   │       ├── EditBookmarkModal.jsx
    │   │       ├── DeleteModal.jsx
    │   │       └── QRModal.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── Dashboard2.jsx          (authenticated home dashboard)
    │   │   ├── AllLinks.jsx            (main bookmark list)
    │   │   ├── AllBookmarks.jsx        (alternative bookmark list view)
    │   │   ├── Archived.jsx
    │   │   ├── Tags.jsx
    │   │   ├── TagBookmarks.jsx
    │   │   └── Profile.jsx
    │   └── assets/                     
    ├── public/
    │   └── vite.svg                    
    ├── index.html
    ├── vite.config.js             
    └── package.json                