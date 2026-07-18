# Quiz Backend Management API

A RESTful backend application built with FastAPI for managing quizzes, questions, and answer choices. The system provides secure authentication, role-based authorization, and complete CRUD functionality through well-structured REST APIs.

The project follows a modular architecture using SQLAlchemy ORM, Pydantic validation, JWT authentication, and a relational database.

---

## Features

- User authentication using JWT
- Secure password hashing with bcrypt
- Role-Based Access Control (Admin and Student)
- CRUD operations for quiz questions
- CRUD operations for answer choices
- One-to-Many relationship between questions and choices
- Cascade delete support for related choices
- Request and response validation using Pydantic
- Database operations using SQLAlchemy ORM
- RESTful API architecture
- Interactive Swagger API documentation
- Single Page Application (SPA) frontend served through FastAPI

---

## Tech Stack

- FastAPI
- Python
- SQLAlchemy
- SQLite
- Pydantic
- Uvicorn
- python-jose
- bcrypt

---

## Project Structure

```text
quiz-backend-api/
│
├── app/
│   ├── routers/
│   │   ├── auth.py
│   │   ├── questions.py
│   │   └── choices.py
│   │
│   ├── static/
│   ├── auth.py
│   ├── config.py
│   ├── crud.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── main.py
│
├── requirements.txt
├── seed.py
└── README.md
```

---

## API Modules

### Authentication

- User Registration
- User Login
- JWT Token Generation
- Protected Routes
- Role-Based Authorization

### Question Management

- Create Questions
- Retrieve Questions
- Update Questions
- Delete Questions

### Choice Management

- Create Choices
- Retrieve Choices
- Update Choices
- Delete Choices
- Cascade Delete Support

---

## Database Design

```
Question
│
├── id
├── title
├── description
│
└── Choices
    ├── id
    ├── option_text
    ├── is_correct
    └── question_id
```

Each question can have multiple answer choices through a One-to-Many relationship. SQLAlchemy manages the relationship, while cascade deletion ensures associated choices are removed automatically when a question is deleted.

---

## Key Highlights

- Modular FastAPI architecture
- RESTful API design
- JWT-based authentication
- Role-based access control
- SQLAlchemy ORM
- Pydantic validation
- Secure password hashing
- Clean project structure
- Interactive Swagger documentation
