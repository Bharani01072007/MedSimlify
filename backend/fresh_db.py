"""
fresh_db.py - Completely standalone database recreator.
No imports from backend needed. Just pure sqlite3.
Run: python fresh_db.py
"""
import sqlite3
import os
import sys
from datetime import datetime

# Target path - we write ONLY to backend/medsimplify.db
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(SCRIPT_DIR, "medsimplify.db")
TEMP_DB_PATH = os.path.join(SCRIPT_DIR, "medsimplify_new.db")

def remove_lock_files(path):
    for ext in ["-wal", "-shm", "-journal"]:
        f = path + ext
        if os.path.exists(f):
            try:
                os.remove(f)
                print(f"  Removed lock file: {f}")
            except Exception as e:
                print(f"  Could not remove {f}: {e}")

def rebuild():
    print("=" * 60)
    print("FRESH DATABASE REBUILD")
    print(f"Target: {DB_PATH}")
    print("=" * 60)

    # 1. Remove any temp DB leftover from a previous run
    remove_lock_files(TEMP_DB_PATH)
    if os.path.exists(TEMP_DB_PATH):
        try:
            os.remove(TEMP_DB_PATH)
        except Exception:
            pass

    # 2. Create fresh SQLite database at TEMP path (avoids DBeaver lock on original)
    print(f"  Writing to temp file: {TEMP_DB_PATH}")
    conn = sqlite3.connect(TEMP_DB_PATH)
    c = conn.cursor()

    # Enable WAL mode for better concurrency
    c.execute("PRAGMA journal_mode=WAL;")
    c.execute("PRAGMA foreign_keys=ON;")

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Create all tables
    c.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            full_name TEXT,
            role TEXT DEFAULT 'patient',
            is_active INTEGER DEFAULT 1,
            created_at TEXT,
            updated_at TEXT
        );

        CREATE TABLE IF NOT EXISTS patient_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date_of_birth TEXT,
            blood_group TEXT,
            height REAL,
            weight REAL,
            allergies TEXT,
            medical_history TEXT,
            emergency_contact TEXT,
            address TEXT,
            phone TEXT,
            profile_picture TEXT,
            created_at TEXT,
            updated_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS doctor_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            specialization TEXT,
            license_number TEXT,
            years_of_experience INTEGER,
            hospital_name TEXT,
            consultation_fee REAL,
            bio TEXT,
            phone TEXT,
            profile_picture TEXT,
            available_days TEXT,
            available_hours TEXT,
            created_at TEXT,
            updated_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS family_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            relationship TEXT,
            date_of_birth TEXT,
            blood_group TEXT,
            phone TEXT,
            created_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doctor_id INTEGER NOT NULL,
            patient_id INTEGER NOT NULL,
            is_active INTEGER DEFAULT 1,
            created_at TEXT,
            last_message_at TEXT,
            FOREIGN KEY (patient_id) REFERENCES users(id),
            FOREIGN KEY (doctor_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id INTEGER NOT NULL,
            sender_id INTEGER NOT NULL,
            message_text TEXT NOT NULL,
            message_type TEXT DEFAULT 'text',
            file_url TEXT,
            is_read INTEGER DEFAULT 0,
            sent_at TEXT,
            FOREIGN KEY (chat_id) REFERENCES chats(id),
            FOREIGN KEY (sender_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS medical_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            report_name TEXT,
            report_type TEXT,
            file_path TEXT,
            file_url TEXT,
            notes TEXT,
            uploaded_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS medicine_reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            medicine_name TEXT NOT NULL,
            dosage TEXT,
            frequency TEXT,
            timing TEXT,
            start_date TEXT,
            end_date TEXT,
            is_active INTEGER DEFAULT 1,
            last_taken_at TEXT,
            created_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS medicine_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reminder_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            taken_at TEXT,
            status TEXT DEFAULT 'taken',
            notes TEXT,
            FOREIGN KEY (reminder_id) REFERENCES medicine_reminders(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER,
            doctor_id INTEGER,
            user_id INTEGER,
            appointment_date TEXT,
            appointment_time TEXT,
            appointment_type TEXT DEFAULT 'in-person',
            status TEXT DEFAULT 'scheduled',
            reason TEXT,
            notes TEXT,
            created_at TEXT,
            FOREIGN KEY (patient_id) REFERENCES users(id),
            FOREIGN KEY (doctor_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS symptoms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            symptoms_list TEXT,
            symptoms_json TEXT,
            severity TEXT,
            duration TEXT,
            notes TEXT,
            additional_notes TEXT,
            reported_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS prescriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER,
            doctor_id INTEGER,
            diagnosis TEXT,
            medicines_json TEXT,
            advice TEXT,
            general_advice TEXT,
            prescription_date TEXT,
            created_at TEXT,
            FOREIGN KEY (patient_id) REFERENCES users(id),
            FOREIGN KEY (doctor_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS medicines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prescription_id INTEGER,
            name TEXT NOT NULL,
            dosage TEXT,
            frequency TEXT,
            duration TEXT,
            instructions TEXT,
            FOREIGN KEY (prescription_id) REFERENCES prescriptions(id)
        );
    """)

    # Seed Users
    users = [
        (1, "rajesh.kumar@email.com", "hashed_pw_1", "Rajesh Kumar", "patient", 1, now, now),
        (2, "priya.sharma@hospital.com", "hashed_pw_2", "Dr. Priya Sharma", "doctor", 1, now, now),
        (3, "meena.iyer@email.com", "hashed_pw_3", "Meena Iyer", "patient", 1, now, now),
        (4, "sunil.rao@email.com", "hashed_pw_4", "Sunil Rao", "patient", 1, now, now),
        (5, "farah.khan@email.com", "hashed_pw_5", "Farah Khan", "patient", 1, now, now),
    ]
    c.executemany("INSERT OR REPLACE INTO users (id,email,hashed_password,full_name,role,is_active,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)", users)

    # Seed Patient Profiles
    patients = [
        (1, 1, "1990-05-15", "B+", 175.0, 72.0, "Penicillin", "Hypertension", "+91-9876543210", "12 MG Road, Bangalore", "+91-9876543210", None, now, now),
        (2, 3, "1985-08-20", "O+", 160.0, 58.0, "None", "Diabetes Type 2", "+91-9876543211", "45 Anna Nagar, Chennai", "+91-9876543211", None, now, now),
        (3, 4, "1992-03-10", "A-", 168.0, 75.0, "Sulfa drugs", "Asthma", "+91-9876543212", "78 Koramangala, Bangalore", "+91-9876543212", None, now, now),
        (4, 5, "1988-11-25", "AB+", 162.0, 55.0, "None", "Thyroid issues", "+91-9876543213", "23 Bandra, Mumbai", "+91-9876543213", None, now, now),
    ]
    c.executemany("INSERT OR REPLACE INTO patient_profiles (id,user_id,date_of_birth,blood_group,height,weight,allergies,medical_history,emergency_contact,address,phone,profile_picture,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", patients)

    # Seed Doctor Profile
    doctors = [
        (1, 2, "Cardiology", "MCI-2019-12345", 10, "Apollo Hospital", 800.0, "Experienced cardiologist specializing in heart disease prevention.", "+91-9876543220", None, "Mon,Tue,Wed,Thu,Fri", "09:00-17:00", now, now),
    ]
    c.executemany("INSERT OR REPLACE INTO doctor_profiles (id,user_id,specialization,license_number,years_of_experience,hospital_name,consultation_fee,bio,phone,profile_picture,available_days,available_hours,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", doctors)

    # Seed Family Members
    family = [
        (1, 1, "Kavitha Kumar", "Spouse", "1992-07-10", "A+", "+91-9876543215", now),
        (2, 1, "Ravi Kumar", "Son", "2018-03-25", "B+", None, now),
        (3, 3, "Suresh Iyer", "Husband", "1982-12-01", "O-", "+91-9876543216", now),
    ]
    c.executemany("INSERT OR REPLACE INTO family_members (id,user_id,name,relationship,date_of_birth,blood_group,phone,created_at) VALUES (?,?,?,?,?,?,?,?)", family)

    # Seed Chats
    chats = [
        (1, 2, 1, 1, now, now),
        (2, 2, 3, 1, now, now),
    ]
    c.executemany("INSERT OR REPLACE INTO chats (id,doctor_id,patient_id,is_active,created_at,last_message_at) VALUES (?,?,?,?,?,?)", chats)

    # Seed Messages
    msgs = [
        (1, 1, 1, "Hello Dr. Priya, I have been having chest pain since morning.", "text", None, 1, now),
        (2, 1, 2, "Hello Rajesh, please describe your pain level from 1-10.", "text", None, 1, now),
        (3, 1, 1, "It is around 6/10. It increases when I walk fast.", "text", None, 0, now),
        (4, 2, 3, "Doctor, my blood sugar was 280 this morning.", "text", None, 1, now),
        (5, 2, 2, "That is high Meena. Have you taken your medication today?", "text", None, 1, now),
    ]
    c.executemany("INSERT OR REPLACE INTO messages (id,chat_id,sender_id,message_text,message_type,file_url,is_read,sent_at) VALUES (?,?,?,?,?,?,?,?)", msgs)

    # Seed Medical Reports
    reports = [
        (1, 1, "ECG Report - Sept 2026", "cardiology", None, None, "Normal sinus rhythm. No ST changes.", now),
        (2, 1, "Blood Work - Sept 2026", "lab", None, None, "Cholesterol slightly elevated at 210 mg/dL.", now),
        (3, 3, "HbA1c Report - Sept 2026", "lab", None, None, "HbA1c: 8.2%. Needs better glucose control.", now),
    ]
    c.executemany("INSERT OR REPLACE INTO medical_reports (id,user_id,report_name,report_type,file_path,file_url,notes,uploaded_at) VALUES (?,?,?,?,?,?,?,?)", reports)

    # Seed Medicine Reminders
    reminders = [
        (1, 1, "Atenolol 50mg", "50mg", "Once daily", "Morning 8AM", "2026-09-01", "2026-12-31", 1, now, now),
        (2, 1, "Aspirin 75mg", "75mg", "Once daily", "Night 9PM", "2026-09-01", "2026-12-31", 1, now, now),
        (3, 3, "Metformin 500mg", "500mg", "Twice daily", "8AM & 8PM", "2026-09-01", "2026-12-31", 1, now, now),
        (4, 4, "Montelukast 10mg", "10mg", "Once daily", "Bedtime", "2026-09-01", "2026-12-31", 1, now, now),
    ]
    c.executemany("INSERT OR REPLACE INTO medicine_reminders (id,user_id,medicine_name,dosage,frequency,timing,start_date,end_date,is_active,last_taken_at,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)", reminders)

    # Seed Medicine Logs
    logs = [
        (1, 1, 1, now, "taken", "Took with breakfast"),
        (2, 2, 1, now, "taken", "Took before sleep"),
        (3, 3, 3, now, "taken", "Took after meals"),
        (4, 4, 4, now, "missed", "Forgot at night"),
    ]
    c.executemany("INSERT OR REPLACE INTO medicine_logs (id,reminder_id,user_id,taken_at,status,notes) VALUES (?,?,?,?,?,?)", logs)

    # Seed Appointments
    appointments = [
        (1, 1, 2, 1, "2026-09-25", "10:30 AM", "in-person", "scheduled", "Routine cardiac checkup", "Please bring previous ECG reports", now),
        (2, 3, 2, 3, "2026-09-26", "11:00 AM", "video", "scheduled", "Diabetes follow-up", "Fasting blood sugar test required before visit", now),
        (3, 4, 2, 4, "2026-09-28", "03:00 PM", "in-person", "scheduled", "Asthma management review", None, now),
    ]
    c.executemany("INSERT OR REPLACE INTO appointments (id,patient_id,doctor_id,user_id,appointment_date,appointment_time,appointment_type,status,reason,notes,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)", appointments)

    # Seed Symptoms
    symptoms = [
        (1, 1, "chest pain, shortness of breath", '["chest pain","shortness of breath"]', "moderate", "3 hours", "Pain worsens on exertion", "No fever, no cough", now),
        (2, 3, "excessive thirst, frequent urination", '["excessive thirst","frequent urination","fatigue"]', "mild", "2 days", "Increased blood sugar noticed", None, now),
        (3, 4, "wheezing, breathlessness", '["wheezing","breathlessness","chest tightness"]', "moderate", "1 day", "Triggered by dust exposure", None, now),
    ]
    c.executemany("INSERT OR REPLACE INTO symptoms (id,user_id,symptoms_list,symptoms_json,severity,duration,notes,additional_notes,reported_at) VALUES (?,?,?,?,?,?,?,?,?)", symptoms)

    # Seed Prescriptions
    prescriptions = [
        (1, 1, 2, "Hypertension with chest pain", '[{"name":"Atenolol","dosage":"50mg","frequency":"once daily"},{"name":"Aspirin","dosage":"75mg","frequency":"once daily"}]', "Avoid stress. Take morning walks.", "Reduce salt intake. Monitor BP daily.", now, now),
        (2, 3, 2, "Uncontrolled Diabetes Type 2", '[{"name":"Metformin","dosage":"500mg","frequency":"twice daily"},{"name":"Glipizide","dosage":"5mg","frequency":"once daily"}]', "Follow diabetic diet. Avoid sweets.", "Check HbA1c every 3 months.", now, now),
    ]
    c.executemany("INSERT OR REPLACE INTO prescriptions (id,patient_id,doctor_id,diagnosis,medicines_json,advice,general_advice,prescription_date,created_at) VALUES (?,?,?,?,?,?,?,?,?)", prescriptions)

    # Seed Medicines
    medicines = [
        (1, 1, "Atenolol", "50mg", "Once daily", "30 days", "Take in the morning"),
        (2, 1, "Aspirin", "75mg", "Once daily", "30 days", "Take at night after food"),
        (3, 2, "Metformin", "500mg", "Twice daily", "60 days", "Take with meals"),
        (4, 2, "Glipizide", "5mg", "Once daily", "30 days", "Take 30 minutes before breakfast"),
    ]
    c.executemany("INSERT OR REPLACE INTO medicines (id,prescription_id,name,dosage,frequency,duration,instructions) VALUES (?,?,?,?,?,?,?)", medicines)

    conn.commit()

    # Integrity check
    result = c.execute("PRAGMA integrity_check;").fetchone()[0]
    print(f"\n  PRAGMA integrity_check: {result}")

    # Print table counts
    tables = c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").fetchall()
    print(f"\n  Tables created: {len(tables)}")
    for (tname,) in tables:
        cnt = c.execute(f"SELECT COUNT(*) FROM {tname}").fetchone()[0]
        print(f"    {tname:<25}: {cnt} rows")

    conn.close()

    # === ATOMIC RENAME: Replace old DB with new one ===
    print(f"\n  Replacing {DB_PATH} with freshly built database...")
    try:
        # Try to remove the old locked file
        if os.path.exists(DB_PATH):
            os.remove(DB_PATH)
        os.rename(TEMP_DB_PATH, DB_PATH)
        print(f"  Successfully replaced database file!")
    except PermissionError:
        print(f"\n  ⚠️  Could not replace {DB_PATH} - DBeaver still has it locked.")
        print(f"  The new database is ready at: {TEMP_DB_PATH}")
        print(f"\n  DO THIS IN DBEAVER:")
        print(f"  1. Right-click medsimplify.db -> Disconnect")
        print(f"  2. Right-click medsimplify.db -> Edit Connection")
        print(f"  3. Change Path to: {TEMP_DB_PATH}")
        print(f"  4. Click Test Connection -> OK -> Finish")
        print(f"\n  OR: Close DBeaver completely, then run this script again.")
        return

    print("\n" + "=" * 60)
    print("SUCCESS! Fresh database ready at:")
    print(f"  {DB_PATH}")
    print("=" * 60)
    print("\nIn DBeaver:")
    print("  1. Right-click medsimplify.db -> Disconnect")
    print("  2. Right-click medsimplify.db -> Edit Connection")
    print(f"  3. Set Path to: {DB_PATH}")
    print("  4. Click Test Connection -> Finish")
    print("  5. Expand Tables -> double-click any table -> Data tab")

if __name__ == "__main__":
    rebuild()

