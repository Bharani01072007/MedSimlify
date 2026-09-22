from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.db.database import get_db, sync_sqlite_db_files
from app.models.models import Chat, Message, User, PatientProfile
from app.schemas.schemas import AIQuestion

router = APIRouter(prefix="/chat", tags=["Chat & AI Assistant"])

# Active telemedicine session state
_telemed_session = {
    "is_active": False,
    "room_id": "",
    "jitsi_url": "",
    "doctor_name": "Dr. Priya Sharma",
    "patient_name": "Rajesh Kumar",
    "started_at": "",
}

from app.services.ai.rag_service import rag_assistant

# ── AI Ask ──────────────────────────────────────────────────────────────────

@router.post("/ai/ask")
def ask_ai_health_assistant(query: AIQuestion, db: Session = Depends(get_db)):
    """
    AI Health Assistant Endpoint with RAG (Retrieval-Augmented Generation) capability.
    - If `report_ids` are provided: retrieves lab report context from DB and answers anchored to selected reports.
    - If no `report_ids` provided: answers directly as a general medical AI assistant.
    """
    return rag_assistant.answer_question(
        query=query.question,
        report_ids=query.report_ids,
        db=db,
        language=query.language or "en"
    )



# ── Chat Messages (SQLAlchemy Local System Time Persisted) ─────────────────

@router.get("/messages")
def get_messages(chat_id: int = 1, since_id: int = 0, db: Session = Depends(get_db)):
    """Return all messages for a chat thread from DB formatted in local time."""
    messages = db.query(Message).filter(Message.chat_id == chat_id, Message.id > since_id).order_by(Message.sent_at.asc()).all()
    res = []
    for m in messages:
        sender_role = "doctor" if m.sender_id == 2 else "patient"
        sender_name = "Dr. Priya Sharma" if sender_role == "doctor" else "Rajesh Kumar"
        res.append({
            "id": m.id,
            "chat_id": m.chat_id,
            "sender": sender_role,
            "sender_name": sender_name,
            "message": m.message_text,
            "time": m.sent_at.strftime("%I:%M %p") if m.sent_at else "Just now",
            "timestamp": m.sent_at.isoformat() if m.sent_at else ""
        })
    return res


from pydantic import BaseModel
from fastapi import Query

class SendMessageRequest(BaseModel):
    message: Optional[str] = None
    message_text: Optional[str] = None
    sender: Optional[str] = "patient"
    sender_name: Optional[str] = "Rajesh Kumar"
    chat_id: Optional[int] = 1

