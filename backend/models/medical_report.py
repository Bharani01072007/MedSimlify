from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .base import Base

class MedicalReport(Base):
    __tablename__ = "medical_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    report_type = Column(String, nullable=False)  # "lab_report", "prescription", etc.
    file_url = Column(String, nullable=False)  # S3 URL or local path
    file_name = Column(String, nullable=False)
    raw_text = Column(Text, nullable=True)  # Extracted text from OCR
    extracted_data = Column(JSON, nullable=True)  # Structured data from NER
    simplified_summary = Column(JSON, nullable=True)  # AI-simplified dictionary/text
    translated_summary = Column(Text, nullable=True)  # Regional language
    language = Column(String, default="en")  # "en", "hi", "ta", etc.
    vector_embeddings = Column(JSON, nullable=True)  # Stored dense vector embeddings for RAG retrieval
    is_flagged = Column(Boolean, default=False)  # Critical/abnormal results

    flagged_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = relationship("User", back_populates="medical_reports")
    patient = relationship("PatientProfile", back_populates="medical_reports")
    
    def __repr__(self):
        return f"<MedicalReport(id={self.id}, type={self.report_type}, date={self.created_at})>"
