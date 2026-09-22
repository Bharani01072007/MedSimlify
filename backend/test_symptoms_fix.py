import sys
import os

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_symptoms_audit_doc_cases():
    print("=" * 80)
    print("VERIFYING SYMPTOMS TRACKER ENDPOINTS (POST /api/symptoms/)")
    print("=" * 80)

    # ----------------------------------------------------
    # TEST 1: POST /api/symptoms/?patient_id=2
    # ----------------------------------------------------
    print("\n[TEST 1] Testing POST /api/symptoms/?patient_id=2...")
    payload = {
        "symptoms_list": ["Fever", "Headache", "Fatigue"],
        "fever_temperature": 101.2,
        "pain_level": "Mild",
        "energy_level": "Low",
        "notes": "Feeling warm since morning with persistent headache."
    }
    res1 = client.post("/api/symptoms/?patient_id=2", json=payload)
    assert res1.status_code == 200, f"Expected 200 OK, got {res1.status_code} ({res1.text})"
    data1 = res1.json()

    print(f"  Response Body: {data1}")
    assert data1["id"] is not None
    assert data1["patient_id"] == 2
    assert "Fever" in data1["symptoms_list"]
    assert data1["fever_temperature"] == 101.2
    assert data1["pain_level"] == "Mild"
    assert data1["energy_level"] == "Low"
    assert data1["notes"] == "Feeling warm since morning with persistent headache."
    print(f"  ✅ Symptom logged successfully! ID={data1['id']}, Patient ID={data1['patient_id']}.")

    # ----------------------------------------------------
    # TEST 2: GET /api/symptoms/trends?patient_id=2
    # ----------------------------------------------------
    print("\n[TEST 2] Testing GET /api/symptoms/trends?patient_id=2...")
    res2 = client.get("/api/symptoms/trends?patient_id=2")
    assert res2.status_code == 200, f"Expected 200 OK, got {res2.status_code}"
    trends_data = res2.json()
    assert "fever_trend" in trends_data
    assert "ai_insights" in trends_data
    print(f"  ✅ GET /api/symptoms/trends returned recovery trend & AI insights.")

    print("\n" + "=" * 80)
    print("ALL SYMPTOMS ENDPOINT TESTS PASSED 100% SUCCESSFULLY!")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    test_symptoms_audit_doc_cases()
