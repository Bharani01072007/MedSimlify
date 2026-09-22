from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from config.database import SessionLocal, engine, Base, sync_sqlite_db_files
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
import os

try:
    from loguru import logger
except ImportError:
    import logging
    logger = logging.getLogger("medsimplify")

def seed_database(db: Optional[Session] = None):
    """Seed initial frontend mock data into SQLite database if missing."""
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True

    try:
        now = datetime.now()

        # 0. Clean up dummy "Test Patient" test data if present
        db.query(PatientProfile).filter(PatientProfile.full_name == "Test Patient").delete()
        db.query(User).filter(User.email == "test@example.com").delete()
        db.commit()

        # 1. Users
        if db.query(User).filter(User.email == "patient@medsimplify.com").first() is None:
            logger.info("Seeding users (Rajesh Kumar & Dr. Priya Sharma)...")
            patient_user = User(
                id=1,
                email="patient@medsimplify.com",
                phone="+91-9876543210",
                password_hash="$2b$12$eImiTXuWVxfM37uY4JANjO.g1.h5bWwU/1e",
                user_type="patient",
                is_active=True,
                is_verified=True,
                created_at=now - timedelta(days=30)
            )
            doctor_user = User(
                id=2,
                email="doctor@medsimplify.com",
                phone="+91-9876543211",
                password_hash="$2b$12$eImiTXuWVxfM37uY4JANjO.g1.h5bWwU/1e",
                user_type="doctor",
                is_active=True,
                is_verified=True,
                created_at=now - timedelta(days=30)
            )
            u_meena = User(id=3, email="meena@medsimplify.com", phone="+91-9876543212", password_hash="hashed_pw", user_type="patient")
            u_sunil = User(id=4, email="sunil@medsimplify.com", phone="+91-9876543213", password_hash="hashed_pw", user_type="patient")
            u_farah = User(id=5, email="farah@medsimplify.com", phone="+91-9876543214", password_hash="hashed_pw", user_type="patient")
            
            db.add_all([patient_user, doctor_user, u_meena, u_sunil, u_farah])
            db.commit()

        # 2. Patient Profiles
        if db.query(PatientProfile).filter(PatientProfile.full_name == "Rajesh Kumar").first() is None:
            logger.info("Seeding patient profiles (Rajesh Kumar, Meena Iyer, Sunil Rao, Farah Khan)...")
            p1 = PatientProfile(
                id=1,
                user_id=1,
                full_name="Rajesh Kumar",
                date_of_birth=date(1988, 5, 14),
                gender="Male",
                blood_group="B+",
                address="123 Park Street, Anna Nagar",
                city="Chennai",
                state="Tamil Nadu",
                pincode="600001",
                emergency_contact_name="Priya Kumar",
                emergency_contact_phone="+91-9876543210",
                emergency_contact_relationship="Wife",
                allergies="None known",
                chronic_conditions="None",
                medical_history="Dengue fever recovery (Sep 2026)"
            )
            p2 = PatientProfile(id=2, user_id=3, full_name="Meena Iyer", gender="Female", blood_group="A+", medical_history="Type 2 diabetes")
            p3 = PatientProfile(id=3, user_id=4, full_name="Sunil Rao", gender="Male", blood_group="O+", medical_history="Hypertension")
            p4 = PatientProfile(id=4, user_id=5, full_name="Farah Khan", gender="Female", blood_group="AB+", medical_history="Pregnancy, 22 weeks")
            
            db.add_all([p1, p2, p3, p4])
            db.commit()

        # 3. Doctor Profiles
        if db.query(DoctorProfile).filter(DoctorProfile.full_name == "Dr. Priya Sharma").first() is None:
            logger.info("Seeding doctor profile (Dr. Priya Sharma)...")
            d_profile = DoctorProfile(
                id=1,
                user_id=2,
                full_name="Dr. Priya Sharma",
                specialization="General Medicine",
                license_number="MCI-882140",
                hospital="City Hospital, Chennai",
                experience_years=12,
                consultation_fee=500.0
            )
            db.add(d_profile)
            db.commit()

        # 4. Family Members
        if db.query(FamilyMember).count() == 0:
            logger.info("Seeding family members (Priya Kumar, Rohan Kumar, Savitri Kumar)...")
            fm1 = FamilyMember(
                id=1,
                patient_id=1,
                name="Priya Kumar",
                relationship="Wife",
                age=32,
                gender="Female",
                blood_group="O+",
                medical_reports=["r101", "r102"],
                created_at=now - timedelta(days=10)
            )
            fm2 = FamilyMember(
                id=2,
                patient_id=1,
                name="Rohan Kumar",
                relationship="Son",
                age=8,
                gender="Male",
                blood_group="B+",
                medical_reports=["r103"],
                created_at=now - timedelta(days=10)
            )
            fm3 = FamilyMember(
                id=3,
                patient_id=1,
                name="Savitri Kumar",
                relationship="Mother",
                age=64,
                gender="Female",
                blood_group="A+",
                medical_reports=["r104", "r105"],
                created_at=now - timedelta(days=10)
            )
            db.add_all([fm1, fm2, fm3])
            db.commit()

        # 5. Chats & Messages
        if db.query(Chat).count() == 0:
            logger.info("Seeding chats and messages...")
            chat = Chat(
                id=1,
                doctor_id=2,
                patient_id=1,
                is_active=True,
                created_at=now - timedelta(days=2),
                last_message_at=now - timedelta(minutes=15)
            )
            db.add(chat)
            db.commit()

            m1 = Message(
                id=1,
                chat_id=1,
                sender_id=2, # Doctor
                message_text="Hello Rajesh, I reviewed your latest CBC report. Your platelets dropped to 80,000. Please keep taking ORS fluids and rest.",
                message_type="text",
                sent_at=now - timedelta(minutes=45)
            )
            m2 = Message(
                id=2,
                chat_id=1,
                sender_id=1, # Patient
                message_text="Thank you Dr. Sharma. My fever has come down to 99.1°F today. Should I repeat the CBC test tomorrow?",
                message_type="text",
                sent_at=now - timedelta(minutes=30)
            )
            m3 = Message(
                id=3,
                chat_id=1,
                sender_id=2, # Doctor
                message_text="Yes, please get a repeat CBC done tomorrow morning at 8:00 AM. Also avoid Aspirin and Ibuprofen.",
                message_type="text",
                sent_at=now - timedelta(minutes=15)
            )
            db.add_all([m1, m2, m3])
            db.commit()

        # 6. Medical Reports
        if db.query(MedicalReport).count() == 0:
            logger.info("Seeding medical reports...")
            rep1 = MedicalReport(
                id=1,
                patient_id=1,
                user_id=1,
                report_type="lab_report",
                file_url="sample_cbc_dengue.pdf",
                file_name="CBC_Platelet_Dengue_Report.pdf",
                raw_text="COMPLETE BLOOD COUNT (CBC) & FEVER PANEL\nPatient: Rajesh Kumar, 38M\nDate: 14-Sep-2026\n\nTEST PARAMETER       RESULT         REF RANGE      UNIT\nHaemoglobin          13.8           13.0 - 17.0    g/dL\nTotal WBC Count      3,800 (LOW)    4,000 - 11,000 /uL\nPlatelet Count       80,000 (CRITICAL LOW) 150,000 - 450,000 /uL\nDengue NS1 Antigen   POSITIVE (HIGH)\n",
                extracted_data={
                    "patient_name": "Rajesh Kumar",
                    "entities": [
                        {"name": "Platelet Count", "value": "80,000", "unit": "/uL", "reference": "150,000 - 450,000", "status": "Low"},
                        {"name": "Dengue NS1 Antigen Status", "value": "POSITIVE", "unit": "", "reference": "Negative", "status": "Critical"},
                        {"name": "Haemoglobin", "value": "13.8", "unit": "g/dL", "reference": "13.0 - 17.0", "status": "Normal"},
                        {"name": "Total Leukocyte Count (WBC)", "value": "3,800", "unit": "/uL", "reference": "4,000 - 11,000", "status": "Low"}
                    ]
                },
                simplified_summary={
                    "doc_type": "Dengue & Complete Blood Count (CBC)",
                    "important_findings": [
                        {"title": "Dengue Test: POSITIVE", "lines": ["You have DENGUE FEVER"], "tone": "danger"},
                        {"title": "Platelets: 80,000 /uL (LOW)", "lines": ["Normal: 150,000 - 450,000", "Risk: Bleeding if it drops further"], "tone": "warning"},
                        {"title": "Haemoglobin: 13.8 g/dL", "lines": ["Normal range"], "tone": "good"}
                    ],
                    "what_to_do": [
                        "Drink 3-4 litres of fluids daily (water, ORS, coconut water)",
                        "Take complete bed rest until fever settles",
                        "Take Paracetamol for fever — never take Aspirin or Ibuprofen",
                        "Repeat platelet test after 24 hours"
                    ]
                },
                language="en",
                is_flagged=True,
                flagged_reason="Low Platelet Count (80,000 /uL) and Dengue Positive",
                created_at=now - timedelta(days=2)
            )
            rep2 = MedicalReport(
                id=2,
                patient_id=1,
                user_id=1,
                report_type="lab_report",
                file_url="cbc_13sep.pdf",
                file_name="CBC_Platelets_13Sep.pdf",
                raw_text="CBC Platelets: 120,000 /uL",
                is_flagged=False,
                created_at=now - timedelta(days=3)
            )
            rep3 = MedicalReport(
                id=3,
                patient_id=1,
                user_id=1,
                report_type="x_ray",
                file_url="chest_xray.pdf",
                file_name="Chest_XRay_02Sep.pdf",
                raw_text="Chest X-Ray: Clear lungs",
                is_flagged=False,
                created_at=now - timedelta(days=15)
            )
            db.add_all([rep1, rep2, rep3])
            db.commit()

        # 7. Medicine Reminders & Logs
        if db.query(MedicineReminder).count() == 0:
            logger.info("Seeding medicine reminders...")
            rem1 = MedicineReminder(
                id=1,
                patient_id=1,
                medicine_name="Paracetamol 500mg",
                dosage="1 tablet every 6 hours",
                reminder_time="02:00 PM",
                frequency="Three times daily",
                timing="After food",
                timing_instruction="After food",
                is_active=True,
                created_at=now - timedelta(days=2)
            )
            rem2 = MedicineReminder(
                id=2,
                patient_id=1,
                medicine_name="ORS Sachet",
                dosage="1 sachet in 1L water",
                reminder_time="04:00 PM",
                frequency="Four times daily",
                timing="Sip through the day",
                timing_instruction="Sip through the day",
                is_active=True,
                created_at=now - timedelta(days=2)
            )
            rem3 = MedicineReminder(
                id=3,
                patient_id=1,
                medicine_name="Pantoprazole 40mg",
                dosage="1 tablet daily",
                reminder_time="08:00 AM",
                frequency="Once daily",
                timing="Empty stomach",
                timing_instruction="Empty stomach",
                is_active=False,
                created_at=now - timedelta(days=5)
            )
            db.add_all([rem1, rem2, rem3])
            db.commit()

            ml1 = MedicineLog(
                id=1,
                reminder_id=1,
                scheduled_time=now - timedelta(hours=6),
                taken_at=now - timedelta(hours=6),
                status="taken",
                notes="Taken with water after lunch",
                created_at=now - timedelta(hours=6)
            )
            ml2 = MedicineLog(
                id=2,
                reminder_id=2,
                scheduled_time=now - timedelta(hours=4),
                taken_at=now - timedelta(hours=4),
                status="taken",
                notes="Hydration packet completed",
                created_at=now - timedelta(hours=4)
            )
            db.add_all([ml1, ml2])
            db.commit()

        # 8. Appointments
        if db.query(Appointment).count() == 0:
            logger.info("Seeding appointments...")
            app1 = Appointment(
                id=1,
                doctor_id=2,
                patient_id=1,
                user_id=1,
                appointment_date=now + timedelta(days=1),
                appointment_time="10:00 AM",
                appointment_type="consultation",
                reason="Follow-up (Dengue recovery)",
                status="scheduled",
                location="City Hospital, Room 205",
                preparation_instructions="Bring all latest CBC lab reports",
                created_at=now - timedelta(days=1)
            )
            app2 = Appointment(
                id=2,
                doctor_id=2,
                patient_id=1,
                user_id=1,
                appointment_date=now - timedelta(days=7),
                appointment_time="09:30 AM",
                appointment_type="consultation",
                reason="Started dengue treatment",
                status="completed",
                location="City Hospital, Room 205",
                created_at=now - timedelta(days=7)
            )
            db.add_all([app1, app2])
            db.commit()

        # 9. Symptoms
        if db.query(Symptom).count() == 0:
            logger.info("Seeding symptoms...")
            s1 = Symptom(
                id=1,
                patient_id=1,
                symptom_date=date.today() - timedelta(days=2),
                symptoms_json=["Fever", "Body Pain", "Headache"],
                symptoms_list=["Fever", "Body Pain", "Headache"],
                fever_temperature=101.8,
                pain_level="Moderate",
                energy_level="Low",
                notes="Fever spikes in evening",
                additional_notes="Fever spikes in evening",
                created_at=now - timedelta(days=2)
            )
            s2 = Symptom(
                id=2,
                patient_id=1,
                symptom_date=date.today() - timedelta(days=1),
                symptoms_json=["Mild Fever", "Fatigue"],
                symptoms_list=["Mild Fever", "Fatigue"],
                fever_temperature=100.5,
                pain_level="Mild",
                energy_level="Normal",
                notes="Fever coming down with Paracetamol",
                additional_notes="Fever coming down with Paracetamol",
                created_at=now - timedelta(days=1)
            )
            db.add_all([s1, s2])
            db.commit()

        # 10. Prescriptions & Prescribed Medicines
        if db.query(Prescription).count() == 0:
            logger.info("Seeding prescriptions & medicines...")
            rx = Prescription(
                id=1,
                doctor_id=2,
                patient_id=1,
                prescription_date=date.today() - timedelta(days=2),
                medicines_json=[
                    {"name": "Paracetamol 500mg", "dosage": "1 tablet every 6h", "timing": "After food"},
                    {"name": "ORS Sachet", "dosage": "1 sachet in 1L water", "timing": "Sip throughout day"}
                ],
                advice="Drink 3-4 liters fluids daily. Complete bed rest. Do NOT take Aspirin or Ibuprofen. Repeat CBC in 24 hours.",
                general_advice="Drink 3-4 liters fluids daily. Complete bed rest.",
                follow_up_date=str(date.today() + timedelta(days=1)),
                pdf_url="prescription_101.pdf",
                is_sent=True,
                created_at=now - timedelta(days=2)
            )
            db.add(rx)
            db.commit()

            med1 = Medicine(
                id=1,
                prescription_id=1,
                name="Paracetamol 500mg",
                generic_name="Paracetamol",
                dosage="1 tablet every 6 hours",
                frequency="Four times daily",
                timing="After food",
                duration="5 days",
                purpose="For fever and body pain",
                instructions="Take with water",
                start_date=date.today() - timedelta(days=2),
                end_date=date.today() + timedelta(days=3),
                is_active=True
            )
            med2 = Medicine(
                id=2,
                prescription_id=1,
                name="ORS Sachet",
                generic_name="Oral Rehydration Salts",
                dosage="1 sachet in 1L water",
                frequency="Continuous",
                timing="Sip throughout day",
                duration="7 days",
                purpose="To prevent dehydration",
                instructions="Mix in clean water",
                start_date=date.today() - timedelta(days=2),
                end_date=date.today() + timedelta(days=5),
                is_active=True
            )
            db.add_all([med1, med2])
            db.commit()

        # Synchronize DB file across backend and root workspace for DBeaver!
        sync_sqlite_db_files()
        logger.info("✅ Database seeding completed & synced successfully!")
    except Exception as e:
        db.rollback()
        logger.error(f"❌ Error during database seeding: {e}")
    finally:
        if should_close:
            db.close()

if __name__ == "__main__":
    seed_database()
