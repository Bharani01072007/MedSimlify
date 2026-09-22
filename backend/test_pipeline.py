import sys
import os

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.ai_pipeline import ai_pipeline

def test_pipeline_execution():
    print("=" * 60)
    print("TESTING MEDSIMPLIFY HUGGING FACE AI PIPELINE")
    print("=" * 60)
    
    sample_text = """
    CITY HOSPITAL LAB REPORT
    Patient: Rajesh Kumar | Age: 34 | Date: 14-Sep-2026
    Diagnosis: Dengue Fever with Thrombocytopenia
    
    TEST PARAMETER              RESULT        REFERENCE RANGE       FLAG
    Dengue NS1 Antigen          POSITIVE      Negative              POSITIVE (CRITICAL)
    Platelet Count              80,000 /uL    150,000 - 450,000     LOW (WARNING)
    Hemoglobin                  14.2 g/dL     13.0 - 17.0           NORMAL
    WBC Count                   3,800 /uL     4,000 - 11,000        LOW
    """

    result = ai_pipeline.process_medical_report(sample_text, target_language="hi")
    
    print("\nDocument Type:", result["document_type"])
    print("Confidence Score:", result["confidence"])
    print("\nExtracted Entities Count:", len(result["entities"].get("all_entities", [])))
    print("\nEnglish Simplified Text:\n", result["simplified_text_english"])
    print("\nHindi Translation:\n", result["translated_text"])
    print("\nSummary Card Findings Count:", len(result["summary_card"]["important_findings"]))
    print("=" * 60)
    print("PIPELINE TEST PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_pipeline_execution()
