from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
import os

from .database import engine, Base
from .routers import auth, questions, choices

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Quiz Backend Management API",
    description="A secure RESTful API to manage quiz questions and answers, built with FastAPI, SQLAlchemy, and SQLite.",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router)
app.include_router(questions.router)
app.include_router(choices.router)

# Mount the static files directory to serve the frontend
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
os.makedirs(os.path.join(static_dir, "css"), exist_ok=True)
os.makedirs(os.path.join(static_dir, "js"), exist_ok=True)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def redirect_to_frontend():
    return RedirectResponse(url="/static/index.html")
