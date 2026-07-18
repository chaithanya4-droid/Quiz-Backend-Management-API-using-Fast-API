# Quiz Backend Management API with Interactive Dashboard

A complete, production-ready RESTful web application built with **FastAPI**, **SQLAlchemy ORM**, **Pydantic validation**, and **SQLite**. It features token-based **JWT Authentication**, Role-Based Access Controls (RBAC), and is packaged with a premium, responsive **Admin & Student Frontend Dashboard** served directly by the backend.

---

## 📸 Visual Walkthrough & Screenshots

Below are screenshots of the running application. You can save your screenshot images inside a folder named `screenshots/` in your repository:

### 🔐 1. Authentication Panel
*Login and Registration screens supporting dynamic user role assignments.*
![Authentication Screen](screenshots/login.png)

### 🎓 2. Student Quiz Dashboard
*Select a specific domain category to begin a quiz.*
![Student Dashboard](screenshots/dashboard.png)

### ⚡ 3. Interactive Quiz interface
*Instant visual grading feedback on selected answers.*
![Interactive Quiz Taking](screenshots/quiz_taking.png)

### 🏆 4. Scorecard & Results
*Animate percentage chart indicating quiz performance.*
![Quiz Results Card](screenshots/results.png)

### 🛠️ 5. Admin Management Console
*Full CRUD administration panel for managing questions and answers.*
![Admin Management Panel](screenshots/admin_panel.png)

---

## 🌟 Key Features

### 🔒 Security & Session Management
- **JWT Authentication**: User registration and login endpoints utilizing JSON Web Tokens.
- **Secure Password Hashing**: Hashed passwords stored in the database using the direct `bcrypt` cryptographic library.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full authority to create, read, update, and delete questions and answer options.
  - **Student**: Read-only credentials to browse categories, take interactive quizzes, and track live scores.

### 🗄️ Relational Database (SQLite)
- Built on a relational model using SQLite (zero-configuration local storage file `quiz.db`).
- Configured with SQLAlchemy ORM representing schema tables: `users`, `questions`, and `choices`.
- **Cascading Deletions**: Deleting a question automatically cascade-deletes all its corresponding answer choices at the database level to maintain database cleanliness.

### 🎨 Glassmorphic Frontend Dashboard
- Responsive Single-Page Application (SPA) built using HTML5, CSS3, and Vanilla JavaScript.
- Dynamic data rendering utilizing the async/await Browser Fetch API.
- Modern look: vibrant glowing gradients, glassmorphism card designs, backdrop blur filters, and micro-animations.
- Interactive quiz engine featuring instant correct/incorrect visual feedback and an animated circular progress scorecard.

---

## 📐 System Architecture

```
Client (Browser) ──> FastAPI Routing ──> Business Logic / Auth ──> SQLAlchemy ORM ──> SQLite (.db file)
```

---

## 📁 Repository Directory Structure

```text
quiz-api/
├── app/
│   ├── __init__.py
│   ├── auth.py           # Password hashing, JWT token creation, and dependencies
│   ├── config.py         # App configurations (JWT settings, DB URL)
│   ├── database.py       # SQLAlchemy engine & session local generator
│   ├── main.py           # FastAPI application entry point, CORS, and static file mount
│   ├── models.py         # SQLAlchemy database model entities
│   ├── schemas.py        # Pydantic schemas for request validation & response serialization
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py       # Authentication endpoints (/auth/register, /auth/token, /auth/me)
│   │   ├── choices.py    # Answer choice management endpoints
│   │   └── questions.py  # Quiz question management endpoints
│   └── static/           # SPA Frontend Web Assets
│       ├── index.html    # Single-page template
│       ├── css/
│       │   └── style.css # Theme, layout, and hover micro-animations
│       └── js/
│           └── app.js    # Client-side routing, auth checks, quiz mechanics, & CRUD logic
├── screenshots/          # Folder containing your application screenshots
│   ├── login.png
│   ├── dashboard.png
│   ├── quiz_taking.png
│   ├── results.png
│   └── admin_panel.png
├── requirements.txt      # Python dependencies
├── seed.py               # Database re-creation and mock data seeding script
├── test_api.py           # Automated test suite using FastAPI's TestClient
└── README.md             # Project documentation (this file)
```

---

## 🚀 Setup and Installation Guide

Follow these steps to run and test the application on your local machine:

### 1. Install Dependencies
Ensure you have Python 3.10+ installed. Install the required Python packages from the terminal:
```bash
pip install -r requirements.txt
```

### 2. Initialize and Seed the Database
Re-create tables and populate them with standard quiz categories (Data Science, Programming, General Knowledge, Mathematics) and test accounts:
```bash
python seed.py
```
This command automatically generates the local SQLite file `quiz.db` in your root project folder.

### 3. Run the Server
Launch the FastAPI development server:
```bash
python -m uvicorn app.main:app --reload
```

---

## 🧪 Interactive Access & Documentation

Once the server starts running:
* **Frontend Web Dashboard**: Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in your browser. (The root URL `/` automatically redirects to `/static/index.html`).
* **Interactive API Sandbox**: Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) to access the auto-generated Swagger UI interface to test all endpoints.

### Default Test Credentials
Use these accounts to test the dashboard permissions:
- **Admin Role** (Create/Update/Delete Questions):
  - **Username**: `admin`
  - **Password**: `adminpassword`
- **Student Role** (Attempt Playable Quizzes):
  - **Username**: `student`
  - **Password**: `studentpassword`

---

## ⚙️ Automated Integration Tests

To run the programmatic API verification script to assert endpoints routing, database triggers, validation boundaries, and cascading rules, execute:
```bash
python test_api.py
```
The test suite utilizes FastAPI's `TestClient` and will assert success or failure metrics directly in your console.
