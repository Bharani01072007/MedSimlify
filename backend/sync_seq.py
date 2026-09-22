from dotenv import load_dotenv
load_dotenv()

from config.database import engine, SessionLocal
from sqlalchemy import text

db = SessionLocal()
tables = [
    "users", "patient_profiles", "doctor_profiles", "family_members",
    "chats", "messages", "medical_reports", "medicine_reminders",
    "medicine_logs", "appointments", "symptoms", "prescriptions", "medicines"
]

print("Syncing PostgreSQL primary key sequences in Supabase...")
for t in tables:
    try:
        db.execute(text(f"SELECT setval(pg_get_serial_sequence('{t}', 'id'), COALESCE((SELECT MAX(id) FROM {t}), 1));"))
        print(f" ✅ Resynced sequence for table: {t}")
    except Exception as e:
        print(f" ⚠️ {t}: {e}")

db.commit()
db.close()
print("🎉 All Supabase PostgreSQL sequences synchronized!")
