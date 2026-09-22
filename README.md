# MedSimplify - AI-Powered Medical Report Simplification App

MedSimplify is a complete, medical-grade mobile and backend application that uses AI pipelines to simplify complex medical lab reports (CBC, Dengue profiles, radiology reports, prescriptions, discharge summaries) into patient-friendly language in English and regional Indian languages (Hindi, Tamil, Telugu).

---

## 🌟 Architecture Overview

- **Frontend**: React Native (TypeScript) with Expo, Redux Toolkit, React Navigation v6, React Native Paper, Charts, custom Medical Design System (`#2563EB`, `#10B981`, `#F59E0B`).
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy ORM, PostgreSQL (with SQLite fallback for local development), Pydantic schemas, JWT security.
- **AI Pipeline**: Multi-stage OCR -> Document Classifier -> Clinical NER -> Text Simplification & Term Dictionary -> Regional Translation (Hindi/Tamil/Telugu) -> Formatted Summary Builder.
- **Deployment**: Docker, Docker Compose, PostgreSQL 14, Redis.

---

## 📱 Features

### Patient App (18 Screens)
1. **Splash Screen**: Animated logo and auto-redirect.
2. **Login / Signup**: Role toggle (Patient/Doctor) with email & OTP options.
3. **Home Dashboard**: Patient greeting, medicine progress bar, quick action grid, recent report card, AI assistant banner.
4. **Upload Medical Report**: Report type selector (Lab/Rx/Discharge/X-Ray), upload options (Camera/Gallery/PDF), and photo quality guidelines.
5. **Analysis Loading Screen**: Animated multi-step AI pipeline progress ("Extracting text...", "Analyzing findings...", "Simplifying medical terms...").
6. **Report Analysis Results**: Color-coded Important Findings, What To Do (Action Checklist), Warning Signs, 1-tap emergency/reminder shortcuts, expandable test table.
7. **Report History / Timeline**: Search, filter chips (All/Lab/Rx/Discharge), monthly timeline, abnormal highlights.
8. **Report Comparison & Trends**: Side-by-side comparison tables, platelet trend graphs, AI insights.
9. **Medicines List**: Active/Completed tabs, dosing progress, toggle active/inactive, log taken CTA.
10. **Add Medicine**: Prescription OCR upload or manual entry form with dose suggestions.
11. **Symptom Tracker**: Daily mood emoji, symptom checkboxes, temperature input, pain/energy scale.
12. **Symptom Trends**: Fever line chart, AI recovery estimate, share with doctor.
13. **Appointments**: Upcoming doctor visits, room number, preparation tips, navigate/call CTAs.
14. **Chat with Doctor**: Real-time messaging, doctor online status, emergency warning banner.
15. **AI Health Assistant**: Conversational health Q&A, dietary advice for Dengue/low platelets, disclaimers.
16. **Emergency Information**: Prominent ICE Card, 108/112 1-tap emergency calling, warning signs guide.
17. **Profile & Settings**: Account management, language selector (English/Hindi/Tamil/Telugu), family profile link.
18. **Family Members**: Family profile switcher, member cards, relationship badges.

### Doctor App (6 Screens)
1. **Doctor Splash & Login**: Dedicated practitioner entrance.
2. **Doctor Dashboard**: Key clinical metrics (12 today's patients, 5 pending reports, earnings), patient queue.
3. **Patient Directory**: Searchable roster with condition alerts.
4. **Patient Profile (Doctor View)**: Patient metadata, report history, active prescriptions, clinical progress notes.
5. **Digital Prescription Builder**: Medicine search, AI drug interaction checker (warns against NSAIDs in low-platelet Dengue), dose suggestions, digital signature send.
6. **Clinic Analytics**: Practice revenue growth, top diagnoses breakdown, patient demographics.

---

## 🚀 Running Locally

### Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
```
Backend API will be live at `http://localhost:8000/docs` (Swagger UI).

### Frontend Setup (React Native Expo)
```bash
cd frontend
npm install
npm start
```
Run `npm run web` to preview immediately in browser.

### Docker Compose Run
```bash
docker-compose up --build
```
