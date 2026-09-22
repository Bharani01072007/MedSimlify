import sys
import os
import json

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_medicines_audit_doc_cases():
    print("=" * 80)
    print("VERIFYING MEDICINES & REMINDERS ENDPOINTS (POST /api/medicines/?patient_id=2)")
    print("=" * 80)

    # ----------------------------------------------------
    # TEST 1: POST /api/medicines/?patient_id=2 (Add Medicine)
    # ----------------------------------------------------
    print("\n[TEST 1] Testing POST /api/medicines/?patient_id=2...")
    payload1 = {
        "medicine_name": "Atorvastatin",
        "dosage": "20mg",
        "reminder_time": "21:00",
        "frequency": "Daily",
        "timing": "After food"
    }
    res1 = client.post("/api/medicines/?patient_id=2", json=payload1)
    assert res1.status_code == 200, f"Expected 200 OK, got {res1.status_code} ({res1.text})"
    data1 = res1.json()

    print(f"  Response Body: {data1}")
    assert data1["id"] is not None
    assert data1["patient_id"] == 2
    assert data1["medicine_name"] == "Atorvastatin"
    assert data1["dosage"] == "20mg"
    assert data1["reminder_time"] == "21:00"
    assert data1["frequency"] == "Daily"
    assert data1["timing"] == "After food"
    assert data1["is_active"] == True
    print(f"  ✅ Medicine reminder added for patient_id=2! ID={data1['id']}.")

    # ----------------------------------------------------
    # TEST 2: GET /api/medicines/?patient_id=2
    # ----------------------------------------------------
    print("\n[TEST 2] Testing GET /api/medicines/?patient_id=2...")
    res2 = client.get("/api/medicines/?patient_id=2")
    assert res2.status_code == 200, f"Expected 200 OK, got {res2.status_code}"
    med_list = res2.json()
    assert len(med_list) >= 1
    print(f"  ✅ GET /api/medicines/ returned {len(med_list)} active reminders for patient 2.")

    # ----------------------------------------------------
    # TEST 3: POST /api/medicines/{id}/log-taken & Adherence
    # ----------------------------------------------------
    print("\n[TEST 3] Testing Log Medicine Taken & Adherence Calculation...")
    med_id = med_list[0]["id"]
    res3 = client.post(f"/api/medicines/{med_id}/log-taken?status=taken")
    assert res3.status_code == 200
    print(f"  ✅ Logged dose as 'taken' for reminder ID={med_id}.")

    res4 = client.get("/api/medicines/adherence?patient_id=2")
    assert res4.status_code == 200
    adh = res4.json()
    print(f"  ✅ Calculated Adherence Score: {adh['adherence_score']}% ({adh['taken_doses']}/{adh['total_doses']} doses).")

    print("\n" + "=" * 80)
    print("ALL MEDICINES & REMINDERS ENDPOINT TESTS PASSED 100% SUCCESSFULLY!")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    test_medicines_audit_doc_cases()
