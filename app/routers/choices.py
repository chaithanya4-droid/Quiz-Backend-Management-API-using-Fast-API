from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas, auth
from ..database import get_db
router = APIRouter(prefix="/choices", tags=["Choices"])
@router.post("", response_model=schemas.ChoiceResponse, status_code=status.HTTP_201_CREATED)
def create_choice(
    choice: schemas.ChoiceCreate,
    db: Session = Depends(get_db),
    admin_user=Depends(auth.get_admin_user)
):
    question = crud.get_question(db=db, question_id=choice.question_id)
    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Question with ID {choice.question_id} does not exist"
        )
    return crud.create_choice(db=db, choice=choice)
@router.get("", response_model=List[schemas.ChoiceResponse])
def read_choices(
    question_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(auth.get_current_user)
):
    return crud.get_choices(db=db, skip=skip, limit=limit, question_id=question_id)
@router.put("/{id}", response_model=schemas.ChoiceResponse)
def update_choice(
    id: int,
    choice: schemas.ChoiceUpdate,
    db: Session = Depends(get_db),
    admin_user=Depends(auth.get_admin_user)
):
    if choice.question_id is not None:
        question = crud.get_question(db=db, question_id=choice.question_id)
        if not question:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Question with ID {choice.question_id} does not exist"
            )
            
    db_choice = crud.update_choice(db=db, choice_id=id, choice=choice)
    if db_choice is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Choice with ID {id} not found"
        )
    return db_choice

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_choice(
    id: int,
    db: Session = Depends(get_db),
    admin_user=Depends(auth.get_admin_user)
):
    success = crud.delete_choice(db=db, choice_id=id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Choice with ID {id} not found"
        )
    return {"detail": f"Choice with ID {id} successfully deleted."}
