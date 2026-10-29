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

class TTSRequest(BaseModel):
    text: str
    lang: Optional[str] = "en"

async def generate_tts_audio_bytes(text: str, lang: str = "en") -> bytes:
    """Generates authentic native MP3 audio stream for Tamil, Hindi, Telugu, Spanish, Tanglish, and English."""
    import httpx
    import re
    # Remove emojis, markdown formatting, symbols while preserving native language characters
    clean = re.sub(r'[^\w\s\.,;:!\?\-\'\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F]', ' ', text)
    clean = re.sub(r'\s+', ' ', clean).strip()
    if not clean:
        clean = "MedSimplify Medical Report Summary"

    lang_map = {
        "ta": "ta", "tamil": "ta",
        "hi": "hi", "hindi": "hi",
        "te": "te", "telugu": "te",
        "es": "es", "spanish": "es",
        "tanglish": "en-in",
        "en": "en", "english": "en"
    }
    tl = lang_map.get(lang.lower().strip(), "en")

    sentences = re.split(r'([.?!,;।\n])', clean)
    chunks = []
    curr = ""
    for s in sentences:
        if len(curr) + len(s) < 170:
            curr += s
        else:
            if curr.strip():
                chunks.append(curr.strip())
            curr = s
    if curr.strip():
        chunks.append(curr.strip())

    audio_bytes = bytearray()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    async with httpx.AsyncClient(timeout=8.0) as client:
        for chunk in chunks[:12]:
            if not chunk or len(chunk.strip()) < 2:
                continue
            try:
                resp = await client.get(
                    "https://translate.google.com/translate_tts",
                    params={"ie": "UTF-8", "tl": tl, "client": "tw-ob", "q": chunk},
                    headers=headers
                )
                if resp.status_code == 200:
                    audio_bytes.extend(resp.content)
            except Exception:
                pass

    return bytes(audio_bytes)

@router.get("/tts")
async def tts_get_endpoint(text: str = "MedSimplify", lang: str = "en"):
    """Text-to-speech audio streaming in authentic native languages (Tamil, Hindi, Telugu, Spanish, English)"""
    from fastapi.responses import Response
    audio_data = await generate_tts_audio_bytes(text, lang)
    if not audio_data:
        raise HTTPException(status_code=500, detail="Could not generate TTS audio")
    return Response(
        content=audio_data,
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": "inline; filename=speech.mp3",
            "Cache-Control": "public, max-age=86400"
        }
    )

@router.post("/tts")
async def tts_post_endpoint(req: TTSRequest):
    """Text-to-speech audio streaming endpoint for long report contents"""
    from fastapi.responses import Response
    audio_data = await generate_tts_audio_bytes(req.text, req.lang or "en")
    if not audio_data:
        raise HTTPException(status_code=500, detail="Could not generate TTS audio")
    return Response(
        content=audio_data,
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": "inline; filename=speech.mp3",
            "Cache-Control": "public, max-age=86400"
        }
    )


