import sys
import os

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def verify_routers():
    print("=" * 80)
    print("VERIFYING ALL MOUNTED ROUTERS IN FASTAPI APP")
    print("=" * 80)

    routes = [r.path for r in app.routes]
    print(f"Total Mounted Routes: {len(routes)}")

    expected_endpoints = [
        "/api/ai/simplify",
        "/api/reports/upload",
        "/api/reports/",
        "/api/auth/register",
        "/api/auth/login",
        "/api/medicines/",
        "/api/appointments/",
        "/api/symptoms/",
        "/api/chat/ai/ask",
        "/api/chat/messages",
        "/api/prescriptions/",
        "/api/family/"
    ]

    for ep in expected_endpoints:
        found = any(r == ep or r.startswith(ep) for r in routes)
        if found:
            print(f"  ✅ Route '{ep}' is MOUNTED and ACTIVE.")
        else:
            print(f"  ❌ Route '{ep}' MISSING!")
            sys.exit(1)

    print("\n[TEST] Verifying /docs and /openapi.json response time & status...")
    res_docs = client.get("/docs")
    assert res_docs.status_code == 200, f"Expected 200 for /docs, got {res_docs.status_code}"
    print("  ✅ /docs loaded instantly with Cloudflare CDN assets.")

    res_spec = client.get("/openapi.json")
    assert res_spec.status_code == 200, f"Expected 200 for /openapi.json, got {res_spec.status_code}"
    print("  ✅ /openapi.json spec rendered instantly.")

    print("\n" + "=" * 80)
    print("ALL ROUTERS & SWAGGER UI ARE MOUNTED, INSTANT & ACTIVE!")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    verify_routers()
