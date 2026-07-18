import sys
import os
from fastapi.testclient import TestClient

# Add the project root to python path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app.main import app

def run_tests():
    print("Initializing TestClient...")
    try:
        client = TestClient(app)
        print("Success! TestClient loaded.")
    except Exception as e:
        print(f"Error loading TestClient (probably missing httpx): {e}")
        print("Installing httpx...")
        os.system("pip install httpx")
        client = TestClient(app)

    print("\n--- Test 1: Public access redirects to static/index.html ---")
    res = client.get("/", follow_redirects=False)
    print("Status:", res.status_code)
    print("Redirect Location:", res.headers.get("location"))
    assert res.status_code == 307
    assert "/static/index.html" in res.headers.get("location")

    print("\n--- Test 2: Login as Admin ---")
    res = client.post("/auth/token", data={"username": "admin", "password": "adminpassword"})
    print("Status:", res.status_code)
    assert res.status_code == 200
    token_data = res.json()
    admin_token = token_data["access_token"]
    print("Token type:", token_data["token_type"])
    print("Role:", token_data["role"])
    assert token_data["role"] == "admin"

    print("\n--- Test 3: Login as Student ---")
    res = client.post("/auth/token", data={"username": "student", "password": "studentpassword"})
    print("Status:", res.status_code)
    assert res.status_code == 200
    student_token = res.json()["access_token"]
    print("Student token retrieved.")

    print("\n--- Test 4: Student trying to write (Should fail 403) ---")
    headers = {"Authorization": f"Bearer {student_token}"}
    res = client.post("/questions", json={
        "question_text": "Is this a test question?",
        "category": "Testing",
        "choices": [{"choice_text": "Yes", "is_correct": True}, {"choice_text": "No", "is_correct": False}]
    }, headers=headers)
    print("Status:", res.status_code)
    print("Detail:", res.json().get("detail"))
    assert res.status_code == 403

    print("\n--- Test 5: Admin writing a new question (Should succeed 201) ---")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    res = client.post("/questions", json={
        "question_text": "What is 2 + 2 in base 10?",
        "category": "Mathematics",
        "choices": [
            {"choice_text": "3", "is_correct": False},
            {"choice_text": "4", "is_correct": True},
            {"choice_text": "5", "is_correct": False}
        ]
    }, headers=admin_headers)
    print("Status:", res.status_code)
    assert res.status_code == 201
    q_data = res.json()
    new_q_id = q_data["id"]
    print("Created question ID:", new_q_id)
    print("Choices Count:", len(q_data["choices"]))
    assert len(q_data["choices"]) == 3

    print("\n--- Test 6: Student reading all questions (Should succeed 200) ---")
    res = client.get("/questions", headers=headers)
    print("Status:", res.status_code)
    questions_list = res.json()
    print("Total Questions in DB:", len(questions_list))
    assert res.status_code == 200
    assert len(questions_list) > 0

    print("\n--- Test 7: Admin updating question (Should succeed 200) ---")
    res = client.put(f"/questions/{new_q_id}", json={
        "question_text": "What is 2 + 2 in base 10? (Updated)",
        "category": "Mathematics"
    }, headers=admin_headers)
    print("Status:", res.status_code)
    assert res.status_code == 200
    print("Updated Text:", res.json()["question_text"])
    assert "Updated" in res.json()["question_text"]

    print("\n--- Test 8: Admin deleting question (Should succeed 200 and cascade choices) ---")
    # Check choice counts before delete
    res_choices_before = client.get(f"/choices?question_id={new_q_id}", headers=headers)
    choices_before_count = len(res_choices_before.json())
    print("Choices count before delete:", choices_before_count)
    assert choices_before_count == 3
    
    # Delete question
    res_delete = client.delete(f"/questions/{new_q_id}", headers=admin_headers)
    print("Delete Question Status:", res_delete.status_code)
    assert res_delete.status_code == 200
    
    # Check choices count after delete (should be empty / 0 because of CASCADE delete-orphan)
    res_choices_after = client.get(f"/choices?question_id={new_q_id}", headers=headers)
    choices_after_count = len(res_choices_after.json())
    print("Choices count after delete:", choices_after_count)
    assert choices_after_count == 0

    print("\n--- ALL TESTS COMPLETED SUCCESSFULLY! ---")

if __name__ == "__main__":
    run_tests()
