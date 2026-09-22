# MEDSIMPLIFY
## AI-Powered Medical Report Simplification & Healthcare Assistant Platform

### A MINI PROJECT REPORT

**Submitted in partial fulfillment for the award of the degree of**  
**BACHELOR OF ENGINEERING IN COMPUTER SCIENCE AND ENGINEERING**

---

## BONAFIDE CERTIFICATE

Certified that this mini Project Report titled, **"MEDSIMPLIFY - AI-Powered Medical Report Simplification & Healthcare Assistant Platform"** is the bonafide record of the work carried out under our supervision. Certified further, that to the best of my knowledge the work reported herein does not form part of any other mini project report or dissertation on the basis of which a degree or award was conferred on an earlier occasion on this or any other candidate.

**PROJECT GUIDE**  
Assistant Professor,  
Department of Computer Science & Engineering  

**HEAD OF THE DEPARTMENT**  
Professor & Head,  
Department of Computer Science & Engineering  

---

## ABSTRACT

**MedSimplify** is an intelligent, AI-powered medical report simplification and digital healthcare assistant platform designed to transform complex, jargon-heavy clinical laboratory reports into clear, plain-language summaries. Patients frequently receive diagnostic reports (such as Complete Blood Counts, Dengue Profiles, Liver Function Tests, Lipid Panels, and Diabetes Profiles) containing intricate medical terminology and numerical reference ranges that are difficult to comprehend without clinical training. This knowledge barrier causes patient anxiety, delayed medical intervention, and misinterpretation of critical health markers.

MedSimplify solves this challenge by providing a unified, cross-platform web application that allows patients and healthcare providers to upload medical documents in PDF, DOCX, PNG, JPG, or text formats. The system leverages PyMuPDF, OpenCV, and PyTesseract for multi-modal Optical Character Recognition (OCR) and document text extraction. The extracted raw clinical text is processed through a custom, zero-hallucination Medical Natural Language Processing (NLP) and Named Entity Recognition (NER) pipeline. The pipeline dynamically parses health metrics, numerical test values, reference intervals, and clinical status flags (Normal, Low, High, Critical).

It generates two distinct layers of explanation: a **Standard Medical Summary** for detailed review and an **Explain Like I'm 5 (ELI5)** super-simple analogy-based explanation. Additionally, MedSimplify features multi-language regional translation (supporting Hindi, Tamil, Telugu, Spanish, French, and German), an automated Clinical EMR SOAP (Subjective, Objective, Assessment, Plan) Notes Generator for doctors, a 24/7 AI Health & Nutrition Assistant Chat, interactive biomarker trend tracking, medication adherence reminders, and telemedicine consultation booking.

The frontend is built using **React**, **TypeScript**, **TSX**, **Vite**, and **TailwindCSS/CSS**, providing a responsive, phone-frame desktop dashboard interface. The backend is engineered using **Python**, **FastAPI**, **SQLAlchemy**, and **Uvicorn**, backed by a hosted **Supabase PostgreSQL** database. MedSimplify bridges the communication gap between patients and healthcare professionals, fostering informed health management and faster clinical decision-making.

---

## TABLE OF CONTENTS

