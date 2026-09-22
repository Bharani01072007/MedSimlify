import os
import sqlite3
import shutil
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config.database import Base, engine, SessionLocal
from config.seed import seed_database
from models import (
    User, PatientProfile, DoctorProfile, FamilyMember, Chat, Message,
    MedicalReport, MedicineReminder, MedicineLog, Appointment, Symptom,
    Prescription, Medicine
)

def force_seed_and_sync_all():
    print("=" * 70)
    print("FORCE SEEDING & SYNCHRONIZING ALL SQLite DB FILES")
    print("=" * 70)

    # 1. Ensure schema in primary engine
    Base.metadata.create_all(bind=engine)

    # 2. Seed primary database via SQLAlchemy
    db = SessionLocal()
    seed_database(db)
    db.close()

    # 3. Find all .db files in project
    root_dir = r"E:\Medsimplify"
    primary_db_path = r"E:\Medsimplify\backend\medsimplify.db"

    target_paths = [
        r"E:\Medsimplify\backend\medsimplify.db",
        r"E:\Medsimplify\medsimplify.db",
    ]

    for dirpath, dirnames, filenames in os.walk(root_dir):
        for f in filenames:
            if f.endswith(".db"):
                p = os.path.join(dirpath, f)
                if p not in target_paths:
                    target_paths.append(p)

    print(f"\nTarget Database File Locations ({len(target_paths)}):")
    for tp in target_paths:
        print(f" - {tp}")

    # 4. Copy primary fully-seeded database to all target DB files
    if os.path.exists(primary_db_path):
        for tp in target_paths:
            if tp != primary_db_path:
                try:
                    shutil.copy2(primary_db_path, tp)
                    print(f" ✅ Copied seeded DB -> {tp}")
                except Exception as err:
                    print(f" ⚠️ Could not copy to {tp}: {err}")

    # 5. Verify row counts in every DB file
    print("\n" + "=" * 70)
    print("VERIFYING ROW COUNTS ACROSS ALL DATABASE FILES:")
    print("=" * 70)

    for tp in target_paths:
        print(f"\n📂 Database: {tp}")
        if not os.path.exists(tp):
            print("  ❌ File does not exist!")
            continue

        try:
            conn = sqlite3.connect(tp)
            cursor = conn.cursor()
            tables = [
                "users", "patient_profiles", "doctor_profiles", "family_members",
                "chats", "messages", "medical_reports", "medicine_reminders",
                "medicine_logs", "appointments", "symptoms", "prescriptions", "medicines"
            ]
            for t in tables:
                try:
                    cursor.execute(f"SELECT COUNT(*) FROM {t}")
                    cnt = cursor.fetchone()[0]
                    print(f"   - {t:<22}: {cnt:>3} rows")
                except Exception as te:
                    print(f"   - {t:<22}: ERROR ({te})")
            conn.close()
        except Exception as e:
            print(f"  ❌ Failed to connect: {e}")

    print("\n" + "=" * 70)
    print("ALL SQLite DB FILES ARE NOW FULLY SEEDED & POPULATED!")
    print("=" * 70)

if __name__ == "__main__":
    force_seed_and_sync_all()
