from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Date, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .base import Base

class Prescription(Base):
    __tablename__ = "prescriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id"), nullable=False)
    prescription_date = Column(Date, default=lambda: datetime.now(timezone.utc).date(), nullable=True)
    medicines_json = Column(JSON, nullable=True)  # Array of medicine objects
    advice = Column(Text, nullable=True)
    general_advice = Column(Text, nullable=True)
    follow_up_date = Column(String, nullable=True)
    follow_up_time = Column(String, nullable=True)
    pdf_url = Column(String, nullable=True)  # Generated PDF
    is_sent = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    
    # Relationships
    doctor = relationship("User", foreign_keys=[doctor_id], back_populates="prescriptions")
    medicines = relationship("Medicine", back_populates="prescription", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Prescription(id={self.id}, date={self.prescription_date})>"

class Medicine(Base):
    __tablename__ = "medicines"
    
    id = Column(Integer, primary_key=True, index=True)
    prescription_id = Column(Integer, ForeignKey("prescriptions.id"), nullable=False)
    name = Column(String, nullable=False)  # "Paracetamol 500mg"
    generic_name = Column(String, nullable=True)  # "Paracetamol"
    dosage = Column(String, nullable=False)  # "1 tablet"
    frequency = Column(String, nullable=False)  # "every 6 hours"
    timing = Column(String, nullable=True)  # "after food"
    duration = Column(String, nullable=True)  # "5 days"
    purpose = Column(String, nullable=True)  # "for fever and pain"
    instructions = Column(String, nullable=True)  # "take with water"
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Relationship
    prescription = relationship("Prescription", back_populates="medicines")
    
    def __repr__(self):
        return f"<Medicine(id={self.id}, name={self.name})>"