| Chapter No. | Title | Page No. |
| :--- | :--- | :---: |
| | **ABSTRACT** | iii |
| | **LIST OF TABLES** | xi |
| | **LIST OF FIGURES** | xii |
| | **LIST OF SYMBOLS AND ABBREVIATIONS** | xiii |
| **1.** | **INTRODUCTION** | **1** |
| | 1.1 Background | 1 |
| | 1.2 Project Overview | 1 |
| | 1.3 Motivation | 1 |
| | 1.4 Objectives | 1 |
| | 1.5 Scope | 2 |
| **2.** | **PROBLEM IDENTIFICATION** | **4** |
| | 2.1 Existing Scenario | 4 |
| | 2.2 Existing System | 4 |
| | 2.3 Existing System Drawbacks | 4 |
| | 2.4 Problem Statement | 4 |
| | 2.5 Proposed Solution | 5 |
| **3.** | **EMPATHIZE AND DEFINE** | **6** |
| | 3.1 Empathy Study | 6 |
| | 3.2 User Identification | 6 |
| | 3.3 Primary Users | 6 |
| | 3.4 Secondary Users | 6 |
| | 3.5 User Needs | 6 |
| | 3.6 Pain Points | 7 |
| | 3.7 User Persona | 8 |
| | 3.8 User Expectations | 8 |
| | 3.9 Refined Problem Definition | 8 |
| **4.** | **IDEATION** | **9** |
| | 4.1 Idea Generation | 9 |
| | 4.2 Brainstorming | 9 |
| | 4.3 Evaluation of Ideas | 9 |
| | 4.4 Selected Idea | 10 |
| | 4.5 Key Features Identified | 10 |
| | 4.6 Final Concept | 10 |
| **5.** | **REQUIREMENTS ANALYSIS** | **11** |
| | 5.1 Introduction | 11 |
| | 5.2 Functional Requirements | 11 |
| | 5.3 Non-Functional Requirements | 12 |
| | 5.4 Hardware Requirements | 14 |
| | 5.5 Software Requirements | 14 |
| | 5.6 User Roles and Permissions | 16 |
| | 5.7 System Constraints | 17 |
| | 5.8 Requirement Summary | 17 |
| **6.** | **TECHNOLOGY STACK** | **18** |
| | 6.1 Introduction | 18 |
| | 6.2 Frontend Technologies | 19 |
| | 6.3 Backend Technologies | 20 |
| | 6.4 Database Technology | 20 |
| | 6.5 Artificial Intelligence & OCR Stack | 20 |
| | 6.6 Technology Integration | 21 |
| | 6.7 Technology Selection | 21 |
| **7.** | **SYSTEM DESIGN** | **22** |
| | 7.1 System Architecture | 22 |
| | 7.2 Working Flow | 25 |
| | 7.3 System Components | 27 |
| | 7.4 Data Flow Diagram (DFD) | 29 |
| | 7.5 Use Case Diagram | 30 |
| **8.** | **DATABASE DESIGN** | **31** |
| | 8.1 Introduction | 31 |
| | 8.2 Database Objectives | 31 |
| | 8.3 Main Database Entities | 31 |
| | 8.4 User Table | 32 |
| | 8.5 MedicalReport Table | 32 |
| | 8.6 PatientProfile Table | 32 |
| | 8.7 DoctorProfile Table | 33 |
| | 8.8 Database Relationships (ERD) | 33 |
| | 8.9 Database Security & Summary | 34 |
| **9.** | **MODULE DESCRIPTION** | **35** |
| | 9.1 Introduction | 35 |
| | 9.2 Module Breakdown (N1–N10) | 35 |
| | 9.3 Authentication Module | 36 |
| | 9.4 Document OCR Module | 37 |
| | 9.5 Medical NER & Entity Extractor Module | 38 |
| | 9.6 Plain-English & ELI5 Simplification Module | 38 |
| | 9.7 Regional Multi-Language Translation Module | 39 |
| | 9.8 Clinical EMR SOAP Notes Generator | 40 |
| | 9.9 Medicine Reminders & Adherence Module | 41 |
| | 9.10 Telemedicine & Assistant Chat Module | 42 |
| **10.**| **IMPLEMENTATION AND WORKING PRINCIPLE** | **45** |
| | 10.1 Introduction | 45 |
| | 10.2 Frontend Implementation | 45 |
| | 10.3 Backend & Database Implementation | 46 |
| | 10.4 Document Processing Workflow | 47 |
| | 10.5 AI Pipeline & Dynamic Parsing Workflow | 48 |
| | 10.6 Complete System Working Principle | 51 |
| **11.**| **TESTING** | **56** |
| | 11.1 Introduction & Objectives | 56 |
| | 11.2 Types of Testing | 56 |
| | 11.3 Functional Test Cases | 57 |
| | 11.4 Performance & Security Testing | 58 |
| | 11.5 Conclusion of Testing | 58 |
| **12.**| **PROJECT EVALUATION** | **59** |
| | 12.1 Objective Evaluation | 59 |
| | 12.2 Usability, Performance & Security Evaluation | 60 |
| | 12.3 Advantages & Limitations | 61 |
| **13.**| **CONCLUSION AND FUTURE ENHANCEMENTS** | **62** |
| | 13.1 Conclusion | 62 |
| | 13.2 Future Enhancements | 63 |
| **14.**| **APPENDIX I - RESULTS AND SCREENSHOTS** | **65** |
| **15.**| **APPENDIX II - CORE FUNCTIONALITY CODE** | **82** |
| **16.**| **REFERENCES** | **90** |

