from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from app.db.database import get_db
from app.models.models import Appointment, DoctorProfile, PatientProfile, User

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.get("/")
def get_appointments(patient_id: int = 1, db: Session = Depends(get_db)):
    patient = db.query(PatientProfile).filter(PatientProfile.id == patient_id).first()
    if not patient:
        user = db.query(User).first()
        user_id = user.id if user else 1
        patient = PatientProfile(id=patient_id, user_id=user_id, full_name="Default Patient", gender="Other")
        db.add(patient)
        try:
            db.commit()
        except Exception:
            db.rollback()  # type: ignore

    user_id = patient.user_id if (patient and patient.user_id) else 1

    appointments = db.query(Appointment).filter(Appointment.patient_id == patient_id).all()
    if not appointments:
        demo_app = Appointment(
            patient_id=patient_id,
            doctor_id=1,
            user_id=user_id,
            appointment_date=datetime.now(timezone.utc) + timedelta(days=2),
            appointment_time="10:00 AM",
            appointment_type="consultation",
            status="scheduled",
            reason="Dengue Follow-up & Platelet Review"
        )
        db.add(demo_app)
        try:
            db.commit()
            db.refresh(demo_app)
            appointments = [demo_app]
        except Exception:
            db.rollback()  # type: ignore
            appointments = []
    return appointments

@router.post("/")
def schedule_appointment(doctor_id: int = 1, patient_id: int = 1, reason: str = "General Consultation", db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.id == doctor_id).first()
        if not user:
            user = db.query(User).first()
            if not user:
                user = User(id=1, email="doctor@medsimplify.com", password_hash="hashed_pw", user_type="doctor")
                db.add(user)
                try:
                    db.commit()
                    db.refresh(user)
                except Exception:
                    db.rollback()  # type: ignore
                    user = db.query(User).first()

        doc_user_id = user.id if user else 1

        patient = db.query(PatientProfile).filter(PatientProfile.id == patient_id).first()
        if not patient:
            patient = PatientProfile(id=patient_id, user_id=doc_user_id, full_name=f"Patient #{patient_id}", gender="Other")
            db.add(patient)
            try:
                db.commit()
                db.refresh(patient)
                patient_id = patient.id
            except Exception:
                db.rollback()  # type: ignore
                first_p = db.query(PatientProfile).first()
                if first_p:
                    patient_id = first_p.id

        user_id = patient.user_id if (patient and patient.user_id) else doc_user_id

        app_date = datetime.now(timezone.utc) + timedelta(days=1)
        appointment = Appointment(
            patient_id=patient_id,
            doctor_id=doc_user_id,
            user_id=user_id,
            appointment_date=app_date,
            appointment_time="10:00 AM",
            appointment_type="consultation",
            status="scheduled",
            reason=reason
        )
        db.add(appointment)
        db.commit()
        db.refresh(appointment)
        return {"message": "Appointment scheduled successfully", "appointment": appointment}
    except Exception as e:
        db.rollback()  # type: ignore
        raise HTTPException(status_code=400, detail=f"Failed to schedule appointment: {str(e)}")


# Global active telemed session state
active_telemed_session = {
    "is_active": False,
    "room_id": "",
    "doctor_name": "Dr. Sarah Jenkins",
    "patient_name": "Rajesh Kumar",
    "started_at": ""
}

@router.post("/telemed/invite")
def start_telemed_video_call(doctor_name: str = "Dr. Sarah Jenkins", patient_name: str = "Rajesh Kumar", room_id: Optional[str] = None):
    global active_telemed_session
    session_room = room_id or f"medsimplify-room-{datetime.now().strftime('%H%M%S')}"
    active_telemed_session = {
        "is_active": True,
        "room_id": session_room,
        "doctor_name": doctor_name,
        "patient_name": patient_name,
        "started_at": datetime.now().strftime("%I:%M %p")
    }
    return {
        "status": "call_initiated",
        "message": f"Telemedicine video call initiated with patient {patient_name}!",
        "session": active_telemed_session
    }

@router.get("/telemed/active-room")
def get_active_telemed_room():
    return active_telemed_session

@router.post("/telemed/end")
def end_telemed_video_call():
    global active_telemed_session
    active_telemed_session["is_active"] = False
    return {"status": "ended", "message": "Telemedicine call ended successfully."}
