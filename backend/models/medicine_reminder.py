from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Time
from sqlalchemy.orm import relationship
from datetime import datetime, time, timezone
from .base import Base

class MedicineReminder(Base):
    __tablename__ = "medicine_reminders"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id"), nullable=False)
    medicine_name = Column(String, nullable=False)
    dosage = Column(String, nullable=False)
    reminder_time = Column(String, nullable=False)  # e.g., "21:00" or "08:00 AM"
    frequency = Column(String, nullable=False)  # "Daily", "once_daily", etc.
    timing = Column(String, nullable=True)  # "before food", "after food"
    timing_instruction = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    last_taken_at = Column(DateTime, nullable=True)
    start_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    logs = relationship("MedicineLog", back_populates="reminder", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<MedicineReminder(id={self.id}, medicine={self.medicine_name}, time={self.reminder_time})>"

class MedicineLog(Base):
    __tablename__ = "medicine_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    reminder_id = Column(Integer, ForeignKey("medicine_reminders.id"), nullable=False)
    scheduled_time = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=True)
    taken_at = Column(DateTime, nullable=True)
    status = Column(String, nullable=False)  # "taken", "skipped", "missed"
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationship
    reminder = relationship("MedicineReminder", back_populates="logs")
    
    def __repr__(self):
        return f"<MedicineLog(id={self.id}, status={self.status}, date={self.scheduled_time})>"
