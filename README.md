

```markdown
# Quiz Backend Management using FASTAPI

A RESTful backend application built with **FastAPI** that allows users to create, manage, and retrieve quiz questions and answer choices. It provides full CRUD operations for quiz management while maintaining relationships between questions and their corresponding choices using a relational database.

This project demonstrates modern backend development practices, including API design, data validation, JWT-based security, and full-stack integration.

---

## Features
* **Create, Read, Update, and Delete (CRUD) operations** for quiz questions.
* **CRUD operations** for answer choices.
* **One-to-Many relationship** between questions and choices (with database-level Cascade Delete).
* **Request and response validation** using Pydantic.
* **Database operations** using SQLAlchemy ORM.
* **JWT Authentication**: Secure login session token generation and verification using `python-jose` and `bcrypt` password hashing.
* **Role-Based Access Control (RBAC)**: Enforced permissions separating `admin` users (write access) from `student` users (read-only access).
* **Interactive Frontend Dashboard**: Premium glassmorphic Single Page Application (SPA) web client served directly by FastAPI.
* **Interactive API documentation** with Swagger UI.

---

## Tech Stack
* **FastAPI** (API routing)
* **Python** (Core language)
* **SQLAlchemy** (Database ORM)
* **Pydantic** (Validation)
* **SQLite** (Relational Database)
* **Uvicorn** (ASGI Web Server)
* **python-jose & bcrypt** (JWT Encryption & password hashing)

---

## Project Structure
```text
quiz-backend-api/
│── app/
│   │── routers/          # API route definitions (auth, questions, choices)
│   │── static/           # SPA Frontend Dashboard Web Assets
│   │── auth.py           # JWT security & role checking logic
│   │── config.py         # Configs (JWT keys, DB url)
│   │── crud.py           # Database CRUD helpers
│   │── database.py       # SQLAlchemy engine & session generator
│   │── models.py         # SQLAlchemy database tables
│   │── schemas.py        # Pydantic validation schemas
│   │── main.py           # FastAPI entry point
│── requirements.txt      # Dependency list
│── seed.py               # Database re-creation and mock seeding script
```

---

##Prerequisites
* Python 3.10+
* pip

---

##API Endpoints

###Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/auth/register` | Register a new user (`admin` or `student` role) |
| **POST** | `/auth/token` | User login (returns JWT Access Token) |
| **GET** | `/auth/me` | Get current logged-in user profile |

###Questions
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/questions` | Create a question *(Admin only)* |
| **GET** | `/questions` | Get all questions |
| **GET** | `/questions/{id}` | Get a question by ID |
| **PUT** | `/questions/{id}` | Update a question *(Admin only)* |
| **DELETE** | `/questions/{id}` | Delete a question and its choices *(Admin only)* |

###Choices
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/choices` | Create an answer choice *(Admin only)* |
| **GET** | `/choices` | Get all choices |
| **PUT** | `/choices/{id}` | Update a choice *(Admin only)* |
| **DELETE** | `/choices/{id}` | Delete a choice *(Admin only)* |

---

##Learning Outcomes
This project helped in understanding:
* REST API development with FastAPI.
* Secure session management using JWT Authentication and hashed passwords.
* Relational database modeling and trigger behaviors using SQLAlchemy ORM.
* Strict schema validation using Pydantic.
* Full-stack routing: serving static UI files directly from an API server.

---

##Future Enhancements
* [ ] Quiz Attempt History tracker
* [ ] Leaderboards & scoreboard metrics
* [ ] Timer-based Quizzes
* [ ] Adaptive Quiz Recommendation System using Machine Learning
* [ ] Machine Learning-based Personalized Quizzes
```