---

## LIST OF TABLES

- **Table 2.1**: Comparison of Traditional Medical Reporting vs. MedSimplify Platform (Page 5)
- **Table 3.1**: User Pain Points and Proposed Technical Solutions (Page 7)
- **Table 5.1**: Functional Requirements of MedSimplify (Page 12)
- **Table 5.2**: Non-Functional Requirements of MedSimplify (Page 13)
- **Table 5.3**: Supported Diagnostic Report Types and Key Biomarkers (Page 15)
- **Table 5.4**: Severity & Urgency Priority Flagging Rules (Page 16)
- **Table 5.5**: User Roles and Access Permissions (Page 17)
- **Table 6.1**: Technology Stack Summary used in MedSimplify (Page 18)
- **Table 8.1**: `users` Database Schema (Page 32)
- **Table 8.2**: `medical_reports` Database Schema (Page 32)
- **Table 8.3**: `patient_profiles` Database Schema (Page 32)
- **Table 8.4**: `doctor_profiles` Database Schema (Page 33)
- **Table 9.1**: MedSimplify N1–N10 Core System Modules (Page 35)
- **Table 11.1**: Comprehensive Functional Test Cases (Page 57)
- **Table 12.1**: Project Objective Evaluation Summary (Page 59)

---

## LIST OF FIGURES

- **Figure 1.1**: Overview Architecture of MedSimplify Platform (Page 2)
- **Figure 7.1**: High-Level System Architecture Diagram (Page 23)
- **Figure 7.2**: Detailed Microservices & Data Flow Architecture (Page 24)
- **Figure 7.3**: End-to-End Report Analysis Workflow (Page 26)
- **Figure 7.4**: Level-1 Data Flow Diagram (DFD) (Page 29)
- **Figure 7.5**: System Use Case Diagram (Page 30)
- **Figure 8.1**: Entity Relationship Diagram (ERD) (Page 34)
- **Figure 10.1**: Multi-Stage Document OCR & AI Pipeline Execution Flow (Page 54)
- **Figure 14.1**: User Authentication & Login Screen (Page 67)
- **Figure 14.2**: Patient Mobile Dashboard Screen (Page 68)
- **Figure 14.3**: Medical Report File Upload Screen (Page 69)
- **Figure 14.4**: AI Document Processing & Analyzing Screen (Page 71)
- **Figure 14.5**: Analysis Complete Results & Plain-Language Summary Screen (Page 72)
- **Figure 14.6**: Explain Like I'm 5 (ELI5) Super-Simple Explanation Mode (Page 73)
- **Figure 14.7**: Doctor EMR SOAP Notes Generator & Roster Screen (Page 74)

---

## LIST OF SYMBOLS AND ABBREVIATIONS

- **AI**: Artificial Intelligence
- **API**: Application Programming Interface
- **AST / ALT**: Aspartate Aminotransferase / Alanine Aminotransferase (Liver Enzymes)
- **CBC**: Complete Blood Count
- **CORS**: Cross-Origin Resource Sharing
- **DFD**: Data Flow Diagram
- **ELI5**: Explain Like I'm 5
- **EMR**: Electronic Medical Record
- **ERD**: Entity Relationship Diagram
- **FastAPI**: Fast Python Web Framework
- **HbA1c**: Glycated Hemoglobin (Diabetes Marker)
- **IgE**: Immunoglobulin E (Allergy Antibody)
- **JWT**: JSON Web Token
- **LFT**: Liver Function Test
- **LLM**: Large Language Model
- **NER**: Named Entity Recognition
- **NLP**: Natural Language Processing
- **NS1**: Non-Structural Protein 1 (Dengue Antigen)
- **OCR**: Optical Character Recognition
- **PLT**: Platelets / Thrombocytes
- **REST**: Representational State Transfer
- **SOAP**: Subjective, Objective, Assessment, Plan (Clinical Note Format)
- **SSR**: Server-Side Rendering
- **STT / TTS**: Speech-to-Text / Text-to-Speech
- **UI / UX**: User Interface / User Experience
- **WBC**: White Blood Cell / Leukocyte Count

