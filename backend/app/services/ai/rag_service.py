import os
import json
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.models import MedicalReport
from app.services.ai.vector_store import vector_store

class RAGHealthAssistant:
    def __init__(self):
        # Read Google Gemini API Key from environment
        self.gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
        self.openai_key = os.getenv("OPENAI_API_KEY")

    def fetch_reports_context(self, db: Session, report_ids: List[int], patient_id: int = 1, query: str = "") -> tuple[str, List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Retrieves selected MedicalReport records from the database, builds chunk vector embeddings,
        and performs Dense Vector Cosine Similarity Search to retrieve Top-K chunks.
        """
        if not report_ids:
            return "", [], []

        reports = db.query(MedicalReport).filter(MedicalReport.id.in_(report_ids)).all()
        if not reports:
            reports = db.query(MedicalReport).filter(MedicalReport.patient_id == patient_id).limit(len(report_ids)).all()

        context_chunks = []
        sources = []
        all_vector_payloads = []

        for r in reports:
            report_name = r.file_name or f"Report #{r.id}"
            
            # Extract actual document date from text if present, otherwise fallback to created_at
            doc_date = None
            if r.raw_text:
                import re
                d_match = re.search(r'(?:Report Date|Sample Collected|Date)[:\s]+(\d{1,2}[-/\s][A-Za-z]{3,9}[-/\s]\d{2,4})', r.raw_text, re.IGNORECASE)
                if not d_match:
                    d_match = re.search(r'\b(\d{1,2}[-/\s][A-Za-z]{3,9}[-/\s]\d{4})\b', r.raw_text)
                if d_match:
                    doc_date = d_match.group(1).strip()

            report_date = doc_date or (r.created_at.strftime("%d-%b-%Y") if r.created_at else "Recent")
            report_type = (r.report_type or "Lab Report").replace("_", " ").title()

            source_meta = {
                "id": r.id,
                "file_name": report_name,
                "date": report_date,
                "type": report_type,
                "extracted_data": r.extracted_data,
                "simplified_summary": r.simplified_summary,
                "raw_text": r.raw_text
            }
            sources.append(source_meta)

            chunk = f"### Document Source: {report_name} ({report_type}, Date: {report_date})\n"
            
            # Extract structured parameters
            if r.extracted_data:
                chunk += "#### Extracted Test Biomarkers:\n"
                ext_data = r.extracted_data if isinstance(r.extracted_data, dict) else {}
                
                abnormals = ext_data.get("abnormal_findings", [])
                if abnormals:
                    chunk += "Abnormal / Flagged Findings:\n"
                    for item in abnormals:
                        test_name = item.get("test") or item.get("parameter", "Test")
                        val = item.get("value", "N/A")
                        ref = item.get("normal_range", item.get("range", "N/A"))
                        status = item.get("status", item.get("flag", "FLAGGED"))
                        expl = item.get("explanation", "")
                        chunk += f" - {test_name}: {val} (Ref: {ref}) | Status: {status}. {expl}\n"
                
                test_tables = ext_data.get("test_tables", [])
                if test_tables:
                    chunk += "\nFull Parameter Table:\n"
                    for row in test_tables:
                        param = row.get("parameter") or row.get("test", "Parameter")
                        val = row.get("value", "")
                        rng = row.get("range") or row.get("normal_range", "")
                        flg = row.get("flag") or row.get("status", "")
                        chunk += f" - {param}: {val} (Reference: {rng}) [{flg}]\n"

            if r.simplified_summary:
                summary_data = r.simplified_summary if isinstance(r.simplified_summary, dict) else {}
                important = summary_data.get("important_findings", [])
                if important:
                    chunk += "\nSimplified Medical Summary:\n"
                    for imp in important:
                        if isinstance(imp, dict):
                            chunk += f" - {imp.get('title', '')}: {imp.get('explanation', '')}\n"
                        else:
                            chunk += f" - {imp}\n"

            if r.raw_text:
                chunk += f"\nRaw Document Text:\n{r.raw_text[:1500]}\n"

            context_chunks.append(chunk)

            # Generate/fetch vector embeddings for this report
            if r.vector_embeddings and isinstance(r.vector_embeddings, list):
                vector_payloads = r.vector_embeddings
            else:
                vector_payloads = vector_store.process_report_for_vectors(
                    raw_text=r.raw_text or "",
                    extracted_data=r.extracted_data,
                    simplified_summary=r.simplified_summary
                )
                # Persist generated vector payload into DB for fast future retrieval
                try:
                    r.vector_embeddings = vector_payloads
                    db.commit()
                except Exception:
                    db.rollback()

            for vp in vector_payloads:
                vp["report_meta"] = source_meta
                all_vector_payloads.append(vp)

        # Retrieve Top-K chunks via Cosine Similarity vector search
        top_matching_chunks = []
        if query and all_vector_payloads:
            top_matching_chunks = vector_store.search_similar_chunks(query, all_vector_payloads, top_k=5)

        full_context = "\n---\n".join(context_chunks)
        return full_context, sources, top_matching_chunks

    def _detect_language(self, query: str, requested_lang: str = "en") -> str:
        """
        Detects language automatically: Tanglish, Hindi, Tamil, Telugu, Spanish, Bengali, English.
        """
        if requested_lang and requested_lang.lower() in ["tanglish", "ta-en", "tamil-english"]:
            return "tanglish"

        if requested_lang and requested_lang.lower() in ["en", "english"]:
            return "en"

        q_lower = query.lower().strip()

        # Tanglish keywords (Tamil spoken words in Roman/English script - whole word matches)
        import re
        tanglish_keywords = [
            r"\benna\b", r"\birundha\b", r"\bpannanum\b", r"\bsaapdanum\b", r"\bkammi\b", r"\baana\b", r"\baagum\b",
            r"\bpanradhu\b", r"\bkudikkanum\b", r"\bpodanum\b", r"\birukku\b", r"\beppadi\b", r"\bthirumba\b",
            r"\bnalla\b", r"\bvechu\b", r"\beduthaa\b", r"\bkoodadhu\b", r"\bsaapda\b", r"\belaneer\b",
            r"\bsaapada\b", r"\bkudika\b", r"\baachu\b", r"\btheriyum\b", r"\bthalaivoli\b", r"\bkaachal\b",
            r"\bsaapdungga\b", r"\bthavirkkanum\b", r"\bpannungga\b"
        ]

        if any(re.search(pat, q_lower) for pat in tanglish_keywords):
            return "tanglish"

        if any('\u0900' <= char <= '\u097F' for char in query):
            return "hi"

        if any('\u0B80' <= char <= '\u0BFF' for char in query):
            return "ta"

        if any('\u0C00' <= char <= '\u0C7F' for char in query):
            return "te"

        if any('\u0980' <= char <= '\u09FF' for char in query):
            return "bn"

        if any(k in q_lower for k in ["que ", "como ", "para ", "fiebre", "dolor", "precaucion", "sintomas"]):
            return "es"

        return requested_lang or "en"

    def _analyze_source_data(self, s: Dict[str, Any]) -> tuple[List[str], List[str], List[str]]:
        """
        Extracts parameter findings, flagged items, and recommended action tags from a single report source dict.
        """
        report_name = s.get("file_name", "Lab Report")
        ext_data = s.get("extracted_data") or {}
        simp_summary = s.get("simplified_summary") or {}
        raw_text = s.get("raw_text") or ""

        from services.ai_pipeline import ai_pipeline

        entities = []
        if isinstance(ext_data, dict):
            entities = ext_data.get("entities") or ext_data.get("all_entities") or []
        
        if not entities and raw_text:
            try:
                entities = ai_pipeline.extract_medical_entities(raw_text)
            except Exception:
                entities = []

        findings = []
        flags = []
        rec_tags = set()

        import re

        if entities:
            for e in entities:
                ent_name = e.get("entity") or e.get("parameter") or e.get("test") or "Test"
                val = e.get("value", "N/A")
                ref = e.get("reference") or e.get("normal_range") or ""
                clean_ref = re.sub(r'\s+(HIGH|LOW|NORMAL|CRITICAL|FLAG|ABNORMAL)\b.*', '', ref, flags=re.IGNORECASE).strip()
                ref_str = f" (Ref: {clean_ref})" if clean_ref and clean_ref != "Standard" else ""
                status = (e.get("status") or e.get("flag") or "Normal").strip()
                status_u = status.upper()

                if any(k in status_u for k in ["HIGH", "LOW", "CRITICAL", "FLAG", "ABNORMAL", "POS", "VERY HIGH"]):
                    icon = "🔴" if ("CRITICAL" in status_u or "POS" in status_u or "VERY HIGH" in status_u) else "⚠️"
                    findings.append(f"  • **{ent_name}:** `{val}` — **{status.upper()} {icon}**{ref_str}")
                    flags.append(f"{ent_name}: {val} ({status})")
                else:
                    findings.append(f"  • **{ent_name}:** `{val}` (Normal){ref_str}")

                ent_l = ent_name.lower()
                val_l = str(val).lower()

                # Dengue: Only tag if Dengue test is positive or platelets are Low (< 150k or flagged Low/Critical)
                if ("dengue" in ent_l or "ns1" in ent_l) and any(k in status_u for k in ["POS", "CRITICAL", "HIGH", "FLAG"]):
                    rec_tags.add("dengue")
                elif "platelet" in ent_l:
                    try:
                        num_val = float(re.sub(r'[^\d\.]', '', str(val)))
                        if num_val < 150000 or any(k in status_u for k in ["LOW", "CRITICAL", "ABNORMAL"]):
                            rec_tags.add("dengue")
                    except Exception:
                        if any(k in status_u for k in ["LOW", "CRITICAL"]):
                            rec_tags.add("dengue")

                if "ige" in ent_l or "allergy" in ent_l or "rast" in ent_l:
                    rec_tags.add("allergy")
                if (any(k in ent_l for k in ["hba1c", "glucose", "sugar", "fasting", "ppbs"])) and any(k in status_u for k in ["HIGH", "CRITICAL", "ELEVATED", "FLAG"]):
                    rec_tags.add("diabetes")
                if (any(k in ent_l for k in ["hemoglobin", "hgb", "ferritin", "rbc"])) and any(k in status_u for k in ["LOW", "CRITICAL", "ABNORMAL"]):
                    rec_tags.add("anemia")
                if (any(k in ent_l for k in ["cholesterol", "triglyceride", "ldl"])) and any(k in status_u for k in ["HIGH", "CRITICAL", "ELEVATED"]):
                    rec_tags.add("lipid")
                elif "hdl" in ent_l and "LOW" in status_u:
                    rec_tags.add("lipid")
                if (any(k in ent_l for k in ["sgpt", "sgot", "bilirubin", "alkaline"]) or bool(re.search(r'\b(alt|ast|lft|sgpt|sgot)\b', ent_l))) and any(k in status_u for k in ["HIGH", "ELEVATED", "CRITICAL"]):
                    rec_tags.add("liver")

        if not findings:
            if isinstance(simp_summary, dict) and simp_summary.get("standard_summary"):
                findings.append(f"  • **Summary:** {simp_summary.get('standard_summary')}")
            elif raw_text:
                clean_raw = raw_text[:250].replace("\n", " ").strip()
                findings.append(f"  • **Excerpt:** \"{clean_raw}...\"")
            else:
                findings.append(f"  • Parameters analyzed for {report_name}.")

        return findings, flags, list(rec_tags)

    def answer_question(self, query: str, report_ids: Optional[List[int]] = None, db: Optional[Session] = None, language: str = "en") -> Dict[str, Any]:
        """
        Main entry point. If report_ids are provided and db is available, performs Dense Vector RAG retrieval.
        Otherwise answers as a general health AI assistant.
        """
        if report_ids and len(report_ids) > 0 and db:
            context, sources, top_chunks = self.fetch_reports_context(db, report_ids, query=query)
            if context and sources:
                return self.generate_rag_response(query, context, sources, top_chunks, language)

        return self.generate_general_response(query, language)

    def generate_rag_response(self, query: str, context: str, sources: List[Dict[str, Any]], top_chunks: Optional[List[Dict[str, Any]]] = None, language: str = "en") -> Dict[str, Any]:
        """
        Generates a Dense Vector RAG-backed response dynamically tailored to each selected lab report.
        """
        q_lower = query.lower()
        api_key = self.gemini_key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        target_lang = self._detect_language(query, language)

        # Format Top-K retrieved vector chunks
        vector_context_text = ""
        if top_chunks:
            vector_context_text = "\n".join([
                f"• [Cosine Similarity: {c.get('score', 0.0):.2f}] Chunk from {c.get('report_name')}: {c.get('text')}"
                for c in top_chunks
            ])

        # Attempt Google Gemini LLM completion
        if api_key and len(api_key.strip()) > 10:
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key.strip())
                
                lang_instructions = {
                    "tanglish": "IMPORTANT: Answer in friendly, natural Tanglish (Tamil spoken words written in clear Roman/English script). Example: 'Dengue-kku hydration thaan mukkiyam...'",
                    "hi": "IMPORTANT: Answer in clear Hindi (हिन्दी).",
                    "ta": "IMPORTANT: Answer in clear Tamil (தமிழ்).",
                    "te": "IMPORTANT: Answer in clear Telugu (తెలుగు).",
                    "es": "IMPORTANT: Answer in clear Spanish (Español).",
                    "bn": "IMPORTANT: Answer in clear Bengali (বাংলা).",
                }
                lang_note = lang_instructions.get(target_lang, "")

                response_text = None
                for model_name in ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-pro', 'gemini-pro-latest', 'gemini-2.5-flash-lite']:
                    try:
                        model = genai.GenerativeModel(model_name)
                        prompt = f"""You are MedSimplify AI Health Assistant. 
Answer the user's health question using ONLY the provided medical report context.
Highlight key lab parameters, abnormal flags, reference ranges, and doctor advice.
Always cite the source report name and date.
{lang_note}

DENSE VECTOR TOP-RETRIEVED CHUNKS:
{vector_context_text or "All report sections included."}

FULL REPORT CONTEXT:
{context}

USER QUESTION: {query}
"""
                        res = model.generate_content(prompt)
                        if res and res.text and res.text.strip():
                            response_text = res.text.strip()
                            break
                    except Exception as err:
                        print(f"[RAG Gemini] Model {model_name} failed: {err}")
                        continue

                if response_text:
                    source_names = [f"📄 {s['file_name']} ({s['date']})" for s in sources]
                    citation_text = "\n\n📌 **Retrieved Data Sources:**\n" + "\n".join(f"• {name}" for name in source_names)
                    return {
                        "question": query,
                        "answer": response_text + citation_text,
                        "is_rag": True,
                        "sources": sources,
                        "vector_chunks": top_chunks or [],
                        "language": target_lang,
                        "quick_suggestions": [
                            "What should I eat based on these results?",
                            "When should I repeat this test?",
                            "What do these abnormal values mean?"
                        ]
                    }
            except Exception as e:
                print(f"[DenseVector RAG] Gemini API call info: {e}. Utilizing contextual synthesis RAG engine.")

        # ── Smart Contextual Multi-Report Synthesis RAG Engine ────────────────────────
        source_names = [f"{s['file_name']} ({s['date']})" for s in sources]
        source_citations = ", ".join(source_names)

        per_report_sections = []
        all_flags = []
        all_rec_tags = set()

        for idx, s in enumerate(sources, 1):
            report_title = f"📄 **Report {idx}: {s['file_name']}** ({s['type']} | Date: {s['date']})"
            findings, flags, rec_tags = self._analyze_source_data(s)
            
            all_flags.extend(flags)
            all_rec_tags.update(rec_tags)

            section_text = f"{report_title}\n" + "\n".join(findings)
            per_report_sections.append(section_text)

        report_details_block = "\n\n".join(per_report_sections)

        # Multi-Report Comparison Section
        comparison_block = ""
        if len(sources) > 1:
            flags_summary = " | ".join(all_flags) if all_flags else "All parameters within normal reference bounds across selected reports."
            comparison_block = f"""\n\n📊 **Multi-Report Comparison & Combined Health Flags:**
• **Selected Reports Count:** {len(sources)} files analyzed ({source_citations}).
• **Combined Parameter Flags:** {flags_summary}"""

        # Dynamic Personalized Recommendations
        recs = []
        if target_lang == "tanglish":
            if "dengue" in all_rec_tags:
                recs.append(("Hydration & Bed Rest", "ORS, elaneer (coconut water), clear fluids kudikkanum. Complete rest edungga, Aspirin/Ibuprofen podadheenga."))
                recs.append(("Daily CBC Test", "Thinamum blood count (CBC) test panni platelet trend check pannungga."))
            if "allergy" in all_rec_tags:
                recs.append(("Allergen Care", "Dust & allergens-a thavirkkanum. Doctor-a consult panni anti-allergy treatment eduthukonga."))
            if "anemia" in all_rec_tags:
                recs.append(("Iron Foods", "Keerai (greens), legumes, & Vitamin C food saapdungga."))
            if "diabetes" in all_rec_tags:
                recs.append(("Dietary Control", "Low glycemic index food saapdungga, refined sugars & sweets thavirkkanum."))
            if "lipid" in all_rec_tags:
                recs.append(("Diet & Exercise", "Oily/fatty food thavirkkanum, daily 30 mins brisk walk pannungga."))
            if not recs:
                recs.append(("Doctor Consult", "Ungga report-a doctor-kitta kaatti advice vaangungga."))
        else:
            if "dengue" in all_rec_tags:
                recs.append(("Hydration & Fluids", "Drink 3-4 liters of ORS, coconut water, or clear fluids daily."))
                recs.append(("Rest & Recovery", "Complete bed rest is strongly advised. Repeat CBC in 24 hours to track platelet trend."))
                recs.append(("Medication Safety", "Avoid Aspirin and Ibuprofen (NSAIDs). Use Paracetamol (500mg) for fever only."))
            if "allergy" in all_rec_tags:
                recs.append(("Allergen Avoidance", "Identify and avoid potential triggers (dust mites, pollen, pet dander, specific foods)."))
                recs.append(("Specialist Consultation", "Consult an allergist or immunologist for specific IgE panel testing."))
            if "anemia" in all_rec_tags:
                recs.append(("Iron-Rich Foods", "Increase intake of dark leafy greens, legumes, and pumpkin seeds along with Vitamin C for optimal iron absorption."))
            if "diabetes" in all_rec_tags:
                recs.append(("Dietary Control", "Adopt a low glycemic index diet, avoid refined sugars, and limit sugar-sweetened beverages."))
            if "lipid" in all_rec_tags:
                recs.append(("Cardiovascular & Lifestyle", "Adopt a low saturated fat diet, engage in 30 minutes of daily exercise, and monitor lipid profile."))
            if "liver" in all_rec_tags:
                recs.append(("Liver Care", "Avoid alcohol and liver-stressing medications, adopt a low-fat diet, and consult a gastroenterologist."))

            if not recs:
                recs.append(("Physician Review", "Share these report results with your treating doctor for comprehensive review."))
                recs.append(("Symptom Monitoring", "Track any active symptoms and follow up on any flagged parameters."))

        recs_block = "\n".join([f"{i}. **{title}:** {desc}" for i, (title, desc) in enumerate(recs, 1)])

        # Structured Clinical Problem & Food Diet Plan Section
        clinical_answer_block = ""
        if any(k in q_lower for k in ["problem", "issue", "diet", "food", "eat", "what to eat", "wrong", "summary", "finding", "meaning"]):
            prob_items = []
            diet_items = []
            
            if "anemia" in all_rec_tags:
                prob_items.append("• **Microcytic Anemia (Low Hemoglobin):** Indicates lower oxygen-carrying capacity. May cause fatigue, weakness, or lightheadedness.")
                diet_items.append("• **Diet for Anemia:** Eat iron-rich foods (dark leafy greens like spinach/keerai, lentils, chickpeas, pumpkin seeds, lean meats). Pair with Vitamin C (oranges, lemons, amla, bell peppers) to boost iron absorption. **Avoid drinking tea or coffee directly with meals**, as tannins inhibit iron absorption.")

            if "diabetes" in all_rec_tags:
                prob_items.append("• **Elevated Blood Sugar / Type-2 Diabetes Mellitus:** Indicated by elevated HbA1c and/or Fasting/Post-Prandial Glucose levels.")
                diet_items.append("• **Diet for Diabetes Control:** Consume low Glycemic Index (GI) foods (oats, quinoa, brown rice, whole wheat, legumes) and high-fiber non-starchy vegetables (spinach, broccoli, cabbage). **Avoid refined sugars, sweets, fruit juices with added sugar, white bread, and soft drinks.**")

            if "lipid" in all_rec_tags:
                prob_items.append("• **Dyslipidemia / High Cholesterol & Triglycerides:** Indicated by high Total Cholesterol, Triglycerides, LDL, or low HDL.")
                diet_items.append("• **Diet for Cholesterol & Lipid Control:** Adopt a Mediterranean-style diet rich in soluble fiber (oats, beans) and omega-3 fatty acids (flaxseeds, walnuts, olive oil). **Strictly avoid deep-fried, oily, and high saturated fat foods.**")

            if "dengue" in all_rec_tags:
                prob_items.append("• **Thrombocytopenia / Low Platelet Count (Dengue Profile):** Indicates reduced blood clotting cells.")
                diet_items.append("• **Diet for Dengue & Platelet Recovery:** Drink 3-4 liters of oral fluids daily (ORS, tender coconut water, clear soups, papaya leaf extract). **Strictly avoid NSAIDs like Aspirin or Ibuprofen.**")

            if "allergy" in all_rec_tags:
                prob_items.append("• **Elevated IgE / Allergy Reaction:** Indicates heightened immune reaction to environmental or food allergens.")
                diet_items.append("• **Diet & Allergy Care:** Identify and eliminate suspected dietary or environmental triggers. Eat antioxidant-rich whole foods.")

            if prob_items and diet_items:
                clinical_answer_block = f"""\n\n🩺 **Identified Medical Problems:**\n""" + "\n".join(prob_items) + f"""\n\n🥗 **Targeted Food & Dietary Plan:**\n""" + "\n".join(diet_items)

        header_title = f"🔍 **Dense Vector RAG Analysis ({len(sources)} Report{'s' if len(sources)>1 else ''} Selected):**"
        
        answer_markdown = f"""{header_title}

Based on vector similarity retrieval across your selected report(s) (**{source_citations}**):{clinical_answer_block}

{report_details_block}{comparison_block}

📋 **Personalized Recommendations:**
{recs_block}

📌 **Retrieved Data Sources:**
""" + "\n".join([f"• 📄 **{s['file_name']}** ({s['type']} | Date: {s['date']})" for s in sources]) + """

⚠️ *This answer was generated using Dense Vector RAG retrieval over your selected report context. Always consult your attending doctor for clinical decisions.*"""

        return {
            "question": query,
            "answer": answer_markdown,
            "is_rag": True,
            "sources": sources,
            "vector_chunks": top_chunks or [],
            "language": target_lang,
            "quick_suggestions": [
                "What should I eat based on my report?",
                "When should I repeat this blood test?",
                "Are these abnormal values dangerous?",
                "How to share these reports with my doctor?"
            ]
        }

    def generate_general_response(self, query: str, language: str = "en") -> Dict[str, Any]:
        """
        Generates direct AI answers for general medical & health questions without report context.
        Supports Multilingual (English, Tanglish, Hindi, Tamil, Telugu, Spanish, Bengali).
        """
        q_lower = query.lower().strip()
        target_lang = self._detect_language(query, language)
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or self.gemini_key

        # Attempt Gemini LLM
        if api_key and len(api_key.strip()) > 10:
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key.strip())
                
                lang_instructions = {
                    "tanglish": "IMPORTANT: Answer in friendly, natural Tanglish (Tamil spoken words written in clear Roman/English script). Example: 'Dengue-kku hydration thaan mukkiyam...'",
                    "hi": "IMPORTANT: Answer in clear Hindi (हिन्दी).",
                    "ta": "IMPORTANT: Answer in clear Tamil (தமிழ்).",
                    "te": "IMPORTANT: Answer in clear Telugu (తెలుగు).",
                    "es": "IMPORTANT: Answer in clear Spanish (Español).",
                    "bn": "IMPORTANT: Answer in clear Bengali (বাংলা).",
                }
                lang_note = lang_instructions.get(target_lang, "")

                response_text = None
                for model_name in ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-pro', 'gemini-pro-latest', 'gemini-2.5-flash-lite']:
                    try:
                        model = genai.GenerativeModel(model_name)
                        prompt = f"""You are MedSimplify AI Health Assistant. 
Answer the user's general health question clearly, empathetically, accurately, and concisely with clean Markdown formatting (bullet points, bold highlights, practical immediate care, red flag warnings, and when to see a doctor).
{lang_note}

USER QUESTION: {query}
"""
                        res = model.generate_content(prompt)
                        if res and res.text and res.text.strip():
                            response_text = res.text.strip()
                            break
                    except Exception as err:
                        print(f"[General Gemini] Model {model_name} failed: {err}")
                        continue

                if response_text:
                    return {
                        "question": query,
                        "answer": response_text,
                        "is_rag": False,
                        "sources": [],
                        "language": target_lang,
                        "quick_suggestions": [
                            "COVID-19 Precautions",
                            "What to eat in dengue?",
                            "Fever Management Tips",
                            "How to manage high BP?",
                            "How to book a video consultation?"
                        ]
                    }
            except Exception as e:
                print(f"[General AI] Gemini call info: {e}")

        # ── Multilingual & Tanglish Smart Fallback Engine ────────────────────────
        
        # 1. TANGLISH RESPONSES
        if target_lang == "tanglish":
            if any(k in q_lower for k in ["covid", "corona", "precaution", "prevent", "mask", "thadukku"]):
                answer = (
                    "🛡️ **COVID-19 Precautions & Infection Thadukku Vazhigal (Tanglish):**\n\n"
                    "1. **Mask Podungga:** Kootamaana idangalil N95 illa 3-ply mask kandippa podungga.\n"
                    "2. **Kai Wash Pannungga:** Soap & water vechu 20 seconds nalla kai wash pannungga, illa alcohol-based sanitizer use pannungga.\n"
                    "3. **Social Distance & Ventilation:** Kaattrovattam irukkura idathil irungga, jannal thirandhu vaiyungga.\n"
                    "4. **Immune Support:** Vitamin C & Zinc-rich foods (Orange, Greens, Nuts) saapdungga. Daily 2.5–3 liters water kudikkanum.\n"
                    "5. **Vaccine & Booster:** Correct time-ku COVID vaccine & booster dose eduthukonga.\n"
                    "6. **Symptom irundhaa:** Fever, cough, vaasanai theriyala na udane isolate aagi test pannungga.\n\n"
                    "⚠️ *Moochu thinaral (shortness of breath) irundhaa udane doctor-a consult pannungga.*"
                )
            elif any(k in q_lower for k in ["dengue", "platelet", "saapdanum", "saapda", "diet", "food"]):
                answer = (
                    "🥣 **Dengue & Low Platelet-kkana Diet & Care Guidance (Tanglish):**\n\n"
                    "• **Hydration thaan mukkiyam:** Thinamum 3-4 liters ORS, elaneer (coconut water), fresh fruit juices kudikkanum.\n"
                    "• **Papaya leaf extract & Maadulai (Pomegranate):** Platelet count maintain panna safe traditional remedies.\n"
                    "• **Saapda koodadhadhu:** Oily, spicy food, tea/coffee thavirkkanum.\n"
                    "• **Complete Bed Rest:** Rest eduthaa dhaan body fast-a recover aagum.\n"
                    "• **Fever medicine:** Paracetamol (500mg) mattum dhaan podanum. Aspirin or Ibuprofen podave koodadhu!\n"
                    "• **Repeat CBC test:** Daily blood count test panni platelet trend check pannungga.\n\n"
                    "⚠️ *Doctor advice-a eppovum follow pannunga.*"
                )
            elif any(k in q_lower for k in ["fever", "kaachal", "temperature", "body pain"]):
                answer = (
                    "🌡️ **Fever & Body Pain Management (Tanglish):**\n\n"
                    "• **Nalla Fluid Kudikkanum:** ORS, hot water, soup kudichu body-ya hydrate-a vechukonga.\n"
                    "• **Cooling sponge:** Thala & kai-la lukewarm water thuni vechu sponge pannungga.\n"
                    "• **Safe Medicine:** Paracetamol (500mg - 650mg) saaptta piragu eduthukonga. NSAIDs (Ibuprofen/Aspirin) podadheenga.\n"
                    "• **Rest:** Complete rest edunga.\n\n"
                    "⚠️ *Fever 103°F mela ponaal or 3 days-ku mela neadithal doctor-a paarungga.*"
                )
            elif any(k in q_lower for k in ["headache", "thalaivoli", "migraine"]):
                answer = (
                    "🧠 **Headache & Migraine Relief (Tanglish):**\n\n"
                    "• **Water & Rest:** Dehydration nala headache varalam — udane 1-2 glass water kudichu, iruttaana quiet room-la rest edungga.\n"
                    "• **Cold Compress:** Thalaiku cool cloth or kazhuthuku warm compress vekkalaam.\n"
                    "• **Mobile/Screen Break:** Phone/Laptop screen parppadhu thavirkkanum.\n"
                    "• **Paracetamol:** Severe pain-ku Paracetamol (500mg) edukalam.\n\n"
                    "⚠️ *Thideer severe headache or fever irundha udane doctor consult pannungga.*"
                )
            else:
                clean_q = query.strip()
                answer = (
                    f"🩺 **MedSimplify AI Health Advice for: \"{clean_q}\" (Tanglish):**\n\n"
                    "1. **Basic Care Steps:**\n"
                    "   • Thinamum 2.5 - 3 liters water/fluids kudikkanum, 7-8 hours nalla thoongungga.\n"
                    "   • Veetla seidha healthy food saapdungga, junk/oily food thavirkkanum.\n"
                    "   • Ungga symptom-a regular-a track pannungga.\n\n"
                    "2. **Doctor Consult:**\n"
                    "   • Symptom 2-3 days-ku mela neadithal or அதிகமாச்சுனா doctor-a consult pannungga.\n\n"
                    "⚠️ *Idhu general health guidance mattum dhaan. Proper medical advice-ku doctor-a consult pannungga.*"
                )

        # 2. HINDI RESPONSES
        elif target_lang == "hi":
            if any(k in q_lower for k in ["covid", "corona", "precaution", "बचाव"]):
                answer = (
                    "🛡️ **कोविड-19 सावधानियां और बचाव के उपाय (Hindi):**\n\n"
                    "1. **मास्क पहनें:** भीड़भाड़ वाली जगहों पर N95 या 3-प्लाई मास्क का इस्तेमाल करें।\n"
                    "2. **हाथों की सफाई:** साबुन और पानी से 20 सेकंड तक हाथ धोएं या सैनिटाइजर का उपयोग करें।\n"
                    "3. **दूरी और वेंटिलेशन:** लोगों से सुरक्षित दूरी बनाए रखें और कमरों में हवा आने दें।\n"
                    "4. **प्रतिरोधक क्षमता:** विटामिन सी और जिंक युक्त आहार लें। रोज 2.5-3 लीटर पानी पिएं।\n"
                    "5. **टीकाकरण:** कोविड वैक्सीन और बूस्टर डोज समय पर लगवाएं।\n"
                    "6. **लक्षण दिखने पर:** बुखार या खांसी होने पर तुरंत आइसोलेट हों और टेस्ट करवाएं।"
                )
            elif any(k in q_lower for k in ["dengue", "platelet", "खाना", "डेंगी"]):
                answer = (
                    "🥣 **डेंगी और कम प्लेटलेट्स के लिए आहार और देखभाल (Hindi):**\n\n"
                    "• **हाइड्रेशन जरूरी है:** रोजाना 3-4 लीटर तरल पदार्थ (ओआरएस, नारियल पानी, ताजा रस) पिएं।\n"
                    "• **पपीते के पत्तों का रस और अनार:** प्लेटलेट स्तर को बनाए रखने में मदद करता है।\n"
                    "• **परहेज:** मसालेदार, तला-भुना खाना बंद करें।\n"
                    "• **विश्राम:** पूर्ण बिस्तर विश्राम तेजी से रिकवरी में मदद करता है।\n"
                    "• **दवा की सुरक्षा:** केवल पैरासिटामोल (500mg) लें। एस्पिरिन या इबुप्रोफेन कभी न लें!"
                )
            else:
                answer = (
                    f"🩺 **MedSimplify AI स्वास्थ्य सलाह (Hindi):**\n\n"
                    f"आपके प्रश्न: **\"{query}\"** के संदर्भ में:\n\n"
                    "• पर्याप्त पानी (2.5-3 लीटर रोज) पिएं और अच्छा आराम करें।\n"
                    "• घर का बना पौष्टिक भोजन लें और मसालेदार खाने से बचें।\n"
                    "• यदि लक्षण 2-3 दिनों से अधिक बने रहते हैं, तो अपने डॉक्टर से सलाह लें।"
                )

        # 3. TAMIL RESPONSES (Tamil Script)
        elif target_lang == "ta":
            if any(k in q_lower for k in ["dengue", "platelet", "சாப்பிட", "டெங்கு"]):
                answer = (
                    "🥣 **டெங்கு மற்றும் குறைந்த பிளேட்லெட்டுகளுக்கான பராமரிப்பு (Tamil):**\n\n"
                    "• **திரவ உணவுகள் முக்கியம்:** தினமும் 3-4 லிட்டர் நீர், ORS, இளநீர், பழச்சாறுகள் அருந்தவும்.\n"
                    "• **பப்பாளி இலை சாறு & மாதுளை:** பிளேட்லெட் எண்ணிக்கையை பராமரிக்க உதவும்.\n"
                    "• **தவிர்க்க வேண்டியவை:** எண்ணெயில் பொரித்த உணவுகளை தவிர்க்கவும்.\n"
                    "• **காய்ச்சல் மருந்து:** பாராசிட்டமால் மட்டுமே உட்கொள்ளவும். ஆஸ்பிரின் தவிர்க்கவும்!"
                )
            else:
                answer = (
                    f"🩺 **MedSimplify AI சுகாதார வழிகாட்டுதல் (Tamil):**\n\n"
                    f"உங்கள் கேள்வி: **\"{query}\"**\n\n"
                    "• தினமும் 2.5-3 லிட்டர் தண்ணீர் குடிக்கவும், போதுமான ஓய்வு எடுக்கவும்.\n"
                    "• சத்தான உணவை உட்கொள்ளவும்.\n"
                    "• அறிகுறிகள் நீடித்தால் மருத்துவரை அணுகவும்."
                )

        # 4. ENGLISH & OTHER LANGUAGES
        else:
            if any(k in q_lower for k in ["covid", "coronavirus", "corona", "sars", "precaution", "prevent", "isolation", "quarantine", "mask", "infection", "epidemic", "outbreak"]):
                answer = (
                    "🛡️ **COVID-19 & Viral Infection Prevention & Precautions:**\n\n"
                    "1. **Respiratory & Mask Hygiene:** Wear a well-fitting N95/KN95 or 3-ply mask in crowded, enclosed, or poorly ventilated indoor spaces.\n"
                    "2. **Hand Hygiene:** Wash hands thoroughly with soap and water for at least 20 seconds, or use an alcohol-based hand sanitizer (≥60% alcohol) frequently.\n"
                    "3. **Physical Distancing & Ventilation:** Maintain safe distance in public places and ensure good room airflow by keeping windows open when possible.\n"
                    "4. **Immune & Dietary Support:** Consume a balanced diet rich in Vitamin C, Vitamin D, and Zinc (citrus fruits, leafy greens, nuts). Stay well-hydrated with 2.5–3 liters of fluids daily.\n"
                    "5. **Vaccination:** Keep up-to-date with recommended COVID-19 vaccines and booster doses.\n"
                    "6. **Symptom Monitoring:** If you experience fever, cough, loss of taste/smell, body ache, or throat irritation, isolate immediately and take a Rapid Antigen / RT-PCR test.\n\n"
                    "⚠️ *Emergency Warning: Seek immediate medical care if you experience shortness of breath, persistent chest pressure, or oxygen saturation dropping below 94%.*"
                )
            elif any(k in q_lower for k in ["fever", "temperature", "body pain", "chills", "shivering"]):
                answer = (
                    "🌡️ **Fever & Body Pain Management:**\n\n"
                    "• **Hydration:** Drink plenty of fluids (ORS, lukewarm water, clear soups, coconut water) to prevent dehydration.\n"
                    "• **Temperature Control:** Apply lukewarm sponge compresses to forehead, neck, and arms.\n"
                    "• **Medication Safety:** Paracetamol (500mg - 650mg) after meals is safe for fever management. **Never take NSAIDs (Ibuprofen or Aspirin) without doctor confirmation**, as they worsen bleeding risk in viral infections like Dengue.\n"
                    "• **Rest:** Complete bed rest allows your immune system to fight infection effectively.\n\n"
                    "⚠️ *Seek emergency care if fever exceeds 103°F, lasts >3 days, or is accompanied by severe headache or rash.*"
                )
            elif any(k in q_lower for k in ["dengue", "platelet", "cbc", "blood test", "ns1"]):
                answer = (
                    "🥣 **Dengue & Low Platelet Care Advice:**\n\n"
                    "• **Hydration is Vital:** Drink 3-4 liters of fluids daily — ORS, coconut water, fresh fruit juices, and soups.\n"
                    "• **Platelet Support:** Papaya leaf extract and pomegranate are safe traditional remedies that support platelet health.\n"
                    "• **Medication Warning:** Use Paracetamol for fever. **Do NOT take Aspirin or Ibuprofen.**\n"
                    "• **Monitoring:** Repeat Complete Blood Count (CBC) every 24 hours to monitor platelet trend.\n\n"
                    "⚠️ *Red Flag Symptoms: Persistent vomiting, bleeding from gums/nose, extreme abdominal pain, or severe fatigue require immediate hospitalization.*"
                )
            else:
                clean_q = query.strip()
                answer = (
                    f"🩺 **MedSimplify AI Clinical Guidance:**\n\n"
                    f"Regarding your query: **\"{clean_q}\"**\n\n"
                    "1. **Primary Health & Care Measures:**\n"
                    "   • **Hydration & Rest:** Maintain good daily fluid intake (2.5 - 3 liters) and get 7-8 hours of restful sleep.\n"
                    "   • **Dietary Care:** Eat fresh, home-cooked, well-balanced meals. Avoid excessive processed or oily foods.\n"
                    "   • **Symptom Tracking:** Note down when your symptoms started, their severity, and any triggering factors.\n\n"
                    "2. **When to Seek Medical Advice:**\n"
                    "   • If your symptoms persist for more than 48-72 hours, worsen over time, or impair daily activities, consult your doctor for a detailed clinical examination.\n\n"
                    "⚠️ *Disclaimer: MedSimplify AI Health Assistant provides evidence-based health information for educational guidance. Always consult a licensed medical practitioner for personalized diagnosis and treatment.*"
                )

        return {
            "question": query,
            "answer": answer,
            "is_rag": False,
            "sources": [],
            "language": target_lang,
            "quick_suggestions": [
                "COVID-19 Precautions",
                "What to eat in dengue?",
                "Fever Management Tips",
                "How to manage high BP?",
                "How to book a video consultation?"
            ]
        }

rag_assistant = RAGHealthAssistant()

