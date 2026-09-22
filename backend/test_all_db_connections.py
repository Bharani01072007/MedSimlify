import requests
import sys

BASE_URL = "http://localhost:8000/api"

def test_backend_and_database():
    print("=== Testing MedSimplify Backend & Database Connectivity ===")
    
    # 1. Health check
    try:
        r = requests.get("http://localhost:8000/health")
        print("1. /health Endpoint:", r.status_code, r.json())
    except Exception as e:
        print("1. /health Failed:", e)

    # 2. Auth Login / Register
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json={"email": "rajesh@email.com", "password": "password123"})
        print("2. Auth Login Endpoint:", r.status_code, r.json().get("access_token", "")[:20] + "...")
    except Exception as e:
        print("2. Auth Login Failed:", e)

    # 3. Reports DB
    try:
        r = requests.get(f"{BASE_URL}/reports/?patient_id=1")
        print("3. Reports DB Endpoint:", r.status_code, f"Found {len(r.json())} reports in database")
    except Exception as e:
        print("3. Reports DB Failed:", e)

    # 4. Medicines DB
    try:
        r = requests.get(f"{BASE_URL}/medicines/?patient_id=1")
        print("4. Medicines DB Endpoint:", r.status_code, f"Found {len(r.json())} medicines in database")
    except Exception as e:
        print("4. Medicines DB Failed:", e)

    # 5. Symptom Tracker DB
    try:
        r = requests.get(f"{BASE_URL}/symptoms/trends?patient_id=1")
        print("5. Symptoms Trends Endpoint:", r.status_code, "DB Response Keys:", list(r.json().keys()))
    except Exception as e:
        print("5. Symptoms Trends Failed:", e)

    # 6. Appointments DB
    try:
        r = requests.get(f"{BASE_URL}/appointments/?patient_id=1")
        print("6. Appointments DB Endpoint:", r.status_code, f"Found {len(r.json())} appointments in database")
    except Exception as e:
        print("6. Appointments DB Failed:", e)

    # 7. Doctor Patients Chat Threads DB
    try:
        r = requests.get(f"{BASE_URL}/chat/threads")
        print("7. Doctor Chat Threads Endpoint:", r.status_code, f"Found {len(r.json())} patient chat threads in database")
    except Exception as e:
        print("7. Doctor Chat Threads Failed:", e)

    # 8. RAG AI Assistant Pipeline
    try:
        r = requests.post(f"{BASE_URL}/chat/ai/ask", json={"question": "What to do in dengue fever?", "language": "en", "report_ids": [1]})
        print("8. AI Assistant RAG Pipeline Endpoint:", r.status_code, "Answer snippet:", r.json().get("answer", "")[:80] + "...")
    except Exception as e:
        print("8. AI Assistant RAG Pipeline Failed:", e)

if __name__ == "__main__":
    test_backend_and_database()