---

# CHAPTER 1: INTRODUCTION

### 1.1 Background
In modern healthcare diagnostics, clinical laboratory reports serve as the fundamental basis for medical diagnosis, treatment evaluation, and disease monitoring. However, standard diagnostic reports produced by pathology laboratories contain complex medical terminology, Latin abbreviations, non-standard measurement units, and tight numerical reference intervals. Studies reveal that over 80% of non-clinical patients struggle to correctly interpret their own diagnostic results. 

When patients receive alarming metrics (such as a low platelet count of 80,000 /uL or an elevated HbA1c of 8.2%), the lack of immediate, understandable context often leads to panic, misdirected online searches, or delayed follow-up care. Conversely, minor physiological variations may trigger unnecessary emergency visits. The absence of an intelligent, patient-centric platform to translate medical diagnostic data into plain, accessible language creates a significant barrier to effective healthcare communication.

### 1.2 Project Overview
**MedSimplify** is an advanced AI-powered medical report simplification and digital healthcare assistant platform. Designed as a seamless full-stack web application, MedSimplify enables users to upload diagnostic reports in multiple digital formats (PDF, DOCX, PNG, JPG, and raw text). The platform processes documents through an integrated multi-tier Optical Character Recognition (OCR) engine (PyMuPDF, OpenCV, PyTesseract) and a zero-hallucination Medical NLP/NER pipeline.

MedSimplify extracts structured health parameters, compares values against standardized clinical reference intervals, and computes risk flags. It generates both a structured **Standard Medical Summary** and an **Explain Like I'm 5 (ELI5)** simplified explanation using everyday analogies. Beyond report translation, MedSimplify provides a comprehensive patient care suite including multi-language regional translation (Hindi, Tamil, Telugu, Spanish, French, German), a Clinical EMR SOAP Notes Generator for physicians, medicine adherence tracking, biomarker trend visualization, and 24/7 AI health assistant chat.

### 1.3 Motivation
The primary motivation behind MedSimplify is health literacy and patient empowerment. Patients deserve to understand their health diagnostic data immediately without feeling overwhelmed by technical jargon. By leveraging modern Web development tools (React, TypeScript, Vite, FastAPI) and artificial intelligence, MedSimplify aims to democratize medical knowledge, reduce patient anxiety, improve doctor-patient communication, and streamline clinical documentation for medical practitioners.

### 1.4 Objectives
The core objectives of MedSimplify are:
1. **Multi-Format Document Ingestion**: To support seamless upload and text extraction from PDF, DOCX, PNG, JPG, and raw text diagnostic documents.
2. **Zero-Hallucination NER Extraction**: To dynamically parse medical entities (parameters, test names, numerical values, units, and reference ranges) strictly from raw text without fabricating metrics.
3. **Dual-Layer Simplification**: To generate a professional plain-English summary alongside an analogy-driven ELI5 explanation.
4. **Automated Risk & Priority Flagging**: To classify findings into clear visual severity tiers (Normal, Low, High, Critical).
5. **Multi-Lingual Regional Accessibility**: To translate clinical summaries into regional Indian languages (Hindi, Tamil, Telugu) and global languages (Spanish, French, German).
6. **Clinical EMR SOAP Notes**: To automatically convert unstructured patient findings into structured clinical SOAP notes for medical professionals.
7. **Comprehensive Care Integration**: To provide medicine adherence reminders, symptom tracking, interactive biomarker trend charts, and 24/7 AI chat support.

### 1.5 Scope
The functional scope of MedSimplify spans patient document ingestion, multi-modal OCR, AI-driven entity parsing, plain-language simplification, multi-language translation, clinical SOAP generation, database persistence on Supabase PostgreSQL, and an intuitive responsive user interface.

---