@router.post("/messages")
def send_message(
    payload: Optional[SendMessageRequest] = None,
    message: Optional[str] = Query(None),
    sender: Optional[str] = Query(None),
    sender_name: Optional[str] = Query(None),
    chat_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Send a new message to the chat thread using local system timestamp and persist in DB."""
    from sqlalchemy import text

    msg_text = ""
    msg_sender = "patient"
    msg_sender_name = "Rajesh Kumar"
    msg_chat_id = 1

    if payload:
        msg_text = payload.message or payload.message_text or ""
        msg_sender = payload.sender or "patient"
        msg_sender_name = payload.sender_name or "Rajesh Kumar"
        msg_chat_id = payload.chat_id or 1

    if not msg_text and message:
        msg_text = message
    if sender:
        msg_sender = sender
    if sender_name:
        msg_sender_name = sender_name
    if chat_id:
        msg_chat_id = chat_id

    chat_id = msg_chat_id
    sender = msg_sender
    sender_name = msg_sender_name
    message = msg_text

    # Ensure chat exists
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        chat = Chat(id=chat_id, doctor_id=2, patient_id=1, is_active=True)
        db.add(chat)
        try:
            db.commit()
            db.refresh(chat)
        except Exception:
            db.rollback()

    sender_id = 2 if sender == "doctor" else 1
    now = datetime.now()

    try:
        msg = Message(
            chat_id=chat_id,
            sender_id=sender_id,
            message_text=message,
            message_type="text",
            sent_at=now
        )
        db.add(msg)
        if chat:
            chat.last_message_at = now
        db.commit()
        db.refresh(msg)
    except Exception as e:
        db.rollback()
        # Handle PostgreSQL primary key sequence mismatch automatically
        try:
            db.execute(text("SELECT setval(pg_get_serial_sequence('messages', 'id'), COALESCE((SELECT MAX(id) FROM messages), 1));"))
            db.commit()
        except Exception:
            pass
        
        msg = Message(
            chat_id=chat_id,
            sender_id=sender_id,
            message_text=message,
            message_type="text",
            sent_at=now
        )
        db.add(msg)
        if chat:
            chat.last_message_at = now
        db.commit()
        db.refresh(msg)
    
    sync_sqlite_db_files()

    return {
        "status": "sent",
        "id": msg.id,
        "chat_id": msg.chat_id,
        "sender": sender,
        "sender_name": sender_name,
        "message": msg.message_text,
        "time": now.strftime("%I:%M %p"),
        "timestamp": now.isoformat()
    }


@router.get("/messages/all")
def get_all_messages(chat_id: int = 1, db: Session = Depends(get_db)):
    """Return all messages for doctor/patient view from DB formatted in local time."""
    messages = db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.sent_at.asc()).all()
    res = []
    for m in messages:
        sender_role = "doctor" if m.sender_id == 2 else "patient"
        sender_name = "Dr. Priya Sharma" if sender_role == "doctor" else "Rajesh Kumar"
        res.append({
            "id": m.id,
            "chat_id": m.chat_id,
            "sender": sender_role,
            "sender_name": sender_name,
            "message": m.message_text,
            "time": m.sent_at.strftime("%I:%M %p") if m.sent_at else "Just now",
            "timestamp": m.sent_at.isoformat() if m.sent_at else ""
        })
    return res


@router.get("/threads")
def get_doctor_chat_threads(db: Session = Depends(get_db)):
    """
    Return all patient chat threads for doctor view with latest message, unread status, and patient info.
    """
    patients_seed = [
        {"id": 1, "chat_id": 1, "name": "Rajesh Kumar", "age": "34M", "condition": "Dengue Recovery", "status": "online"},
        {"id": 2, "chat_id": 2, "name": "Savitri Kumar", "age": "64F", "condition": "Hypertension & HbA1c", "status": "offline"},
        {"id": 3, "chat_id": 3, "name": "Priya Kumar", "age": "32F", "condition": "Iron Deficiency Anemia", "status": "online"},
        {"id": 4, "chat_id": 4, "name": "Rohan Kumar", "age": "8M", "condition": "Pediatric Allergy", "status": "offline"},
        {"id": 5, "chat_id": 5, "name": "Ananya Roy", "age": "28F", "condition": "Thyroid Follow-up", "status": "online"},
    ]

    threads = []
    for p in patients_seed:
        last_msg = db.query(Message).filter(Message.chat_id == p["chat_id"]).order_by(Message.sent_at.desc()).first()
        patient_msgs_count = db.query(Message).filter(Message.chat_id == p["chat_id"], Message.sender_id == 1).count()

        threads.append({
            "id": p["id"],
            "chat_id": p["chat_id"],
            "patient_name": p["name"],
            "age_gender": p["age"],
            "condition": p["condition"],
            "status": p["status"],
            "unread_count": 1 if p["chat_id"] == 1 and last_msg and last_msg.sender_id == 1 else (1 if p["chat_id"] in [2, 3] else 0),
            "last_message": last_msg.message_text if last_msg else ("Dengue platelet follow-up questions" if p["chat_id"] == 1 else "Sharing latest lab test summary"),
            "last_time": last_msg.sent_at.strftime("%I:%M %p") if last_msg and last_msg.sent_at else "10:30 AM",
        })

    return threads


# ── Video / Telemedicine ──────────────────────────────────────────────────

@router.post("/telemed/start")
def start_video_call(
    doctor_name: str = "Dr. Priya Sharma",
    patient_name: str = "Rajesh Kumar",
    db: Session = Depends(get_db)
):
    """Create a Jitsi Meet room and write notification message to database."""
    global _telemed_session
    now = datetime.now()
    room_id = f"medsimplify-{patient_name.replace(' ', '-').lower()}-{now.strftime('%H%M%S')}"
    jitsi_url = f"https://meet.jit.si/{room_id}"
    _telemed_session = {
        "is_active": True,
        "room_id": room_id,
        "jitsi_url": jitsi_url,
        "doctor_name": doctor_name,
        "patient_name": patient_name,
        "started_at": now.strftime("%I:%M %p"),
    }
    
    # Save video call invite message into Database
    msg = Message(
        chat_id=1,
        sender_id=2, # Doctor
        message_text=f"📹 Video consultation started! Join here: {jitsi_url}",
        message_type="file",
        file_url=jitsi_url,
        sent_at=now
    )
    db.add(msg)
    try:
        db.commit()
        sync_sqlite_db_files()
    except Exception:
        db.rollback()

    return _telemed_session


@router.get("/telemed/active")
def get_active_session():
    """Returns the current telemedicine session (for patient to check and join)."""
    return _telemed_session


@router.post("/telemed/end")
def end_video_call():
    global _telemed_session
    _telemed_session["is_active"] = False
    return {"status": "ended", "message": "Video consultation ended."}
