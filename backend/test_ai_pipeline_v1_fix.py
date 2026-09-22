import sys
import os
import json

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_ai_pipeline_v1_audit_doc_cases():
    print("=" * 80)
    print("VERIFYING AI PIPELINE V1 & MEDICAL REPORTS ENDPOINTS (AI PIPELINE V1.pdf)")
    print("=" * 80)

    # ----------------------------------------------------
    # TEST 1: POST /api/v1/ai/simplify (CMP + CBC Unit Normalization & Missed Entities)
    # ----------------------------------------------------
    print("\n[TEST 1] Testing POST /api/v1/ai/simplify (Unit Normalization & Guardrails)...")
    v1_input = """Comprehensive Metabolic Panel & CBC:
WBC: 5.4 x10^3/uL (Normal: 4.0 - 11.0)
Hgb: 11.1 g/dL (Low: 13.0 - 17.0)
MCV: 74 fL (Low: 80 - 100)
Platelets: 285 x10^3/uL (Normal: 150 - 450)

Metabolic Profile:
Fasting Blood Glucose: 118 mg/dL (High, Normal: 70 - 99)
HbA1c: 6.2% (Prediabetes: 5.7 - 6.4%)
Serum Creatinine: 0.9 mg/dL (Normal: 0.7 - 1.3)
eGFR: >90 mL/min (Normal: >60)

Impression: Microcytic anemia and impaired fasting glucose consistent with prediabetes. Recommend nutritional consultation and iron evaluation."""

    res1 = client.post("/api/v1/ai/simplify", json={"raw_text": v1_input})
    assert res1.status_code == 200, f"Expected 200 OK, got {res1.status_code}"
    out1 = res1.json()

    extracted_entities = out1["extracted_entities"]
    entity_map = {e["entity"]: e for e in extracted_entities}
    entity_names = list(entity_map.keys())
    print(f"  Extracted Entities ({len(entity_names)}): {entity_names}")

    # 1. Platelet Count Unit Normalization
    assert "Platelet Count" in entity_map, "Platelet Count missing from extractions!"
    plt_entity = entity_map["Platelet Count"]
    print(f"  Platelet Entity: value='{plt_entity['value']}', status='{plt_entity['status']}'")
    assert plt_entity["status"] == "Normal", f"Platelet Count falsely marked as {plt_entity['status']}!"
    assert "285,000" in plt_entity["value"], f"Platelet Count value not normalized: {plt_entity['value']}"
    assert "Platelet Count" not in out1["flagged_reason"], "Platelet Count falsely included in flagged_reason!"

    # 2. Missed Entities
    assert "MCV" in entity_map, "MCV missing from extractions!"
    assert entity_map["MCV"]["status"] == "Low", f"MCV status expected Low, got {entity_map['MCV']['status']}"

    assert "Serum Creatinine" in entity_map, "Serum Creatinine missing from extractions!"
    assert entity_map["Serum Creatinine"]["status"] == "Normal", f"Creatinine status expected Normal, got {entity_map['Serum Creatinine']['status']}"

    assert "eGFR" in entity_map, "eGFR missing from extractions!"
    assert entity_map["eGFR"]["status"] == "Normal", f"eGFR status expected Normal, got {entity_map['eGFR']['status']}"

    # 3. ELI5 Guardrail against unmentioned Cholesterol
    eli5_text = out1["eli5_summary"].lower()
    print(f"  ELI5 Summary: {out1['eli5_summary'][:140]}...")
    assert "cholesterol" not in eli5_text, "Cholesterol hallucinated in ELI5 summary!"
    assert "oil" not in eli5_text, "Sticky oil metaphor hallucinated in ELI5 summary!"

    print("  ✅ Platelet count normalized to 285,000 /uL (Normal), MCV/Creatinine/eGFR extracted, 0 cholesterol hallucinations!")

    # ----------------------------------------------------
    # TEST 2: POST /api/reports/upload (Foreign Key & File Storage Safety)
    # ----------------------------------------------------
    print("\n[TEST 2] Testing POST /api/reports/upload (HTTP 500 Prevention)...")
    res2 = client.post(
        "/api/reports/upload",
        data={
            "patient_id": 1,
            "report_type": "lab_report",
            "raw_text": v1_input,
            "language": "en"
        }
    )
    assert res2.status_code == 200, f"Expected 200 OK, got {res2.status_code} ({res2.text})"
    report_obj = res2.json()
    assert report_obj["id"] is not None
    print(f"  ✅ Report upload succeeded with HTTP 200 OK! Created Report ID={report_obj['id']}.")

    # ----------------------------------------------------
    # TEST 3: GET /api/reports/compare/trends (Route Ordering & Biomarker Trends)
    # ----------------------------------------------------
    print("\n[TEST 3] Testing GET /api/reports/compare/trends (Route Matching & Analytics)...")
    res3 = client.get("/api/reports/compare/trends?ids=1")
    assert res3.status_code == 200, f"Expected 200 OK, got {res3.status_code} ({res3.text})"
    trends = res3.json()
    assert "title" in trends
    assert "chart_data" in trends
    assert "comparison_table" in trends
    print(f"  ✅ Trends API status 200 OK! Title: '{trends['title']}'.")

    # ----------------------------------------------------
    # TEST 4: GET /api/reports/{report_id} & GET /api/reports/
    # ----------------------------------------------------
    print("\n[TEST 4] Testing GET /api/reports/ and GET /api/reports/{report_id}...")
    res4_list = client.get("/api/reports/?patient_id=1")
    assert res4_list.status_code == 200
    reports_list = res4_list.json()
    assert len(reports_list) >= 1
    report_id = reports_list[0]["id"]

    res4_single = client.get(f"/api/reports/{report_id}")
    assert res4_single.status_code == 200
    assert res4_single.json()["id"] == report_id
    print(f"  ✅ GET /api/reports/{report_id} returned valid MedicalReport object!")

    print("\n" + "=" * 80)
    print("ALL AI PIPELINE V1 & MEDICAL REPORTS TESTS PASSED 100% SUCCESSFULLY!")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    test_ai_pipeline_v1_audit_doc_cases()
