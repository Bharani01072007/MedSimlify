import os
import sys

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # type: ignore
        sys.stderr.reconfigure(encoding="utf-8")  # type: ignore
    except Exception:
        pass

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.ai.rag_service import rag_assistant

def test_metropolis_rag_accuracy():
    metropolis_text = """
METROPOLIS CLINICAL LABORATORIES
Patient Name: Ananya Sharma
Age: 28 Years
Gender: Female
PID: MET-90821
Sample Collected: 18-Sep-2026 09:30 AM
Report Date: 18-Sep-2026 02:15 PM
Referring Doctor: Dr. S. Rao, MD

===================================================================================
TEST NAME VALUE UNIT REFERENCE RANGE FLAG
===================================================================================
Hemoglobin 10.5 g/dL 12.0 - 15.5 LOW
Total WBC Count 6,400 /uL 4,000 - 11,000 NORMAL
Platelet Count 220,000 /uL 150,000 - 450,000 NORMAL
Fasting Blood Sugar (Glucose) 142 mg/dL 70 - 99 HIGH
HbA1c 6.8 % 4.0 - 5.6 HIGH
Serum Creatinine 0.8 mg/dL 0.5 - 1.1 NORMAL
===================================================================================
Comments:
- Borderline microcytic anemia suggested by low hemoglobin level.
- Elevated fasting blood sugar and HbA1c indicative of early Type 2 Diabetes Mellitus.
"""

    sources = [{
        "id": 1,
        "file_name": "METROPOLIS CLINICAL LABORATORIES.pdf",
        "date": "18-Sep-2026",
        "type": "Lab Report",
        "extracted_data": {},
        "raw_text": metropolis_text
    }]

    response = rag_assistant.generate_rag_response(
        query="Analyze my report",
        context=metropolis_text,
        sources=sources,
        language="en"
    )

    answer = response["answer"]
    print("=" * 80)
    print("GENERATED DENSE VECTOR RAG RESPONSE:")
    print("=" * 80)
    print(answer)
    print("=" * 80)

    # 1. Assert Report Date accuracy
    assert "18-Sep-2026" in answer, "Report date 18-Sep-2026 missing!"
    assert "21-Sep-2026" not in answer, "Hallucinated system date 21-Sep-2026 present!"

    # 2. Assert Reference Ranges accuracy
    assert "12.0 - 15.5" in answer, "Female Hemoglobin range 12.0 - 15.5 missing!"
    assert "13.0 - 17.0" not in answer, "Hallucinated male Hemoglobin range 13.0 - 17.0 present!"
    assert "4.0 - 5.6" in answer, "HbA1c range 4.0 - 5.6 missing!"
    assert "0.5 - 1.1" in answer, "Serum Creatinine range 0.5 - 1.1 missing!"

    # 3. Assert Fasting Sugar Unit
    assert "142 mg/dL" in answer, "Unit mg/dL missing from Fasting Sugar 142!"

    # 4. Assert 0 Dengue Hallucinations
    assert "bed rest" not in answer.lower(), "Dengue bed rest hallucinated!"
    assert "repeat cbc in 24 hours" not in answer.lower(), "Dengue 24h CBC repeat hallucinated!"
    assert "aspirin" not in answer.lower(), "Dengue NSAID warning hallucinated!"

    # 5. Assert No Fresh Fruit Juices for Diabetics
    assert "fresh juices" not in answer.lower(), "Fresh fruit juices recommended for diabetic patient!"

    # 6. Assert Sequential Recommendation Numbering
    assert "1. **" in answer and "2. **" in answer, "Clean sequential recommendation numbering (1., 2.) missing!"
    assert "1. **Dietary Control" not in answer or "1. **Iron-Rich Foods" not in answer or answer.count("1. **") == 1, "Duplicate '1.' list items found!"

    print("\n✅ ALL ACCURACY & CLINICAL ZERO-HALLUCINATION CHECKS PASSED PERFECTLY!\n")

if __name__ == "__main__":
    test_metropolis_rag_accuracy()
