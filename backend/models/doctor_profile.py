from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    full_name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    license_number = Column(String, nullable=True)
    hospital = Column(String, nullable=True)
    experience_years = Column(Integer, default=0)
    consultation_fee = Column(Float, default=500.0)
    
    # Relationship
    user = relationship("User", back_populates="doctor_profile")
    
    def __repr__(self):
        return f"<DoctorProfile(id={self.id}, name={self.full_name}, specialization={self.specialization})>"
