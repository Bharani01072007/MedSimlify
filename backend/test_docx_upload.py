import io
import zipfile
import xml.etree.ElementTree as ET
from services.ocr_service import OCRService
from services.ai_pipeline import ai_pipeline

# 1. Create a dummy .docx byte stream representing Metropolis Clinical Lab Report
def create_sample_docx():
    docx_io = io.BytesIO()
    with zipfile.ZipFile(docx_io, 'w') as z:
        content = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
          <w:body>
            <w:p><w:r><w:t>METROPOLIS CLINICAL LABORATORIES</w:t></w:r></w:p>
            <w:p><w:r><w:t>Patient Name: Yash M. Patel | Age: 21 Years | Gender: Male | PID: 555</w:t></w:r></w:p>
            <w:p><w:r><w:t>Test Requested: RADIOALLERGOSORBENT (RAST) / Allergy Profile</w:t></w:r></w:p>
            <w:p><w:r><w:t>IMMUNOGLOBULIN IgE, SERUM   160.50 kUA/L   &lt; 64.00   Very High</w:t></w:r></w:p>
          </w:body>
        </w:document>"""
        z.writestr('word/document.xml', content)
    return docx_io.getvalue()

docx_bytes = create_sample_docx()
ocr = OCRService()
extracted_text = ocr.extract_text(docx_bytes, filename="METROPOLIS_CLINICAL_LABORATORIES.docx")

print("1. Extracted Text from DOCX File:")
print(extracted_text)

print("\n2. Processed AI Document Output:")
processed = ai_pipeline.process_document(raw_text=extracted_text, filename="METROPOLIS_CLINICAL_LABORATORIES.docx")

import json
print(json.dumps(processed, indent=2))
