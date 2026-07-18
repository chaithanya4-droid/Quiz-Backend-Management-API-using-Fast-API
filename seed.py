import sys
import os

# Add the project root to python path to import app modules
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app.database import SessionLocal, Base, engine
from app import models, crud, schemas

def seed_db():
    print("Re-creating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Creating users...")
        # Create Admin
        admin_in = schemas.UserCreate(username="admin", password="adminpassword", role="admin")
        crud.create_user(db=db, user=admin_in)
        print("Admin user created: username='admin', password='adminpassword'")

        # Create Student
        student_in = schemas.UserCreate(username="student", password="studentpassword", role="student")
        crud.create_user(db=db, user=student_in)
        print("Student user created: username='student', password='studentpassword'")

        print("Seeding quiz questions...")
        
        # Category: Data Science
        q1 = schemas.QuestionCreate(
            question_text="Which algorithm is commonly used for classification tasks in machine learning?",
            category="Data Science",
            choices=[
                schemas.ChoiceBase(choice_text="Linear Regression", is_correct=False),
                schemas.ChoiceBase(choice_text="Logistic Regression", is_correct=True),
                schemas.ChoiceBase(choice_text="K-Means Clustering", is_correct=False),
                schemas.ChoiceBase(choice_text="Apriori Algorithm", is_correct=False)
            ]
        )
        crud.create_question(db=db, question=q1)

        q2 = schemas.QuestionCreate(
            question_text="What does 'Overfitting' mean in Machine Learning?",
            category="Data Science",
            choices=[
                schemas.ChoiceBase(choice_text="The model performs poorly on training data but well on testing data", is_correct=False),
                schemas.ChoiceBase(choice_text="The model performs well on both training and testing data", is_correct=False),
                schemas.ChoiceBase(choice_text="The model performs well on training data but poorly on unseen test data", is_correct=True),
                schemas.ChoiceBase(choice_text="The model is too simple to capture the underlying patterns", is_correct=False)
            ]
        )
        crud.create_question(db=db, question=q2)

        # Category: Python Programming
        q3 = schemas.QuestionCreate(
            question_text="Which of the following is an immutable data type in Python?",
            category="Programming",
            choices=[
                schemas.ChoiceBase(choice_text="List", is_correct=False),
                schemas.ChoiceBase(choice_text="Dictionary", is_correct=False),
                schemas.ChoiceBase(choice_text="Tuple", is_correct=True),
                schemas.ChoiceBase(choice_text="Set", is_correct=False)
            ]
        )
        crud.create_question(db=db, question=q3)

        q4 = schemas.QuestionCreate(
            question_text="What is the purpose of the 'self' keyword in Python class methods?",
            category="Programming",
            choices=[
                schemas.ChoiceBase(choice_text="It refers to the class itself", is_correct=False),
                schemas.ChoiceBase(choice_text="It represents the specific instance of the object being created or manipulated", is_correct=True),
                schemas.ChoiceBase(choice_text="It is a built-in function to delete the object", is_correct=False),
                schemas.ChoiceBase(choice_text="It allows accessing global variables inside the class", is_correct=False)
            ]
        )
        crud.create_question(db=db, question=q4)

        # Category: General Knowledge
        q5 = schemas.QuestionCreate(
            question_text="Which planet in our solar system is known as the Red Planet?",
            category="General Knowledge",
            choices=[
                schemas.ChoiceBase(choice_text="Venus", is_correct=False),
                schemas.ChoiceBase(choice_text="Jupiter", is_correct=False),
                schemas.ChoiceBase(choice_text="Saturn", is_correct=False),
                schemas.ChoiceBase(choice_text="Mars", is_correct=True)
            ]
        )
        crud.create_question(db=db, question=q5)

        q6 = schemas.QuestionCreate(
            question_text="Who is credited with developing the theory of General Relativity?",
            category="General Knowledge",
            choices=[
                schemas.ChoiceBase(choice_text="Isaac Newton", is_correct=False),
                schemas.ChoiceBase(choice_text="Albert Einstein", is_correct=True),
                schemas.ChoiceBase(choice_text="Galileo Galilei", is_correct=False),
                schemas.ChoiceBase(choice_text="Nikola Tesla", is_correct=False)
            ]
        )
        crud.create_question(db=db, question=q6)

        # Category: Mathematics
        q7 = schemas.QuestionCreate(
            question_text="What is the derivative of sin(x) with respect to x?",
            category="Mathematics",
            choices=[
                schemas.ChoiceBase(choice_text="cos(x)", is_correct=True),
                schemas.ChoiceBase(choice_text="-cos(x)", is_correct=False),
                schemas.ChoiceBase(choice_text="tan(x)", is_correct=False),
                schemas.ChoiceBase(choice_text="sin(x)", is_correct=False)
            ]
        )
        crud.create_question(db=db, question=q7)

        print("Database successfully seeded with sample users and questions!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
