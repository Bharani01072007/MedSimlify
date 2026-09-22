from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class PatientProfile(Base):
    __tablename__ = "patient_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    full_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String, nullable=True)  # "Male", "Female", "Other"
    blood_group = Column(String, nullable=True)  # "A+", "B-", etc.
    address = Column(Text, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    pincode = Column(String, nullable=True)
    emergency_contact_name = Column(String, nullable=True)
    emergency_contact_phone = Column(String, nullable=True)
    emergency_contact_relationship = Column(String, nullable=True)
    allergies = Column(Text, nullable=True)  # JSON array or comma-separated
    chronic_conditions = Column(Text, nullable=True)  # JSON array
    medical_history = Column(Text, nullable=True)
    
    # Relationship
    user = relationship("User", back_populates="patient_profile")
    medical_reports = relationship("MedicalReport", back_populates="patient")
    family_members = relationship("FamilyMember", back_populates="patient")
    symptoms = relationship("Symptom", back_populates="patient")
    
    def __repr__(self):
        return f"<PatientProfile(id={self.id}, name={self.full_name})>"
