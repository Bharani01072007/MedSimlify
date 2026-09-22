import sys
import os
import json

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_auth_audit_doc_cases():
    print("=" * 80)
    print("VERIFYING AUTHENTICATION ENDPOINTS (Authentication.docx)")
    print("=" * 80)

    # Clean up test user if exists
    test_email = "johndoe_test@example.com"

    # ----------------------------------------------------
    # TEST 1: POST /api/auth/register with full_name & role
    # ----------------------------------------------------
    print("\n[TEST 1] Testing POST /api/auth/register with 'full_name' and 'role'...")
    payload1 = {
        "email": test_email,
        "password": "SecurePassword123!",
        "full_name": "John Doe",
        "role": "patient"
    }
    res1 = client.post("/api/auth/register", json=payload1)
    # If already registered, cleanup or test login
    if res1.status_code == 400 and "already registered" in res1.text:
        print("  User already exists, proceeding to login test.")
    else:
        assert res1.status_code == 200, f"Expected 200 OK, got {res1.status_code} ({res1.text})"
        data1 = res1.json()
        assert "access_token" in data1
        assert data1["name"] == "John Doe"
        assert data1["user_type"] == "patient"
        print(f"  ✅ Registration successful! User ID={data1['user_id']}, Token={data1['access_token'][:15]}...")

    # ----------------------------------------------------
    # TEST 2: POST /api/auth/login
    # ----------------------------------------------------
    print("\n[TEST 2] Testing POST /api/auth/login...")
    payload2 = {
        "email": test_email,
        "password": "SecurePassword123!"
    }
    res2 = client.post("/api/auth/login", json=payload2)
    assert res2.status_code == 200, f"Expected 200 OK, got {res2.status_code} ({res2.text})"
    data2 = res2.json()
    assert "access_token" in data2
    assert data2["email"] == test_email
    assert data2["name"] == "John Doe"
    print(f"  ✅ Login successful! User ID={data2['user_id']}, Name='{data2['name']}'.")

    # ----------------------------------------------------
    # TEST 3: POST /api/auth/register for Doctor User
    # ----------------------------------------------------
    print("\n[TEST 3] Testing POST /api/auth/register for Doctor...")
    doc_email = "drsarah_test@example.com"
    payload3 = {
        "email": doc_email,
        "password": "DoctorPassword123!",
        "name": "Dr. Sarah Jenkins",
        "user_type": "doctor"
    }
    res3 = client.post("/api/auth/register", json=payload3)
    if res3.status_code == 400 and "already registered" in res3.text:
        print("  Doctor already exists.")
    else:
        assert res3.status_code == 200, f"Expected 200 OK, got {res3.status_code} ({res3.text})"
        data3 = res3.json()
        assert data3["user_type"] == "doctor"
        assert data3["name"] == "Dr. Sarah Jenkins"
        print(f"  ✅ Doctor registration successful! ID={data3['user_id']}.")

    print("\n" + "=" * 80)
    print("ALL AUTHENTICATION TESTS PASSED 100% SUCCESSFULLY!")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    test_auth_audit_doc_cases()
