import fitz
import os
import io

pdf_path = r"e:\Medsimplify\Documentation\Input\SRL DIAGNOSTICS.pdf"

if not os.path.exists(pdf_path):
    print("PDF path does not exist!")
    exit(1)

doc = fitz.open(pdf_path)
print("Page count:", len(doc))

full_text = ""
for i, page in enumerate(doc):
    text = page.get_text()
    print(f"--- Page {i+1} embedded text length: {len(text)} ---")
    if text:
        print(text[:500])
    full_text += text

if not full_text.strip():
    print("\nNo embedded text found! Rendering pages as images for OCR...")
    try:
        import pytesseract
        from PIL import Image
        for i, page in enumerate(doc):
            pix = page.get_pixmap(dpi=200)
            img = Image.open(io.BytesIO(pix.tobytes("png")))
            ocr_text = pytesseract.image_to_string(img)
            print(f"--- Page {i+1} OCR text length: {len(ocr_text)} ---")
            print(ocr_text[:500])
    except Exception as e:
        print("OCR Error:", e)
