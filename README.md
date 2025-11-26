# CLIPMARK

### **Project Title**

**ClipMark – Bookmark and Link Management System**

---

### **Project Description**

ClipMark is a web-based application that allows users to save, organize, and manage their bookmarks in a structured and convenient way. The platform enables users to store URLs, add notes, categorize their links using tags, and quickly retrieve saved content whenever needed. ClipMark provides a clean and user-friendly interface designed to simplify link management for research, learning, and daily browsing activities. 

---

### **Objectives**

- Design an API to store URLs with optional title, notes, and multiple tags.
- Develop a simple and user-friendly bookmarking system.
- Allow users to save and manage web links efficiently.
- Provide features such as notes, tagging, and archiving for better organization.
- Build a secure authentication system for user-specific bookmark collections.
- Maintain and extend the existing backend logic for improved stability.
- Implement duplicate URL detection using normalized URL hashing.
- Support filtering by tag, keyword, or archived status.
- Add tag section as navigation.
- Model `Bookmark` , `User` and `Tag` with a many-to-many relationship in SQLAlchemy.
- Create a CLI to export bookmarks in Netscape HTML format (standard for browsers).
- Integrate web scraping with requests and BeautifulSoup4 to automatically extract page titles and meta tags.
- Return consistent, paginated JSON responses for large datasets.
- Implement user authentication and session management using Flask-Login.
- QR code generation for mobile sharing.
- Deploy the system on AWS EC2/ECS and connect it to AWS RDS for database management.
- Implement a CI/CD pipeline using GitHub Actions to automate testing, building, and deployment.
- Optional: Add feature like a browser extension for saving links directly.
- Optional: Forget password and OTP verification.

---

### **Tools & Technologies Used**

- **Frontend:** React, Tailwind CSS
- **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-Migrate
- **Database:** AWS RDS/MySQL
- **Web Scraping (optional)**: `requests`, `BeautifulSoup4`
- **Deployment:** Docker, AWS EC2/ECS, Nginx, Gunicorn
- **Version Control:** Git & GitHub
- **CLI**: Click for import/export operations
- **Data Handling**: URL normalization (`urllib.parse`), hashing (`hashlib`)

---

### **Project Type**

Web Application – Full Stack Project

---

### **Outcomes**

- Developed a fully functional bookmark management system.
- Enabled users to add, edit, delete, tag, and organize their web links.
- Implemented search and filter features for faster retrieval.
- Provided a simple and clean interface for managing bookmarks.
