import fitz
import pypdf
import pdfplumber

pdf_path = r"e:\Medsimplify\Documentation\Input\SRL DIAGNOSTICS.pdf"

print("--- FITZ (PyMuPDF) ---")
try:
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    print("Length:", len(text))
    print(text[:1000])
except Exception as e:
    print("Fitz error:", e)

print("\n--- PYPDF ---")
try:
    reader = pypdf.PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    print("Length:", len(text))
    print(text[:1000])
except Exception as e:
    print("PyPDF error:", e)

print("\n--- PDFPLUMBER ---")
try:
    with pdfplumber.open(pdf_path) as pdf:
        text = "\n".join(p.extract_text() or "" for p in pdf.pages)
    print("Length:", len(text))
    print(text[:1000])
except Exception as e:
    print("PDFPlumber error:", e)
