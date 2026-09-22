import sys
import os

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[union-attr]
        sys.stderr.reconfigure(encoding="utf-8")  # type: ignore[union-attr]
    except Exception:
        pass

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config.database import SessionLocal, test_connection
from models.user import User
from models.patient_profile import PatientProfile
from datetime import datetime

def test_database():
    """
    Test database connection and basic operations
    """
    print("=" * 60)
    print("DATABASE CONNECTION TEST")
    print("=" * 60)
    
    # Test 1: Connection
    print("\n1. Testing database connection...")
    if not test_connection():
        print("[FAIL] Database connection failed!")
        print("\nTroubleshooting:")
        print("  1. Check PostgreSQL is running: sudo systemctl status postgresql")
        print("  2. Check database exists: psql -U postgres -c '\\l'")
        print("  3. Try connecting with DBeaver to debug")
        return
    
    print("[OK] Database connection successful!")
    
    # Test 2: Create test user
    print("\n2. Creating test user...")
    db = SessionLocal()
    
    try:
        existing_user = db.query(User).filter(User.email == "test@example.com").first()
        if existing_user:
            test_user = existing_user
            print(f"[INFO] Test user already exists: ID={test_user.id}, Email={test_user.email}")
        else:
            test_user = User(
                email="test@example.com",
                phone="+919876543210",
                password_hash="hashed_password_here",
                user_type="patient",
                is_active=True,
                is_verified=True
            )
            
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            print(f"[OK] Test user created: ID={test_user.id}, Email={test_user.email}")
            
        print(f"View in DBeaver:")
        print(f"   Right-click 'users' table -> View/Edit Data -> All Rows")
        print(f"   Look for: test@example.com")
        
        # Test 3: Query user
        print("\n3. Querying user...")
        user = db.query(User).filter(User.email == "test@example.com").first()
        
        if user:
            print(f"[OK] User found: {user}")
        else:
            print("[FAIL] User not found!")
        
        # Test 4: Create test patient profile
        print("\n4. Creating test patient profile...")
        existing_patient = db.query(PatientProfile).filter(PatientProfile.user_id == test_user.id).first()
        if existing_patient:
            test_patient = existing_patient
            print(f"[INFO] Test patient profile already exists: ID={test_patient.id}, Name={test_patient.full_name}")
        else:
            test_patient = PatientProfile(
                user_id=test_user.id,
                full_name="Test Patient",
                date_of_birth=datetime(1990, 1, 1).date(),
                gender="Male",
                blood_group="B+",
                city="Mumbai",
                state="Maharashtra"
            )
            
            db.add(test_patient)
            db.commit()
            db.refresh(test_patient)
            print(f"[OK] Test patient created: ID={test_patient.id}, Name={test_patient.full_name}")
            
        print(f"View in DBeaver:")
        print(f"   Right-click 'patient_profiles' table -> View/Edit Data")
        
        print("\n" + "=" * 60)
        print("[SUCCESS] ALL TESTS PASSED!")
        print("=" * 60)
        print("\nNext Steps:")
        print("  1. Open DBeaver")
        print("  2. Connect to: localhost:5432/medsimplify")
        print("  3. View tables under: Databases -> medsimplify -> Schemas -> public -> Tables")
        print("  4. Right-click 'users' -> View/Edit Data to see test user")
        print("  5. Right-click 'patient_profiles' -> View/Edit Data to see test patient")
        print("\nDatabase is ready to use!")
        
    except Exception as e:
        print(f"[FAIL] Error: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_database()