# CHAPTER 2: PROBLEM IDENTIFICATION

### 2.1 Existing Scenario
Currently, when a patient undergoes blood tests or diagnostic imaging, reports are delivered via physical paper or digital PDF. Patients must either wait days for a doctor's consultation or attempt to search complex medical terms online, often encountering alarming or inaccurate information.

### 2.2 Existing System & Drawbacks
Existing healthcare portals primarily act as passive document repositories (storing raw PDFs) without intelligent interpretation features. 
Key drawbacks of existing systems include:
- **No Automated Explanation**: Raw PDFs display raw numerical data without plain-language context.
- **High Jargon & Patient Anxiety**: Clinical terminology causes unnecessary stress.
- **Language Barrier**: Diagnostics are printed exclusively in English, excluding regional language speakers.
- **Manual Doctor Note Entry**: Physicians spend valuable time manually writing SOAP notes from scratch.
- **Fragmented Health Tools**: Reminders, symptom tracking, and report storage exist in disconnected apps.

### 2.3 Proposed Solution & Feature Comparison

MedSimplify offers a centralized, AI-driven solution uniting document intelligence with digital patient management.

#### Table 2.1: Comparison of Traditional Reporting vs. MedSimplify
| Feature | Traditional Lab Portals | MedSimplify Platform |
| :--- | :--- | :--- |
| **Report Ingestion** | View/Download Raw PDF | Upload PDF, Image, DOCX, Text |
| **Data Interpretation** | None (Raw Numbers Only) | Automated AI Parameter Extraction |
| **Plain-Language Summary** | Not Available | Dual Mode (Standard + ELI5 Analogy) |
| **Multi-Language Support** | English Only | Hindi, Tamil, Telugu, Spanish, etc. |
| **Biomarker Risk Triage** | Hard-to-read lab flags | Visual Tiers (Normal, Low, High, Critical) |
| **Doctor EMR SOAP Notes** | Manual Typing | Instant AI SOAP Notes Generation |
| **Medication Reminders** | Separate App Required | Integrated Adherence Tracker |
| **Database Synchronization**| Local/Disparate Files | Real-time Supabase PostgreSQL |

---

# CHAPTER 3: EMPATHIZE AND DEFINE

### 3.1 Empathy Study & User Identification
Through user interviews with chronic disease patients, elderly individuals, and general practitioners, two distinct user groups were identified:
- **Primary Users (Patients & Families)**: Seek clear, fast, jargon-free explanations of test results without technical complexity.
- **Secondary Users (Doctors & Healthcare Providers)**: Require structured summaries, rapid entity verification, and automated EMR SOAP note formatting to save consultation time.

### 3.2 Pain Points & Proposed Solutions

#### Table 3.1: User Pain Points and MedSimplify Solutions
| S.No | User Pain Point | Proposed MedSimplify Solution |
| :---: | :--- | :--- |
| 1 | Inability to understand medical terms (e.g., Thrombocytopenia, HbA1c) | Plain-English and ELI5 analogy summarization engine |
| 2 | Language barriers for non-English speaking family members | Contextual regional translation (Hindi, Tamil, Telugu, etc.) |
| 3 | Misplacing historical diagnostic reports | Hosted Supabase PostgreSQL centralized report repository |
| 4 | Forgetting prescribed medication timings | Integrated Medicine Reminder and Adherence logger |
| 5 | Excessive time spent by doctors drafting clinical EMR notes | Instant AI SOAP Notes Generator (Subjective, Objective, Assessment, Plan) |

---

# CHAPTER 4: IDEATION & CONCEPT FORMULATION

### 4.1 Selected Idea & Final Concept
The selected architecture for **MedSimplify** combines multi-format file ingestion, PyMuPDF/Tesseract OCR, custom regular-expression and NLP-based entity parsing, and a lightweight React SPA frontend backed by FastAPI REST endpoints.

