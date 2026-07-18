from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/questions", tags=["Questions"])

@router.post("", response_model=schemas.QuestionDetailResponse, status_code=status.HTTP_201_CREATED)
def create_question(
    question: schemas.QuestionCreate,
    db: Session = Depends(get_db),
    admin_user=Depends(auth.get_admin_user)
):
    return crud.create_question(db=db, question=question)

@router.get("", response_model=List[schemas.QuestionDetailResponse])
def read_questions(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(auth.get_current_user)
):
    return crud.get_questions(db=db, skip=skip, limit=limit, category=category)

@router.get("/{id}", response_model=schemas.QuestionDetailResponse)
def read_question(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(auth.get_current_user)
):
    db_question = crud.get_question(db=db, question_id=id)
    if db_question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Question with ID {id} not found"
        )
    return db_question

@router.put("/{id}", response_model=schemas.QuestionDetailResponse)
def update_question(
    id: int,
    question: schemas.QuestionUpdate,
    db: Session = Depends(get_db),
    admin_user=Depends(auth.get_admin_user)
):
    db_question = crud.update_question(db=db, question_id=id, question=question)
    if db_question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Question with ID {id} not found"
        )
    return db_question

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_question(
    id: int,
    db: Session = Depends(get_db),
    admin_user=Depends(auth.get_admin_user)
):
    success = crud.delete_question(db=db, question_id=id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Question with ID {id} not found"
        )
    return {"detail": f"Question with ID {id} and its associated choices successfully deleted."}
