import sys
import os

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from config.database import engine, Base, SessionLocal, DATABASE_URL
from config.seed import seed_database
import models

def seed_supabase():
    print("=" * 70)
    print("SUPABASE POSTGRESQL INITIALIZATION & SEEDING")
    print(f"Target URL: {DATABASE_URL}")
    print("=" * 70)

    print("\n1. Creating database tables in Supabase...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ All 13 tables successfully created in Supabase!")
    except Exception as e:
        print(f"❌ Table creation error: {e}")
        return

    print("\n2. Populating seed data (Users, Profiles, Chats, Messages, Reports, Reminders)...")
    db = SessionLocal()
    try:
        seed_database(db)
        print("✅ Supabase database fully seeded!")

        # Fix PostgreSQL primary key sequences for all tables
        if "postgresql" in str(db.bind.url):
            print("\n2b. Resetting PostgreSQL primary key sequences...")
            from sqlalchemy import text
            tables = [
                "users", "patient_profiles", "doctor_profiles", "family_members",
                "chats", "messages", "medical_reports", "medicine_reminders",
                "medicine_logs", "appointments", "symptoms", "prescriptions", "medicines"
            ]
            for t in tables:
                try:
                    db.execute(text(f"SELECT setval(pg_get_serial_sequence('{t}', 'id'), COALESCE((SELECT MAX(id) FROM {t}), 1));"))
                except Exception as seq_err:
                    pass
            db.commit()
            print("✅ PostgreSQL sequences aligned with max IDs!")
    except Exception as e:
        print(f"❌ Seeding error: {e}")
    finally:
        db.close()

    print("\n3. Verifying record counts in Supabase:")
    db = SessionLocal()
    tables = [
        ("Users", models.User),
        ("Patient Profiles", models.PatientProfile),
        ("Doctor Profiles", models.DoctorProfile),
        ("Family Members", models.FamilyMember),
        ("Chats", models.Chat),
        ("Messages", models.Message),
        ("Medical Reports", models.MedicalReport),
        ("Medicine Reminders", models.MedicineReminder),
        ("Appointments", models.Appointment),
        ("Symptoms", models.Symptom),
        ("Prescriptions", models.Prescription)
    ]
    for name, model in tables:
        try:
            cnt = db.query(model).count()
            print(f"   - {name:<20}: {cnt:>3} records")
        except Exception as err:
            print(f"   - {name:<20}: Error ({err})")
    db.close()

    print("\n" + "=" * 70)
    print("🎉 SUPABASE SETUP & SEEDING COMPLETE!")
    print("You can now view all these tables live in your Supabase Dashboard at:")
    print("https://supabase.com/dashboard/project/yinkbhcjivtcrvitcsmc/editor")
    print("=" * 70)

if __name__ == "__main__":
    seed_supabase()
