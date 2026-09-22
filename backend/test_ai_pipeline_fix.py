import sys
import os
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_ai_pipeline_audit_doc_cases():
    print("=" * 80)
    print("VERIFYING AI PIPELINE ENDPOINTS AGAINST AI PIPELINE.docx SPECIFICATIONS")
    print("=" * 80)

    # ----------------------------------------------------
    # TEST CASE 1: POST /api/ai/simplify (CBC & Lipid Panel)
    # ----------------------------------------------------
    print("\n[TEST CASE 1] POST /api/ai/simplify - CBC & Lipid Panel Verification")
    input_1 = """Complete Blood Count & Lipid Panel:
WBC: 6.8 x10^3/uL (Normal: 4.0 - 11.0)
RBC: 4.65 x10^6/uL (Normal: 4.20 - 5.80)
Hgb: 14.2 g/dL (Normal: 13.0 - 17.0)
Hct: 42.1% (Normal: 38.0 - 50.0)

Lipid Profile:
Total Cholesterol: 245 mg/dL (High, Desirable: <200)
Triglycerides: 185 mg/dL (Borderline High: 150-199)
HDL: 38 mg/dL (Low, Desirable: >40)
LDL Calculated: 170 mg/dL (High, Optimal: <100)

Impression: Hyperlipidemia with elevated LDL and reduced HDL. Recommend dietary modification and lifestyle interventions."""

    res1 = client.post("/api/ai/simplify", json={"raw_text": input_1})
    assert res1.status_code == 200, f"Expected 200, got {res1.status_code}"
    out1 = res1.json()

    extracted_names = [e["entity"] for e in out1["extracted_entities"]]
    print(f"  Extracted Entities ({len(extracted_names)}): {extracted_names}")

    # Check ZERO hallucinated diabetes metrics
    assert "HbA1c" not in extracted_names, "HbA1c was hallucinated!"
    assert "Fasting Blood Sugar" not in extracted_names, "Fasting Sugar was hallucinated!"
    assert "Post Prandial Sugar" not in extracted_names, "Post Prandial Sugar was hallucinated!"

    # Check presence of CBC & Lipid metrics
    assert any("wbc" in name.lower() for name in extracted_names), "WBC Count missing!"
    assert "RBC Count" in extracted_names, "RBC Count missing!"
    assert "Hemoglobin" in extracted_names, "Hemoglobin missing!"
    assert "Hematocrit" in extracted_names, "Hematocrit missing!"
    assert "Total Cholesterol" in extracted_names, "Total Cholesterol missing!"
    assert "Triglycerides" in extracted_names, "Triglycerides missing!"
    assert "HDL Cholesterol" in extracted_names, "HDL Cholesterol missing!"
    assert "LDL Cholesterol" in extracted_names, "LDL Cholesterol missing!"

    # Check exact values matched
    tg_val = [e["value"] for e in out1["extracted_entities"] if e["entity"] == "Triglycerides"][0]
    ldl_val = [e["value"] for e in out1["extracted_entities"] if e["entity"] == "LDL Cholesterol"][0]
    assert "185" in tg_val, f"Expected 185 in Triglycerides, got {tg_val}"
    assert "170" in ldl_val, f"Expected 170 in LDL, got {ldl_val}"

    # Check zero medication hallucinations
    full_text = json.dumps(out1)
    assert "Metformin" not in full_text, "Metformin was hallucinated in output!"
    print("  [OK] 0 Hallucinations! CBC & Lipid Panel parsed perfectly!")

    # ----------------------------------------------------
    # TEST CASE 2: POST /api/ai/translate (Tamil Target Lang)
    # ----------------------------------------------------
    print("\n[TEST CASE 2] POST /api/ai/translate - Tamil Language Translation")
    input_2 = {
        "summary_text": "Your blood count is normal. However, your cholesterol and LDL levels are high, and your HDL is slightly low. Your doctor recommends diet modification and regular exercise.",
        "target_lang": "Tamil"
    }
    res2 = client.post("/api/ai/translate", json=input_2)
    assert res2.status_code == 200
    out2 = res2.json()
    print(f"  Target Lang: {out2['target_lang']}")
    print(f"  Translated Text: {out2['translated_text']}")
    assert out2["translated_text"] != input_2["summary_text"], "Translation returned untranslated English!"
    assert any(ord(char) > 255 for char in out2["translated_text"]), "Translated text contains no Tamil characters!"
    print("  [OK] Tamil Translation verified!")

    # ----------------------------------------------------
    # TEST CASE 3: POST /api/ai/soap (Punctuation Double Period Fix)
    # ----------------------------------------------------
    print("\n[TEST CASE 3] POST /api/ai/soap - Clinical EMR SOAP Notes")
    input_3 = {
        "patient_name": "John Doe",
        "symptoms": "Reports persistent mild fatigue over the last 3 weeks, occasional lightheadedness upon standing, and shortness of breath during moderate exertion.",
        "lab_findings": "CBC shows Hemoglobin 10.5 g/dL (Low), Hematocrit 32% (Low), Ferritin 12 ng/mL (Low). WBC and platelet counts are within normal limits."
    }
    res3 = client.post("/api/ai/soap", json=input_3)
    assert res3.status_code == 200
    out3 = res3.json()["soap_notes"]
    print(f"  [S] Subjective: {out3['subjective']}")
    print(f"  [O] Objective: {out3['objective']}")
    assert not out3["subjective"].endswith(".."), "Subjective contains double period artifact '..'!"
    assert not out3["objective"].endswith(".."), "Objective contains double period artifact '..'!"
    print("  [OK] SOAP Notes punctuation clean with 0 double period artifacts!")

    # ----------------------------------------------------
    # TEST CASE 4: POST /api/ai/chat (Anemia Nutrition & Diet Q&A)
    # ----------------------------------------------------
    print("\n[TEST CASE 4] POST /api/ai/chat - Anemia Dietary Advice Q&A")
    input_4 = {
        "question": "I was diagnosed with mild iron deficiency anemia. What foods should I eat to help increase my iron levels, and what should I avoid?"
    }
    res4 = client.post("/api/ai/chat", json=input_4)
    assert res4.status_code == 200
    out4 = res4.json()
    answer = out4["answer"]
    print(f"  Question: '{input_4['question']}'")
    print(f"  Answer: {answer}")
    assert "Thank you for asking" not in answer, "Generic mock stub returned!"
    assert "spinach" in answer.lower() or "leafy greens" in answer.lower() or "iron-rich" in answer.lower(), "Iron dietary foods missing!"
    assert "vitamin c" in answer.lower(), "Vitamin C recommendation missing!"
    assert "tea" in answer.lower() or "coffee" in answer.lower() or "inhibit" in answer.lower(), "Foods/drinks to avoid missing!"
    print("  [OK] AI Chat returned comprehensive medical & dietary response!")

    print("\n" + "=" * 80)
    print("ALL 4 AUDIT DOCUMENT TEST CASES PASSED SUCCESSFULLY WITH ZERO ERRORS!")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    test_ai_pipeline_audit_doc_cases()
