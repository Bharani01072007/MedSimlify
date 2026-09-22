from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.db.database import get_db
from app.models.models import FamilyMember, PatientProfile, User

router = APIRouter(prefix="/family", tags=["Family Members"])

class FamilyMemberCreate(BaseModel):
    name: str
    relationship: str
    age: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None

@router.get("/")
def get_family_members(patient_id: int = 1, db: Session = Depends(get_db)):
    """Fetch family members for patient from database."""
    members = db.query(FamilyMember).filter(FamilyMember.patient_id == patient_id).all()
    res = []
    for m in members:
        age_str = f"{m.age}{m.gender[0]}" if (m.age and m.gender) else (str(m.age) if m.age else "—")
        res.append({
            "id": f"f{m.id}",
            "db_id": m.id,
            "name": m.name,
            "relation": m.relationship,
            "age": age_str,
            "gender": m.gender or "—",
            "blood_group": m.blood_group or "—",
            "reports": len(m.medical_reports) if m.medical_reports else 0
        })
    return res

@router.post("/")
def add_family_member(member_in: FamilyMemberCreate, patient_id: int = 1, db: Session = Depends(get_db)):
    """Add a new family member directly to database table."""
    try:
        patient = db.query(PatientProfile).filter(PatientProfile.id == patient_id).first()
        if not patient:
            user = db.query(User).first()
            user_id = user.id if user else 1
            patient = PatientProfile(id=patient_id, user_id=user_id, full_name="Default Patient", gender="Other")
            db.add(patient)
            try:
                db.commit()
                db.refresh(patient)
            except Exception:
                db.rollback()

        age_num = None
        gender_val = member_in.gender
        if member_in.age:
            digits = "".join(filter(str.isdigit, member_in.age))
            if digits:
                age_num = int(digits)
            if "F" in member_in.age.upper():
                gender_val = "Female"
            elif "M" in member_in.age.upper():
                gender_val = "Male"

        member = FamilyMember(
            patient_id=patient_id,
            name=member_in.name,
            relationship=member_in.relationship,
            age=age_num,
            gender=gender_val,
            blood_group=member_in.blood_group,
            medical_reports=[]
        )
        db.add(member)
        db.commit()
        db.refresh(member)
        
        age_str = f"{member.age}{member.gender[0]}" if (member.age and member.gender) else (str(member.age) if member.age else "—")
        return {
            "id": f"f{member.id}",
            "db_id": member.id,
            "name": member.name,
            "relation": member.relationship,
            "age": age_str,
            "reports": 0
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to add family member: {str(e)}")
