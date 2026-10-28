import os
import math
import re
import zlib
from typing import List, Dict, Any, Optional

class VectorEmbeddingStore:
    """
    Dense Vector Embedding Engine & Store for MedSimplify RAG System.
    Handles semantic chunking, dense vector embedding generation, and cosine similarity retrieval.
    """
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        """Attempts to load sentence-transformers model if installed and memory permits."""
        # Cloud platforms (like Render Free Tier with 512MB RAM) cannot fit PyTorch model weights in memory
        if os.environ.get("RENDER") or os.environ.get("LOW_MEMORY_MODE", "").lower() in ("true", "1") or os.environ.get("DISABLE_HEAVY_AI", "").lower() in ("true", "1"):
            print("[VectorStore] Low-memory cloud runtime detected (Render). Using lightweight 384-dim semantic embedding engine.")
            self.model = None
            return

        try:
            import psutil
            available_mb = psutil.virtual_memory().available / (1024 * 1024)
            if available_mb < 800:
                print(f"[VectorStore] Constrained system memory ({available_mb:.0f} MB available). Using lightweight 384-dim embedding engine.")
                self.model = None
                return
        except Exception:
            pass

        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            print("[VectorStore] SentenceTransformer 'all-MiniLM-L6-v2' loaded successfully.")
        except Exception as e:
            print(f"[VectorStore] SentenceTransformer init fallback to hash-weighted dense vector embedding: {e}")
            self.model = None

    def generate_embedding(self, text: str) -> List[float]:
        """
        Generates dense floating-point vector embedding (384 dimensions) for an input text string.
        """
        if not text or not text.strip():
            return [0.0] * 384

        if self.model is not None:
            try:
                embedding = self.model.encode(text, convert_to_numpy=True)
                return embedding.tolist()
            except Exception as err:
                print(f"[VectorStore] Model encode error: {err}")

        # High-performance Deterministic Semantic Subword Vector Embedding (384 dimensions)
        return self._fallback_hash_embedding(text, dim=384)

    def _fallback_hash_embedding(self, text: str, dim: int = 384) -> List[float]:
        """
        Generates normalized dense vector embeddings (384-dim) using deterministic subword CRC32 mapping.
        Guarantees deterministic cosine similarity scores without PyTorch or HuggingFace binaries.
        """
        import zlib
        words = re.findall(r'\w+', text.lower())
        vec = [0.0] * dim
        if not words:
            return vec

        for word in words:
            # Word token projection
            crc = zlib.crc32(word.encode('utf-8'))
            vec[crc % dim] += 1.0

            # Subword prefix n-grams (3 to 7 chars) for morphological semantic matching
            for i in range(3, min(len(word), 8)):
                sub_crc = zlib.crc32(word[:i].encode('utf-8'))
                vec[sub_crc % dim] += 0.5

        # L2 Normalization
        magnitude = math.sqrt(sum(x * x for x in vec))
        if magnitude > 0:
            vec = [x / magnitude for x in vec]

        return vec

    def chunk_text(self, text: str, max_chunk_length: int = 300) -> List[str]:
        """
        Splits raw text into semantic paragraph/sentence chunks.
        """
        if not text:
            return []
        
        paragraphs = text.split("\n\n")
        chunks = []
        for p in paragraphs:
            p_clean = p.strip()
            if not p_clean:
                continue
            if len(p_clean) <= max_chunk_length:
                chunks.append(p_clean)
            else:
                # Split by sentence
                sentences = re.split(r'(?<=[.!?]) +', p_clean)
                current_chunk = ""
                for s in sentences:
                    if len(current_chunk) + len(s) < max_chunk_length:
                        current_chunk += " " + s
                    else:
                        if current_chunk.strip():
                            chunks.append(current_chunk.strip())
                        current_chunk = s
                if current_chunk.strip():
                    chunks.append(current_chunk.strip())
        return chunks

    def process_report_for_vectors(self, raw_text: str = "", extracted_data: Optional[Dict] = None, simplified_summary: Optional[Dict] = None) -> List[Dict[str, Any]]:
        """
        Processes a medical report into chunked items with their respective dense vector embeddings.
        """
        chunks_payload = []

        # 1. Biomarkers / Test Table Chunks
        if extracted_data and isinstance(extracted_data, dict):
            abnormals = extracted_data.get("abnormal_findings", [])
            for item in abnormals:
                t_name = item.get("test") or item.get("parameter", "Test")
                t_val = item.get("value", "")
                t_status = item.get("status", item.get("flag", "CRITICAL"))
                t_text = f"Abnormal Test Result: {t_name} is {t_val} with status {t_status}. {item.get('explanation', '')}"
                chunks_payload.append({
                    "chunk_type": "abnormal_biomarker",
                    "text": t_text,
                    "embedding": self.generate_embedding(t_text)
                })

            test_tables = extracted_data.get("test_tables", [])
            for row in test_tables:
                p_name = row.get("parameter") or row.get("test", "Parameter")
                p_val = row.get("value", "")
                p_rng = row.get("range", "")
                p_flg = row.get("flag", "")
                row_text = f"Lab Parameter {p_name}: Value {p_val}, Reference Range {p_rng}, Flag: {p_flg}"
                chunks_payload.append({
                    "chunk_type": "table_parameter",
                    "text": row_text,
                    "embedding": self.generate_embedding(row_text)
                })

        # 2. Text Chunks from raw_text
        if raw_text:
            text_chunks = self.chunk_text(raw_text)
            for tc in text_chunks:
                chunks_payload.append({
                    "chunk_type": "raw_text_chunk",
                    "text": tc,
                    "embedding": self.generate_embedding(tc)
                })

        return chunks_payload

    @staticmethod
    def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """Computes cosine similarity between two vector embeddings."""
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0
        dot_prod = sum(a * b for a, b in zip(vec1, vec2))
        norm_a = math.sqrt(sum(a * a for a in vec1))
        norm_b = math.sqrt(sum(b * b for b in vec2))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot_prod / (norm_a * norm_b)

    def search_similar_chunks(self, query: str, stored_vector_payloads: List[Dict[str, Any]], top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieves Top-K document chunks matching query embedding vector similarity.
        """
        if not stored_vector_payloads:
            return []

        query_vec = self.generate_embedding(query)
        scored_chunks = []

        for item in stored_vector_payloads:
            chunk_text = item.get("text", "")
            chunk_vec = item.get("embedding", [])
            report_meta = item.get("report_meta", {})
            
            if not chunk_vec:
                chunk_vec = self.generate_embedding(chunk_text)

            sim = self.cosine_similarity(query_vec, chunk_vec)
            scored_chunks.append({
                "score": sim,
                "text": chunk_text,
                "type": item.get("chunk_type", "chunk"),
                "report_name": report_meta.get("file_name", "Report"),
                "report_date": report_meta.get("date", "")
            })

        # Sort descending by score
        scored_chunks.sort(key=lambda x: x["score"], reverse=True)
        return scored_chunks[:top_k]

vector_store = VectorEmbeddingStore()