Key features implemented include:
- **Multi-Format Upload**: Native handling of `.pdf`, `.docx`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.txt`.
- **Fast OCR Engine**: PyMuPDF stream parsing with high-resolution 150 DPI single-page pixmap fallback for scanned images.
- **Zero-Hallucination Parser**: Strict regular expression and entity map extraction for CBC, Dengue NS1, Liver Function (ALT, AST, Bilirubin), Lipid Panels, Diabetes (HbA1c, Glucose), and Kidney metrics.
- **Dual Summarization**: Standard medical overview + ELI5 kid-friendly explanation.

---

# CHAPTER 5: REQUIREMENTS ANALYSIS

### 5.1 Functional Requirements

#### Table 5.1: Functional Requirements of MedSimplify
| S.No | Requirement | Description |
| :---: | :--- | :--- |
| 1 | **User Auth** | Email/Password login and profile creation for Patients and Doctors. |
| 2 | **Document Upload** | Multi-file dropzone accepting PDF, DOCX, images, and raw text. |
| 3 | **OCR & Parsing** | Automatic text extraction and structured biomarker parsing. |
| 4 | **Simplification** | Generation of Standard Summary and ELI5 analogy explanations. |
| 5 | **Translation** | One-click regional translation into Hindi, Tamil, Telugu, Spanish, etc. |
| 6 | **EMR SOAP Notes** | Automatic conversion of lab findings into clinical SOAP documentation. |
| 7 | **Medicine Reminders**| Schedule dosage, frequency, and log adherence ("taken" / "missed"). |
| 8 | **Biomarker Trends** | Historical trend charts for key metrics (Platelets, Hb, Glucose). |
| 9 | **24/7 AI Chat** | Interactive health assistant answering nutrition and wellness queries. |

### 5.2 Non-Functional Requirements

#### Table 5.2: Non-Functional Requirements
| Requirement | Specification |
| :--- | :--- |
| **Performance** | Report parsing and summary generation completed in `< 3.5 seconds`. |
| **Security** | BCrypt password hashing, JWT bearer token authorization, PostgreSQL RLS. |
| **Reliability** | Zero-hallucination entity extraction; fallback to structured mock templates. |
| **Usability** | Responsive PhoneFrame UI design with high-contrast typography and clear icons. |
| **Availability** | Hosted on Supabase Cloud PostgreSQL with 99.9% uptime. |

### 5.3 Hardware & Software Specifications
- **Hardware**: Computer/Laptop, Minimum 4 GB RAM, 10 GB Storage, Internet Connection.
- **Software**: Windows/Linux/macOS, Node.js (v18+), Python (v3.10+), VS Code, Chrome/Edge Browser.
- **Frontend Stack**: React 18, TypeScript, TSX, Vite, TailwindCSS, Lucide Icons, TanStack Router.
- **Backend Stack**: Python, FastAPI, Uvicorn, SQLAlchemy, PyMuPDF (fitz), PyTesseract, OpenCV, PIL.
- **Database**: Hosted Supabase PostgreSQL.

---

# CHAPTER 6: TECHNOLOGY STACK

#### Table 6.1: Technology Stack Summary
| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TSX | Reusable UI components & state management |
| **Language & Tooling** | TypeScript + Vite | Type safety and fast HMR development server |
| **Styling & UI** | TailwindCSS + Vanilla CSS | Responsive design, glassmorphism, mobile frame |
| **Routing & State** | TanStack Router | Client-side routing with head meta management |
| **Backend Framework** | Python + FastAPI | High-performance async REST API framework |
| **ASGI Server** | Uvicorn | Async server implementation for FastAPI |
| **Database ORM** | SQLAlchemy | Python SQL ORM with sequence auto-sync |
| **Database Engine** | Supabase PostgreSQL | Relational storage for reports, users, medicines |
| **PDF Parsing** | PyMuPDF (fitz) | Lightning-fast PDF text & pixmap OCR extraction |
| **Image OCR** | PyTesseract + OpenCV | Multi-pass image binarization & character recognition |
| **NLP Pipeline** | BART-large-CNN + Regex | Contextual summarization and entity extraction |

---

# CHAPTER 7: SYSTEM DESIGN & ARCHITECTURE

### 7.1 System Architecture
MedSimplify follows a decoupled client-server microservices architecture. The React SPA frontend communicates with the FastAPI backend over secure JSON/Multipart RESTful APIs.

```
+-----------------------------------------------------------------------+
|                         CLIENT / USER INTERFACE                       |
|         React + TypeScript + Vite SPA (PhoneFrame Mobile UI)          |
+-----------------------------------------------------------------------+
                                    |
                                    | REST API (HTTP / JSON / Multipart)
                                    v
