import sys
import os
import time

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app

def test_openapi():
    t0 = time.time()
    schema = app.openapi()
    t1 = time.time()
    print(f"OpenAPI Schema Generated in {t1 - t0:.4f} seconds!")
    print(f"Total Routes in Spec: {len(schema.get('paths', {}))}")

if __name__ == "__main__":
    test_openapi()
