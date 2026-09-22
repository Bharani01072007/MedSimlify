import sys
import os
import json

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_appointments_audit_doc_cases():
    print("=" * 80)
    print("VERIFYING APPOINTMENTS ENDPOINTS (POST /api/appointments/)")
    print("=" * 80)

    # ----------------------------------------------------
    # TEST 1: POST /api/appointments/?doctor_id=1&patient_id=2&reason=...
    # ----------------------------------------------------
    print("\n[TEST 1] Testing POST /api/appointments/?doctor_id=1&patient_id=2...")
    reason_str = "Follow-up on lipid panel & cholesterol management"
    res1 = client.post(f"/api/appointments/?doctor_id=1&patient_id=2&reason={reason_str}")
    assert res1.status_code == 200, f"Expected 200 OK, got {res1.status_code} ({res1.text})"
    data1 = res1.json()

    print(f"  Response Body: {data1}")
    assert "appointment" in data1
    app_obj = data1["appointment"]
    assert app_obj["id"] is not None
    assert app_obj["patient_id"] == 2
    assert app_obj["reason"] == reason_str
    assert app_obj["status"] == "scheduled"
    print(f"  ✅ Appointment scheduled successfully! ID={app_obj['id']}, Patient ID={app_obj['patient_id']}.")

    # ----------------------------------------------------
    # TEST 2: GET /api/appointments/?patient_id=2
    # ----------------------------------------------------
    print("\n[TEST 2] Testing GET /api/appointments/?patient_id=2...")
    res2 = client.get("/api/appointments/?patient_id=2")
    assert res2.status_code == 200, f"Expected 200 OK, got {res2.status_code}"
    app_list = res2.json()
    assert len(app_list) >= 1
    print(f"  ✅ GET /api/appointments/ returned {len(app_list)} scheduled appointments for patient 2.")

    print("\n" + "=" * 80)
    print("ALL APPOINTMENTS ENDPOINT TESTS PASSED 100% SUCCESSFULLY!")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    test_appointments_audit_doc_cases()
