from sqlalchemy import Column, Integer, String, Date, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship as rel
from datetime import datetime, timezone
from .base import Base

class FamilyMember(Base):
    __tablename__ = "family_members"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id"), nullable=False)
    name = Column(String, nullable=False)
    relationship = Column(String, nullable=False)  # "father", "mother", "spouse", "child"
    date_of_birth = Column(Date, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
    medical_reports = Column(JSON, nullable=True)  # Array of report IDs
    created_at = Column(DateTime, nullable=True, default=lambda: datetime.now(timezone.utc))
    
    # Relationship
    patient = rel("PatientProfile", back_populates="family_members")
    
    def __repr__(self):
        return f"<FamilyMember(id={self.id}, name={self.name}, relation={self.relationship})>"
