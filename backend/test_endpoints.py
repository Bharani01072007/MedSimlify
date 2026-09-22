import requests

BASE_URL = "http://localhost:8000/api"

print("1. Testing Health Endpoint...")
try:
    r = requests.get("http://localhost:8000/health")
    print(f"Health Status: {r.status_code} - {r.json()}")
except Exception as e:
    print(f"Health Error: {e}")

print("\n2. Testing Chat Messages...")
try:
    r = requests.get(f"{BASE_URL}/chat/messages/all?chat_id=1")
    print(f"Chat Status: {r.status_code} - Messages Count: {len(r.json())}")
except Exception as e:
    print(f"Chat Error: {e}")

print("\n3. Testing Login...")
try:
    r = requests.post(f"{BASE_URL}/auth/login", json={"email": "patient@medsimplify.com", "password": "password123"})
    print(f"Login Status: {r.status_code} - Token: {r.json().get('access_token', 'No token')[:20]}...")
except Exception as e:
    print(f"Login Error: {e}")
