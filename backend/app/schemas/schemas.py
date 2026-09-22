from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime, date, time
from enum import Enum

# --- Enums for Strict Validation ---
class PainLevelEnum(str, Enum):
    NONE = "None"
    MILD = "Mild"
    MODERATE = "Moderate"
    SEVERE = "Severe"

class EnergyLevelEnum(str, Enum):
    HIGH = "High"
    NORMAL = "Normal"
    LOW = "Low"
    VERY_LOW = "Very Low"

class UserRoleEnum(str, Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"
    ADMIN = "admin"

class MedicineFrequencyEnum(str, Enum):
    DAILY = "Daily"
    ONCE_DAILY = "Once Daily"
    TWICE_DAILY = "Twice Daily"
    THRICE_DAILY = "Thrice Daily"
    FOUR_TIMES_DAILY = "Four Times Daily"

class MedicineTimingEnum(str, Enum):
    BEFORE_FOOD = "Before food"
    AFTER_FOOD = "After food"
    WITH_FOOD = "With food"
    BETWEEN_MEALS = "Between meals"

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    phone: Optional[str] = None
    user_type: Optional[Union[UserRoleEnum, str]] = UserRoleEnum.PATIENT
    role: Optional[Union[UserRoleEnum, str]] = None
    name: Optional[str] = None
    full_name: Optional[str] = None

    def get_name(self) -> str:
        return self.name or self.full_name or self.email.split("@")[0]

    def get_user_type(self) -> str:
        val = self.role or self.user_type or "patient"
        return val.value if isinstance(val, Enum) else val


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str
    user_type: str
    name: str

# --- Report Schemas ---
class MedicalReportCreate(BaseModel):
    report_type: str = "lab_report"
    raw_text: Optional[str] = None

class MedicalReportResponse(BaseModel):
    id: int
    patient_id: int
    report_type: str
    file_name: Optional[str] = None
    file_url: Optional[str] = None
    raw_text: Optional[str] = None
    extracted_data: Optional[Dict[str, Any]] = None
    simplified_summary: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Dedicated Medicine Item Schema ---
class MedicineItem(BaseModel):
    name: str = Field(..., min_length=1, json_schema_extra={"example": "Paracetamol 650mg"})
    dosage: str = Field(..., json_schema_extra={"example": "650mg"})
    frequency: Optional[Union[MedicineFrequencyEnum, str]] = Field(MedicineFrequencyEnum.DAILY, json_schema_extra={"example": "TDS (Thrice daily)"})
    duration: Optional[str] = Field(None, json_schema_extra={"example": "5 days"})
    instructions: Optional[str] = Field(None, json_schema_extra={"example": "After food"})
    timing: Optional[Union[MedicineTimingEnum, str]] = Field(None, json_schema_extra={"example": "After food"})
    time: Optional[str] = Field(None, json_schema_extra={"example": "08:00 AM"})

# --- Medicine Reminder Schemas ---
class MedicineReminderBase(BaseModel):
    medicine_name: str = Field(..., min_length=1)
    dosage: str
    reminder_time: str
    frequency: Optional[Union[MedicineFrequencyEnum, str]] = MedicineFrequencyEnum.DAILY
    timing: Optional[Union[MedicineTimingEnum, str]] = MedicineTimingEnum.AFTER_FOOD


class MedicineReminderCreate(MedicineReminderBase):
    pass

class MedicineReminderResponse(MedicineReminderBase):
    id: int
    patient_id: int
    is_active: bool
    last_taken_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Symptom Schemas ---
class SymptomBase(BaseModel):
    symptoms_list: List[str]
    fever_temperature: Optional[float] = Field(None, ge=90.0, le=110.0, description="Body temperature in Fahrenheit")
    pain_level: Optional[Union[PainLevelEnum, str]] = PainLevelEnum.NONE
    energy_level: Optional[Union[EnergyLevelEnum, str]] = EnergyLevelEnum.NORMAL
    notes: Optional[str] = None

class SymptomCreate(SymptomBase):
    pass

class SymptomResponse(SymptomBase):
    id: int
    patient_id: int
    symptom_date: Optional[Union[date, datetime, str]] = None

    class Config:
        from_attributes = True

# --- Prescription Schemas ---
class PrescriptionBase(BaseModel):
    patient_id: int
    medicines: List[MedicineItem]
    advice: Optional[str] = None
    follow_up_date: Optional[Union[date, str]] = None

class PrescriptionCreate(PrescriptionBase):
    pass

class PrescriptionResponse(PrescriptionBase):
    id: int
    doctor_id: int
    prescription_date: Optional[Union[date, str]] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Chat & AI Assistant Schemas ---
class ChatMessageCreate(BaseModel):
    chat_id: Optional[int] = None
    doctor_id: Optional[int] = None
    message_text: str

class AIQuestion(BaseModel):
    question: str
    language: Optional[str] = "en"
    chat_id: Optional[int] = None
    doctor_id: Optional[int] = None
    patient_id: Optional[int] = 1
    report_ids: Optional[List[int]] = None

# Backward compatibility alias
ChatRequest = AIQuestion
