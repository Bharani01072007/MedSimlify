from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text, Date, Time
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .base import Base

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    appointment_date = Column(DateTime, nullable=True)
    appointment_time = Column(String, nullable=True, default="10:00 AM")
    appointment_type = Column(String, nullable=True, default="consultation")  # "consultation", "follow_up", "procedure"
    reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String, default="scheduled")  # "scheduled", "completed", "cancelled", "no_show"
    location = Column(String, nullable=True)  # "Room 205, City Hospital"
    preparation_instructions = Column(Text, nullable=True)
    check_in_time = Column(DateTime, nullable=True)
    consultation_start = Column(DateTime, nullable=True)
    consultation_end = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="appointments")
    
    def __repr__(self):
        return f"<Appointment(id={self.id}, date={self.appointment_date}, time={self.appointment_time})>"
