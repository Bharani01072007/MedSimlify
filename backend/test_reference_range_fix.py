from services.ai_pipeline import ai_pipeline
import json

sample_liver_report = """
CITY METROPOLIS LABS
Patient Name: Priya Nair \nAge: 28 Years | Gender: Female
Test Requested: LIVER FUNCTION TEST (LFT)

TEST PARAMETERS              VALUE        UNIT       REFERENCE RANGE       FLAG
--------------------------------------------------------------------------------
SGPT (ALT)                   88           U/L        < 35                  ELEVATED
SGOT (AST)                   74           U/L        < 31                  ELEVATED
Bilirubin Total              1.8          mg/dL      0.2 - 1.2             HIGH
Bilirubin Direct             0.1          mg/dL      0.0 - 0.3             NORMAL
"""

res = ai_pipeline.process_document(raw_text=sample_liver_report)

print("=" * 60)
print("TESTING REFERENCE RANGE & PATIENT NAME PARSING:")
print("=" * 60)
print(f"Parsed Patient Name: '{res['extracted_data']['patient_name']}'")
print("\nParsed Entities:")
print(json.dumps(res['extracted_data']['entities'], indent=2))
print("=" * 60)
