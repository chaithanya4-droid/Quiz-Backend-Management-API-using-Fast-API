from sqlalchemy.orm import Session
from typing import Optional, List
from . import models, schemas
from .auth import get_password_hash

# User CRUD
def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_pw = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_pw,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Question CRUD
def get_question(db: Session, question_id: int) -> Optional[models.Question]:
    return db.query(models.Question).filter(models.Question.id == question_id).first()

def get_questions(db: Session, skip: int = 0, limit: int = 100, category: Optional[str] = None) -> List[models.Question]:
    query = db.query(models.Question)
    if category:
        query = query.filter(models.Question.category == category)
    return query.offset(skip).limit(limit).all()

def create_question(db: Session, question: schemas.QuestionCreate) -> models.Question:
    db_question = models.Question(
        question_text=question.question_text,
        category=question.category
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    
    # If nested choices are provided, create them too!
    if question.choices:
        for choice_data in question.choices:
            db_choice = models.Choice(
                choice_text=choice_data.choice_text,
                is_correct=choice_data.is_correct,
                question_id=db_question.id
            )
            db.add(db_choice)
        db.commit()
        db.refresh(db_question)
        
    return db_question

def update_question(db: Session, question_id: int, question: schemas.QuestionUpdate) -> Optional[models.Question]:
    db_question = get_question(db, question_id)
    if not db_question:
        return None
    
    update_data = question.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_question, key, value)
        
    db.commit()
    db.refresh(db_question)
    return db_question

def delete_question(db: Session, question_id: int) -> bool:
    db_question = get_question(db, question_id)
    if not db_question:
        return False
    db.delete(db_question)
    db.commit()
    return True

# Choice CRUD
def get_choice(db: Session, choice_id: int) -> Optional[models.Choice]:
    return db.query(models.Choice).filter(models.Choice.id == choice_id).first()

def get_choices(db: Session, skip: int = 0, limit: int = 100, question_id: Optional[int] = None) -> List[models.Choice]:
    query = db.query(models.Choice)
    if question_id is not None:
        query = query.filter(models.Choice.question_id == question_id)
    return query.offset(skip).limit(limit).all()

def create_choice(db: Session, choice: schemas.ChoiceCreate) -> models.Choice:
    db_choice = models.Choice(
        choice_text=choice.choice_text,
        is_correct=choice.is_correct,
        question_id=choice.question_id
    )
    db.add(db_choice)
    db.commit()
    db.refresh(db_choice)
    return db_choice

def update_choice(db: Session, choice_id: int, choice: schemas.ChoiceUpdate) -> Optional[models.Choice]:
    db_choice = get_choice(db, choice_id)
    if not db_choice:
        return None
        
    update_data = choice.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_choice, key, value)
        
    db.commit()
    db.refresh(db_choice)
    return db_choice

def delete_choice(db: Session, choice_id: int) -> bool:
    db_choice = get_choice(db, choice_id)
    if not db_choice:
        return False
    db.delete(db_choice)
    db.commit()
    return True
