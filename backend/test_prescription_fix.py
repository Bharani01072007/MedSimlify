import sys
import os

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_prescriptions_audit_doc_cases():
    print("=" * 80)
    print("VERIFYING PRESCRIPTIONS ENDPOINTS (POST /api/prescriptions/ & GET /api/prescriptions/)")
    print("=" * 80)

    # ----------------------------------------------------
    # TEST 1: POST /api/prescriptions/?doctor_id=1
    # ----------------------------------------------------
    print("\n[TEST 1] Testing POST /api/prescriptions/?doctor_id=1...")
    payload = {
        "patient_id": 2,
        "medicines": [
            {
                "name": "Atorvastatin 20mg",
                "dosage": "1 tablet",
                "time": "21:00",
                "timing": "After food"
            },
            {
                "name": "Aspirin 75mg",
                "dosage": "1 tablet",
                "time": "08:00 AM",
                "timing": "After food"
            }
        ],
        "advice": "Low lipid diet, routine exercise, avoid alcohol.",
        "follow_up_date": "2026-09-22"
    }
    res1 = client.post("/api/prescriptions/?doctor_id=1", json=payload)
    assert res1.status_code == 200, f"Expected 200 OK, got {res1.status_code} ({res1.text})"
    data1 = res1.json()

    print(f"  Response Body: {data1}")
    assert data1["status"] == "issued"
    assert data1["prescription_id"] is not None
    assert data1["created_reminders_count"] == 2
    assert len(data1["drug_interaction_warnings"]) > 0
    print(f"  ✅ Prescription issued successfully! ID={data1['prescription_id']}, Warnings={data1['drug_interaction_warnings']}")

    # ----------------------------------------------------
    # TEST 2: GET /api/prescriptions/?patient_id=2
    # ----------------------------------------------------
    print("\n[TEST 2] Testing GET /api/prescriptions/?patient_id=2...")
    res2 = client.get("/api/prescriptions/?patient_id=2")
    assert res2.status_code == 200, f"Expected 200 OK, got {res2.status_code}"
    rxs_list = res2.json()
    assert len(rxs_list) >= 1
    print(f"  ✅ GET /api/prescriptions/ returned {len(rxs_list)} prescription records from database.")

    print("\n" + "=" * 80)
    print("ALL PRESCRIPTIONS ENDPOINT TESTS PASSED 100% SUCCESSFULLY!")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    test_prescriptions_audit_doc_cases()
