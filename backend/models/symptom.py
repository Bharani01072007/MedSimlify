from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON, Date
from sqlalchemy.orm import relationship
from datetime import datetime, timezone, date
from .base import Base

class Symptom(Base):
    __tablename__ = "symptoms"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id"), nullable=False)
    symptom_date = Column(Date, default=lambda: datetime.now(timezone.utc).date(), nullable=True, index=True)
    symptoms_json = Column(JSON, nullable=True)  # ["fever", "body_pain", "headache"]
    symptoms_list = Column(JSON, nullable=True)  # compatibility with schema
    fever_temperature = Column(Float, nullable=True)  # in Fahrenheit
    pain_level = Column(String, nullable=True)  # "none", "mild", "moderate", "severe"
    energy_level = Column(String, nullable=True)  # "high", "normal", "low", "very_low"
    additional_notes = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)  # compatibility with schema
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationship
    patient = relationship("PatientProfile", back_populates="symptoms")
    
    def __repr__(self):
        return f"<Symptom(id={self.id}, date={self.symptom_date})>"

