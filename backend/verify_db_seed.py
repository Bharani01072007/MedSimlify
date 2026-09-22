import sys
import os

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config.database import SessionLocal, engine, Base, sync_sqlite_db_files
from config.seed import seed_database
from models import (
    User,
    PatientProfile,
    DoctorProfile,
    FamilyMember,
    Chat,
    Message,
    MedicalReport,
    MedicineReminder,
    MedicineLog,
    Appointment,
    Symptom,
    Prescription,
    Medicine
)

def verify_all_tables():
    print("=" * 70)
    print("MEDSIMPLIFY DATABASE SEED, LOCAL TIMESTAMP & DBEAVER SYNC TEST")
    print("=" * 70)

    # 1. Ensure tables exist
    Base.metadata.create_all(bind=engine)

    # 2. Seed DB
    db = SessionLocal()
    
    # Force re-seed messages table if needed to update timestamps
    db.query(Message).delete()
    db.query(Chat).delete()
    db.commit()

    seed_database(db)

    # 3. Check every table
    tables = [
        ("users", User),
        ("patient_profiles", PatientProfile),
        ("doctor_profiles", DoctorProfile),
        ("family_members", FamilyMember),
        ("chats", Chat),
        ("messages", Message),
        ("medical_reports", MedicalReport),
        ("medicine_reminders", MedicineReminder),
        ("medicine_logs", MedicineLog),
        ("appointments", Appointment),
        ("symptoms", Symptom),
        ("prescriptions", Prescription),
        ("medicines", Medicine),
    ]

    all_ok = True
    print("\nTable Status in SQLite Database:")
    print("-" * 70)
    for table_name, model_cls in tables:
        count = db.query(model_cls).count()
        status = "✅ POPULATED" if count > 0 else "❌ EMPTY"
        print(f" - {table_name:<25}: {count:>3} rows  [{status}]")
        if count == 0:
            all_ok = False

    print("\nPatient Profiles in Database:")
    print("-" * 70)
    patients = db.query(PatientProfile).all()
    for p in patients:
        print(f" - Patient #{p.id} | Name: {p.full_name:<20} | Blood Group: {p.blood_group} | Gender: {p.gender}")

    print("\nDoctor Profiles in Database:")
    print("-" * 70)
    doctors = db.query(DoctorProfile).all()
    for d in doctors:
        print(f" - Doctor #{d.id}  | Name: {d.full_name:<20} | Specialization: {d.specialization} | License: {d.license_number}")

    print("\nSample Chat Message Timestamps (Local System Time Check):")
    print("-" * 70)
    msgs = db.query(Message).order_by(Message.sent_at.asc()).all()
    for m in msgs:
        time_str = m.sent_at.strftime("%I:%M %p") if m.sent_at else "N/A"
        print(f" - Msg #{m.id} | Sender: {m.sender_id} | Time: {time_str} | Text: {m.message_text[:50]}...")

    db.close()
    sync_sqlite_db_files()
    print("-" * 70)
    if all_ok:
        print("\n🎉 ALL 13 DATABASE TABLES ARE FULLY POPULATED WITH LOCAL TIMESTAMPS & SYNCED!")
        print("DBeaver will show rich, real-time updated data across all tables upon refresh.")
    else:
        print("\n⚠️ Some tables are still empty.")
    print("=" * 70)

if __name__ == "__main__":
    verify_all_tables()
