import os
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app
from app.services.ai.vector_store import vector_store

client = TestClient(app)

def test_vector_store_embeddings():
    print("\n--- Test 0: Dense Vector Embedding & Cosine Similarity ---")
    vec1 = vector_store.generate_embedding("Platelet count is 80,000 /uL (Low)")
    vec2 = vector_store.generate_embedding("What are my platelet levels?")
    assert len(vec1) == 384, f"Expected 384 vector dimensions, got {len(vec1)}"
    sim = vector_store.cosine_similarity(vec1, vec2)
    print(f"Vector dim: {len(vec1)}, Cosine Similarity score: {sim:.4f}")
    assert sim > 0.0, "Expected positive cosine similarity"
    print("✅ Dense Vector Embedding test PASSED!")

def test_general_ai_assistant():
    print("\n--- Test 1: General AI Assistant (No Report Selected) ---")
    payload = {
        "question": "What should I eat when I have a fever?",
        "language": "en"
    }
    response = client.post("/api/chat/ai/ask", json=payload)
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    print(f"Question: {data.get('question')}")
    print(f"Is RAG: {data.get('is_rag')}")
    print(f"Answer snippet:\n{data.get('answer')[:200]}...")
    assert data.get('is_rag') is False, "Expected is_rag to be False for general questions"
    print("✅ General AI Assistant test PASSED!")

def test_covid_precautions_query():
    print("\n--- Test 1b: COVID-19 Precautions Query (No Report Selected) ---")
    payload = {
        "question": "what is the steps have a precaution for not to get covid19",
        "language": "en"
    }
    response = client.post("/api/chat/ai/ask", json=payload)
    assert response.status_code == 200
    data = response.json()
    answer = data.get("answer", "")
    assert "COVID-19" in answer or "Mask" in answer or "Hygiene" in answer
    assert "I am here to answer everyday health questions" not in answer
    print("✅ COVID-19 Precautions AI response test PASSED!")

def test_rag_ai_assistant():
    print("\n--- Test 2: Dense Vector RAG AI Assistant with Selected Lab Reports ---")

    # Fetch available reports to get a valid report ID
    reports_res = client.get("/api/reports/?patient_id=1")
    assert reports_res.status_code == 200
    reports = reports_res.json()
    assert len(reports) > 0, "Expected at least 1 report in DB"
    
    selected_id = reports[0]["id"]
    report_name = reports[0].get("file_name", "report")
    print(f"Selected Report ID: {selected_id} ({report_name})")

    payload = {
        "question": "What is my platelet count and dengue test result in this report?",
        "language": "en",
        "report_ids": [selected_id]
    }
    response = client.post("/api/chat/ai/ask", json=payload)
    print(f"Status Code: {response.status_code}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    print(f"Question: {data.get('question')}")
    print(f"Is RAG: {data.get('is_rag')}")
    print(f"Sources: {data.get('sources')}")
    print(f"Answer snippet:\n{data.get('answer')[:300]}...")
    assert data.get('is_rag') is True, "Expected is_rag to be True for RAG queries"
    assert len(data.get('sources', [])) > 0, "Expected non-empty sources list for RAG queries"
    print("✅ Dense Vector RAG AI Assistant test PASSED!")

if __name__ == "__main__":
    test_vector_store_embeddings()
    test_general_ai_assistant()
    test_covid_precautions_query()
    test_rag_ai_assistant()
    print("\n🎉 ALL BACKEND DENSE VECTOR RAG & GENERAL AI TESTS PASSED SUCCESSFULLY!")
