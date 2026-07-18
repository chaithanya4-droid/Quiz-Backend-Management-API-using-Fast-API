from pydantic import BaseModel, Field
from typing import Optional, List

# User Schemas
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "student"  # "admin" or "student"

class UserResponse(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

# Choice Schemas
class ChoiceBase(BaseModel):
    choice_text: str
    is_correct: bool = False

class ChoiceCreate(ChoiceBase):
    question_id: int

class ChoiceUpdate(BaseModel):
    choice_text: Optional[str] = None
    is_correct: Optional[bool] = None
    question_id: Optional[int] = None

class ChoiceResponse(ChoiceBase):
    id: int
    question_id: int

    class Config:
        from_attributes = True

# Question Schemas
class QuestionBase(BaseModel):
    question_text: str
    category: Optional[str] = None

# For creating a question, we optionally allow nested choices to be passed.
class QuestionCreate(QuestionBase):
    choices: Optional[List[ChoiceBase]] = []

class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    category: Optional[str] = None

class QuestionResponse(QuestionBase):
    id: int

    class Config:
        from_attributes = True

class QuestionDetailResponse(QuestionResponse):
    choices: List[ChoiceResponse] = []

    class Config:
        from_attributes = True
