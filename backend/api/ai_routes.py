from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from services.ai_pipeline import ai_pipeline

router = APIRouter()

class ReportSimplifyRequest(BaseModel):
    raw_text: str

class TranslateRequest(BaseModel):
    summary_text: str
    target_lang: str

class ReportTranslateRequest(BaseModel):
    title: Optional[str] = ""
    eli5_summary: Optional[str] = ""
    recommendations: Optional[List[str]] = []
    warning_signs: Optional[List[str]] = []
    target_lang: str

class SOAPRequest(BaseModel):
    patient_name: str
    symptoms: Optional[str] = "Mild fatigue"
    lab_findings: Optional[str] = "Hb 11.2 g/dL"

class ChatRequest(BaseModel):
    question: str

@router.post("/simplify")
async def simplify_report_endpoint(req: ReportSimplifyRequest):
    """AI Medical Report Simplification & ELI5 Generator"""
    if not req.raw_text.strip():
        raise HTTPException(status_code=400, detail="Raw report text cannot be empty")
    return ai_pipeline.simplify_report(req.raw_text)

@router.post("/translate")
async def translate_endpoint(req: TranslateRequest):
    """Regional Language Translation (Hindi, Tamil, Spanish)"""
    translated = ai_pipeline.translate_summary(req.summary_text, req.target_lang)
    return {"target_lang": req.target_lang, "translated_text": translated}

@router.post("/translate_report")
async def translate_report_endpoint(req: ReportTranslateRequest):
    """Dynamically translates entire medical report content using AI Pipeline"""
    result = ai_pipeline.translate_report_content(
        title=req.title or "",
        eli5_summary=req.eli5_summary or "",
        recommendations=req.recommendations or [],
        warning_signs=req.warning_signs or [],
        target_lang=req.target_lang
    )
    return result

@router.post("/soap")
async def generate_soap_endpoint(req: SOAPRequest):
    """Doctor Clinical EMR SOAP Notes Generator"""
    soap_notes = ai_pipeline.generate_clinical_soap_notes(req.patient_name, req.symptoms, req.lab_findings)
    return {"patient_name": req.patient_name, "soap_notes": soap_notes}

@router.post("/chat")
async def ai_chat_endpoint(req: ChatRequest):
    """24/7 AI Health Assistant & Q&A Chat"""
    answer = ai_pipeline.answer_patient_query(req.question)
    return {"question": req.question, "answer": answer}
