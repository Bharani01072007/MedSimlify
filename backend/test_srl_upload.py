import requests
import json
import os

pdf_path = r"e:\Medsimplify\Documentation\Input\SRL DIAGNOSTICS.pdf"

if not os.path.exists(pdf_path):
    print("PDF path does not exist!")
    exit(1)

url = "http://localhost:8000/api/reports/upload"

with open(pdf_path, "rb") as f:
    files = {"file": ("SRL DIAGNOSTICS.pdf", f, "application/pdf")}
    data = {"patient_id": "1", "report_type": "Lab Report"}
    
    print(f"Uploading {pdf_path} to {url}...")
    try:
        response = requests.post(url, files=files, data=data)
        print("Status Code:", response.status_code)
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print("Upload Error:", e)