+-----------------------------------------------------------------------+
|                           FASTAPI BACKEND SERVICE                     |
|  - Auth Router (/api/auth)          - Report Router (/api/reports)    |
|  - Medicine Router (/api/medicines)  - AI Router (/api/ai)            |
+-----------------------------------------------------------------------+
                |                                       |
                v                                       v
+-------------------------------+       +-------------------------------+
|    AI & DOCUMENT OCR ENGINE   |       |  SUPABASE POSTGRESQL DATABASE |
|  - PyMuPDF (fitz)             |       |  - users                      |
|  - PyTesseract & OpenCV       |       |  - medical_reports            |
|  - Dynamic NER Entity Parser  |       |  - patient_profiles           |
|  - BART Summarizer & Transl.  |       |  - doctor_profiles            |
+-------------------------------+       +-------------------------------+
```

### 7.2 Working Flow
1. **User Authentication**: Patient or Doctor logs into the application using secure JWT credentials.
2. **Document Selection**: User uploads a diagnostic report (PDF, DOCX, PNG, JPG) via the dropzone.
3. **Text Extraction**: PyMuPDF extracts text streams; if scanned, OpenCV/PyTesseract OCR processes page pixmaps.
4. **Entity Parsing & Flagging**: The NER engine parses test parameters, values, and reference ranges, computing risk flags (Normal, Low, High, Critical).
5. **Summarization & Translation**: Standard summary, ELI5 explanation, and multi-language translations are generated.
6. **Database Persistence**: Parsed results are saved to Supabase PostgreSQL `medical_reports` table.
7. **Results Display**: The frontend renders interactive cards, important findings, next steps, and full report tables.

---

# CHAPTER 8: DATABASE DESIGN

### 8.1 Database Schemas

#### Table 8.1: `users` Table
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Auto-increment | Unique User Identifier |
| `email` | String(255) | Unique, Not Null | Account Login Email |
| `password_hash` | String(255) | Not Null | BCrypt Encrypted Password |
| `user_type` | String(50) | Not Null | Role ("patient" or "doctor") |
| `created_at` | Timestamp | Default NOW() | Account Creation Time |

#### Table 8.2: `medical_reports` Table
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Auto-increment | Unique Report Identifier |
| `patient_id` | Integer | Foreign Key (`patient_profiles.id`) | Associated Patient ID |
| `user_id` | Integer | Foreign Key (`users.id`) | Owner User ID |
| `report_type` | String(100) | Not Null | Type (e.g. "lab_report", "x_ray") |
| `file_name` | String(255) | Not Null | Original Upload Filename |
| `raw_text` | Text | Nullable | Extracted Plain OCR Text |
| `extracted_data` | JSON | Nullable | Parsed Entities & Patient Info |
| `simplified_summary`| JSON | Nullable | Standard & ELI5 Summaries |
| `is_flagged` | Boolean | Default False | High Risk Critical Flag |
| `created_at` | Timestamp | Default NOW() | Record Creation Timestamp |

---

# CHAPTER 9: MODULE DESCRIPTION

#### Table 9.1: MedSimplify N1–N10 Module Breakdown
| Module | Name | Functionality |
| :---: | :--- | :--- |
| **N1** | User Authentication | Handles registration, JWT login, and role-based routing. |
| **N2** | Document OCR Engine | Extracts text from PDF, DOCX, PNG, JPG, and TXT files. |
| **N3** | Medical NER Parser | Extracts parameters, test values, units, and reference ranges. |
| **N4** | Plain-English Summary | Generates clinical summaries and ELI5 analogy explanations. |
| **N5** | Severity Flagging | Triage findings into Normal, Low, High, and Critical alerts. |
| **N6** | Regional Translation | Translates clinical summaries into Hindi, Tamil, Telugu, etc. |
| **N7** | EMR SOAP Notes | Converts findings into structured Doctor SOAP clinical notes. |
| **N8** | Medicine Reminders | Schedules drug dosage, timing, and logs daily adherence. |
| **N9** | Biomarker Trends | Computes historical biomarker progression over time. |
| **N10**| AI Assistant Chat | 24/7 intelligent health and nutrition Q&A assistant. |

---

# CHAPTER 10: IMPLEMENTATION & WORKING PRINCIPLE

### 10.1 Key Code Logic
MedSimplify incorporates defensive backend database sequence synchronization and OCR processing:

```python
# PostgreSQL Primary Key Sequence Auto-Resync snippet (config/database.py)
def sync_db_sequences(db: Session):
    if "postgresql" in str(db.bind.url):
        tables = ["users", "patient_profiles", "doctor_profiles", "medical_reports", "medicines"]
        for tbl in tables:
            try:
                db.execute(text(f"SELECT setval(pg_get_serial_sequence('{tbl}', 'id'), COALESCE((SELECT MAX(id) FROM {tbl}), 1));"))
                db.commit()
            except Exception as e:
                db.rollback()
