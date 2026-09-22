from services.ai_pipeline import ai_pipeline
import json

sample_text = """
DRLOGY PATHOLOGY LAB
Patient Name: Yash M. Patel | Age: 21 Years | Gender: Male | PID: 555
Test Requested: RADIOALLERGOSORBENT (RAST) / Allergy Profile

TEST PARAMETERS              VALUE        UNIT       REFERENCE RANGE       FLAG
--------------------------------------------------------------------------------
IMMUNOGLOBULIN IgE, SERUM     160.50       kUA/L      < 64.00               Very High [CRITICAL]
"""

res = ai_pipeline.process_document(raw_text=sample_text, filename="input_file_0.png")

print("=" * 60)
print("DYNAMIC AI PIPELINE OUTPUT TEST (YASH M. PATEL / IgE ALLERGY):")
print("=" * 60)
print(json.dumps(res, indent=2))
print("=" * 60)
