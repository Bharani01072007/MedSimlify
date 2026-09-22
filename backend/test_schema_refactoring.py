import sys
import os

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app
from app.schemas.schemas import (
    MedicineItem, PrescriptionCreate, SymptomCreate, MedicineReminderCreate,
    UserRegister, PainLevelEnum, EnergyLevelEnum, UserRoleEnum, MedicineFrequencyEnum, MedicineTimingEnum
)

client = TestClient(app)

def test_schema_refactoring():
    print("=" * 80)
    print("VERIFYING SCHEMA REFACTORING (MedicineItem, Enums, Field Constraints, Base Schemas)")
    print("=" * 80)

    # 1. Test Prescription with MedicineItem validation
    print("\n[TEST 1] Testing PrescriptionCreate with MedicineItem model...")
    rx_payload = {
        "patient_id": 1,
        "medicines": [
            {
                "name": "Amoxicillin 500mg",
                "dosage": "500mg",
                "frequency": "TDS (Thrice daily)",
                "duration": "5 days",
                "instructions": "After food",
                "timing": "After food",
                "time": "08:00 AM"
            }
        ],
        "advice": "Drink plenty of water",
        "follow_up_date": "2026-09-27"
    }
    res_rx = client.post("/api/prescriptions/?doctor_id=1", json=rx_payload)
    assert res_rx.status_code == 200, f"Prescription failed: {res_rx.text}"
    print("  ✅ Prescription with MedicineItem schema validated successfully!")

    # 2. Test SymptomCreate with Enums and Range Constraints
    print("\n[TEST 2] Testing SymptomCreate with Enums and fever_temperature Range...")
    symptom_payload = {
        "symptoms_list": ["Fever", "Cough"],
        "fever_temperature": 101.5,
        "pain_level": "Mild",
        "energy_level": "Normal",
        "notes": "Mild morning fever"
    }
    res_symp = client.post("/api/symptoms/?patient_id=1", json=symptom_payload)
    assert res_symp.status_code == 200, f"Symptom failed: {res_symp.text}"
    print("  ✅ Symptom with Enums & Range validation succeeded!")

    # 3. Test Invalid Fever Range (out of bounds)
    print("\n[TEST 3] Testing Invalid Fever Range (120°F) validation failure...")
    invalid_symptom = {
        "symptoms_list": ["High Fever"],
        "fever_temperature": 120.0,
        "pain_level": "Severe"
    }
    res_invalid = client.post("/api/symptoms/?patient_id=1", json=invalid_symptom)
    assert res_invalid.status_code == 422, f"Expected 422 Unprocessable Entity, got {res_invalid.status_code}"
    print("  ✅ Out of range fever (120°F) correctly rejected with HTTP 422 Unprocessable Entity!")

    # 4. Test UserRegister with Password Length constraint & Role Enum
    print("\n[TEST 4] Testing UserRegister with Password constraint and Role Enum...")
    auth_payload = {
        "email": "doctor_test_schema@medsimplify.com",
        "password": "securepassword123",
        "role": "doctor",
        "name": "Dr. Schema Test"
    }
    res_auth = client.post("/api/auth/register", json=auth_payload)
    assert res_auth.status_code == 200, f"Register failed: {res_auth.text}"
    print("  ✅ UserRegister schema validated successfully!")

    print("\n" + "=" * 80)
    print("ALL SCHEMA REFACTORING VERIFICATION TESTS PASSED 100% SUCCESSFULLY!")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    test_schema_refactoring()
