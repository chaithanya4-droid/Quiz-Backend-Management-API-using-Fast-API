from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="student", nullable=False)  # "admin" or "student"

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, nullable=False)
    category = Column(String, index=True, nullable=True)

    choices = relationship("Choice", back_populates="question", cascade="all, delete-orphan")

class Choice(Base):
    __tablename__ = "choices"

    id = Column(Integer, primary_key=True, index=True)
    choice_text = Column(String, nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)

    question = relationship("Question", back_populates="choices")
