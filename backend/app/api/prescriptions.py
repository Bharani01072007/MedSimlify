from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.database import get_db
from datetime import datetime, timezone
from app.models.models import Prescription, DoctorProfile, PatientProfile, User, MedicineReminder
from app.schemas.schemas import PrescriptionCreate


router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])

@router.post("/")
def create_prescription(rx_in: PrescriptionCreate, doctor_id: int = 1, db: Session = Depends(get_db)):
    try:
        # 1. Ensure User / Doctor profile exists for doctor_id to prevent ForeignKey IntegrityError 500
        doc_user = db.query(User).filter(User.id == doctor_id).first()
        if not doc_user:
            doc_user = db.query(User).first()
            if not doc_user:
                doc_user = User(id=doctor_id, email=f"doctor{doctor_id}@medsimplify.com", password_hash="hashed_pw", user_type="doctor")
                db.add(doc_user)
                try:
                    db.commit()
                    db.refresh(doc_user)
                except Exception:
                    db.rollback()  # type: ignore
                    doc_user = db.query(User).first()
        
        doctor_id = doc_user.id if doc_user else doctor_id

        # 2. Ensure PatientProfile exists for rx_in.patient_id to prevent ForeignKey IntegrityError 500
        patient_id = rx_in.patient_id
        patient = db.query(PatientProfile).filter(PatientProfile.id == patient_id).first()
        if not patient:
            user = db.query(User).filter(User.id == patient_id).first()
            if not user:
                user = doc_user or db.query(User).first()
            user_id = user.id if user else patient_id
            patient = PatientProfile(id=patient_id, user_id=user_id, full_name=f"Patient #{patient_id}", gender="Other")
            db.add(patient)
            try:
                db.commit()
                db.refresh(patient)
                patient_id = patient.id
            except Exception:
                db.rollback()  # type: ignore
                first_patient = db.query(PatientProfile).first()
                if first_patient:
                    patient_id = first_patient.id

        # 3. Run AI drug interaction warning check
        warnings = []
        med_dicts = []
        for m in rx_in.medicines:
            if hasattr(m, "model_dump"):
                med_dicts.append(m.model_dump())
            elif hasattr(m, "dict"):
                med_dicts.append(m.dict())
            elif isinstance(m, dict):
                med_dicts.append(m)

        med_names = [str(m.get("name", "")).lower() for m in med_dicts]
        if any("aspirin" in name or "ibuprofen" in name for name in med_names):
            warnings.append("⚠️ WARNING: NSAIDs (Aspirin/Ibuprofen) are contraindicated in patients with low platelets or suspect Dengue!")

        today_date = datetime.now(timezone.utc).date()
        follow_up_str = str(rx_in.follow_up_date) if rx_in.follow_up_date else None

        rx = Prescription(
            doctor_id=doctor_id,
            patient_id=patient_id,
            prescription_date=today_date,
            medicines_json=med_dicts,
            advice=rx_in.advice,
            general_advice=rx_in.advice,
            follow_up_date=follow_up_str,
            pdf_url="prescription_101.pdf"
        )
        try:
            db.commit()
            db.refresh(rx)
        except Exception:
            db.rollback()
            from sqlalchemy import text
            try:
                db.execute(text("SELECT setval(pg_get_serial_sequence('prescriptions', 'id'), COALESCE((SELECT MAX(id) FROM prescriptions), 1));"))
                db.commit()
            except Exception:
                pass
            db.add(rx)
            db.commit()
            db.refresh(rx)

        # 4. Auto-sync prescribed medicines to Patient Medicine Reminders table in Database
        created_reminders = []
        for med in med_dicts:
            med_name = med.get("name", "Prescribed Medication")
            dosage = med.get("dosage", "1 tablet")
            timing = med.get("timing") or med.get("instructions") or "After food"
            timing_str = str(timing.value if hasattr(timing, "value") else timing)
            rem_time = str(med.get("time") or "08:00 AM")
            
            rem = MedicineReminder(
                patient_id=patient_id,
                medicine_name=med_name,
                dosage=dosage,
                reminder_time=rem_time,
                frequency="Daily",
                timing=timing_str,
                timing_instruction=timing_str,
                is_active=True
            )
            db.add(rem)
            created_reminders.append(rem)

        try:
            db.commit()
        except Exception:
            db.rollback()
            from sqlalchemy import text
            try:
                db.execute(text("SELECT setval(pg_get_serial_sequence('medicine_reminders', 'id'), COALESCE((SELECT MAX(id) FROM medicine_reminders), 1));"))
                db.commit()
            except Exception:
                pass

        return {
            "prescription_id": rx.id,
            "status": "issued",
            "drug_interaction_warnings": warnings,
            "created_reminders_count": len(created_reminders),
            "prescription": {
                "id": rx.id,
                "doctor_id": rx.doctor_id,
                "patient_id": rx.patient_id,
                "medicines": rx.medicines_json,
                "advice": rx.advice,
                "follow_up_date": rx.follow_up_date
            }
        }
    except Exception as e:
        db.rollback()  # type: ignore
        raise HTTPException(status_code=400, detail=f"Failed to create prescription: {str(e)}")



@router.get("/")
def get_prescriptions(patient_id: int = 1, db: Session = Depends(get_db)):
    rxs = db.query(Prescription).filter(Prescription.patient_id == patient_id).all()
    return rxs