```

---

# CHAPTER 11: TESTING AND VERIFICATION

#### Table 11.1: Functional Test Cases
| Test ID | Feature | Test Input | Expected Result | Pass/Fail |
| :---: | :--- | :--- | :--- | :---: |
| **TC01** | User Login | Valid Credentials | JWT Token generated; redirect to `/home` | **PASS** |
| **TC02** | PDF Upload | `SRL DIAGNOSTICS.pdf` | Text extracted; LFT parameters parsed | **PASS** |
| **TC03** | Image OCR | `dengue_report.png` | PyTesseract OCR parses Dengue NS1 & Platelets | **PASS** |
| **TC04** | ELI5 Toggle | Click "ELI5 Mode" | Renders super-simple car/filter analogy text | **PASS** |
| **TC05** | Translation | Select "Tamil" | Translates summary accurately into Tamil text | **PASS** |
| **TC06** | EMR SOAP | Doctor Portal View | Generates Subjective, Objective, Assessment, Plan | **PASS** |

---

# CHAPTER 12: PROJECT EVALUATION

### 12.1 Key Advantages
1. **Zero Jargon Confusion**: Dual-layer explanations make health data accessible to everyone.
2. **Multi-Format Versatility**: Native support for PDF, DOCX, PNG, JPG, and raw text.
3. **Clinical Efficiency**: Saves doctor consultation time with automated EMR SOAP generation.
4. **Persistent Supabase Storage**: Live PostgreSQL synchronization with sequence auto-recovery.

### 12.2 Limitations & Future Scope
- **Current Limitations**: OCR accuracy depends on image resolution and lighting.
- **Future Scope**: Integration with wearable IoT health monitors, DICOM medical image visualization, and voice-assisted complaint booking.

---

# CHAPTER 13: CONCLUSION

MedSimplify successfully demonstrates how modern web development frameworks (**React**, **TypeScript**, **Vite**, **FastAPI**) and artificial intelligence can be combined to solve real-world healthcare accessibility challenges. By automating document OCR, structured entity parsing, plain-language summarization, and multi-lingual translation, MedSimplify bridges the communication gap between patients and healthcare providers, creating a safer, more informed digital health ecosystem.

---

# CHAPTER 14: REFERENCES

1. T. BeniSteena et al., *"Optimizing Image Fusion Using Wavelet Transform,"* IEEE ICACITE, 2022.
2. M. Fernandez & Y. Li, *"Multilingual Voice-to-Text Processing in Healthcare Systems,"* IEEE Transactions on Human-Machine Systems, vol. 54, 2024.
3. D. N. Latha et al., *"AI-Based Diagnostic Information Extraction and Monitoring,"* Research Digest on Engineering Management, 2026.
4. R. Singh et al., *"AI-Based Smart Electronic Health Record Management System,"* IEEE ICDICI, 2025.
5. FastAPI Documentation, *"Asynchronous Web APIs in Python,"* https://fastapi.tiangolo.com/, 2026.
6. React & TanStack Documentation, *"Modern Single Page Application Architecture,"* https://react.dev/, 2026.

---
*End of MedSimplify Mini Project Report Document.*
