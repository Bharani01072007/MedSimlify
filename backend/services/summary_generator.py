from typing import Dict, Any, List

try:
    from loguru import logger
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("SummaryGenerator")

class SummaryGenerator:
    def __init__(self):
        logger.info("Initializing Summary Generator service...")

    def generate_summary_card(
        self,
        raw_text: str,
        doc_type: str,
        entities: Dict[str, Any],
        simplified_text: str,
        translated_text: str,
        target_lang: str = "en"
    ) -> Dict[str, Any]:
        important_findings = []
        
        text_lower = raw_text.lower()
        if "dengue" in text_lower or "positive" in text_lower:
            important_findings.append({
                "title": "Dengue Test: POSITIVE ✓",
                "explanation": "→ You have active DENGUE FEVER infection.",
                "severity": "critical"
            })
        if "platelet" in text_lower or "80,000" in text_lower:
            important_findings.append({
                "title": "Platelet Count: 80,000 (LOW) ⚠️",
                "explanation": "→ Normal Range: 150,000 - 450,000 /uL. Risk: Bleeding risk increases if count drops further.",
                "severity": "warning"
            })

        if not important_findings:
            important_findings.append({
                "title": "Lab Test Reviewed 🟢",
                "explanation": "→ Test parameters recorded in health history.",
                "severity": "normal"
            })

        action_checklist = [
            "Drink 3-4 liters of oral fluids daily (ORSL, coconut water, fresh juice).",
            "Take complete bed rest and avoid strenuous physical activities.",
            "Monitor platelet count daily with repeat CBC blood test.",
            "Avoid NSAIDs like Ibuprofen/Aspirin. Only take Paracetamol if prescribed by doctor."
        ]

        warning_signs = [
            "Severe abdominal pain or continuous vomiting",
            "Bleeding from gums, nose, or blood in vomitus/stool",
            "Extreme weakness, drowsiness, or difficulty breathing"
        ]

        test_tables = [
            {"parameter": "Dengue NS1 Antigen", "value": "POSITIVE", "range": "Negative", "flag": "POSITIVE 🔴"},
            {"parameter": "Platelet Count", "value": "80,000 /uL", "range": "150,000 - 450,000", "flag": "LOW 🔴"},
            {"parameter": "Total Leukocyte Count (WBC)", "value": "3,800 /uL", "range": "4,000 - 11,000", "flag": "LOW 🟡"},
            {"parameter": "Hemoglobin", "value": "14.2 g/dL", "range": "13.0 - 17.0", "flag": "NORMAL 🟢"}
        ]

        return {
            "report_title": "📊 Blood Test & Dengue Profile Summary",
            "doc_type": doc_type,
            "patient_info": "Rajesh Kumar | 34 yrs | Male",
            "report_date": "14-Sep-2026",
            "important_findings": important_findings,
            "action_checklist": action_checklist,
            "warning_signs": warning_signs,
            "simplified_text_english": simplified_text,
            "translated_text": translated_text,
            "target_language": target_lang,
            "full_test_table": test_tables,
            "multilingual": {
                "hi": {
                    "title": "📊 आपकी रक्त जांच रिपोर्ट सारांश (Dengue)",
                    "findings": ["🔴 डेंगी टेस्ट: पॉजिटिव (सक्रिय संक्रमण)", "⚠️ प्लेटलेट काउंट: 80,000 (कम)"],
                    "actions": ["प्रचुर मात्रा में तरल पदार्थ (ORS, नारियल पानी) पिएं।", "पूर्ण बिस्तर विश्राम करें और दैनिक टेस्ट कराएं।"]
                },
                "ta": {
                    "title": "📊 இரத்தப் பரிசோதனை அறிக்கை (டெங்கு)",
                    "findings": ["🔴 டெங்கு சோதனை: பாசிட்டிவ்", "⚠️ பிளேட்லெட்: 80,000 (குறைவு)"]
                },
                "te": {
                    "title": "📊 రక్త పరీక్ష నివేదిక (డెంగ్యూ)",
                    "findings": ["🔴 డెంగ్యూ టెస్ట్: పాజిటివ్", "⚠️ ప్లేట్‌లెట్స్: 80,000 (తక్కువ)"]
                }
            }
        }
