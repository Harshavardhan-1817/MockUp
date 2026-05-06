# import os
# import json
# import numpy as np
# from sentence_transformers import SentenceTransformer
# from app.database import supabase

# model = SentenceTransformer('all-MiniLM-L6-v2')

# def embed_text(text: str) -> list:
#     embedding = model.encode(text, normalize_embeddings=True)
#     return embedding.tolist()

# def store_benchmark(question: str, answer: str, quality_score: float, interview_type: str, difficulty: str):
#     embedding = embed_text(question + " " + answer)
#     supabase.table("interview_benchmarks").insert({
#         "question": question,
#         "answer": answer,
#         "quality_score": quality_score,
#         "interview_type": interview_type,
#         "difficulty": difficulty,
#         "embedding": embedding
#     }).execute()

# def get_similar_benchmarks(question: str, answer: str, top_k: int = 3) -> list:
#     try:
#         query_text = question + " " + answer
#         embedding = embed_text(query_text)
        
#         result = supabase.rpc("match_benchmarks", {
#             "query_embedding": embedding,
#             "match_threshold": 0.3,
#             "match_count": top_k
#         }).execute()
        
#         return result.data or []
#     except Exception as e:
#         print(f"RAG retrieval error: {e}")
#         return []
import os
import hashlib
import numpy as np
from app.database import supabase

def embed_text(text: str) -> list:
    try:
        from groq import Groq
        # Use a simple hash-based embedding for deployment
        # This is a fallback — replace with OpenAI embeddings for production
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    except:
        pass
    
    # Lightweight TF-IDF style embedding using numpy
    words = text.lower().split()
    vocab_size = 384
    embedding = np.zeros(vocab_size)
    for word in words:
        idx = int(hashlib.md5(word.encode()).hexdigest(), 16) % vocab_size
        embedding[idx] += 1
    norm = np.linalg.norm(embedding)
    if norm > 0:
        embedding = embedding / norm
    return embedding.tolist()

def store_benchmark(question: str, answer: str, quality_score: float, interview_type: str, difficulty: str):
    embedding = embed_text(question + " " + answer)
    supabase.table("interview_benchmarks").insert({
        "question": question,
        "answer": answer,
        "quality_score": quality_score,
        "interview_type": interview_type,
        "difficulty": difficulty,
        "embedding": embedding
    }).execute()

def get_similar_benchmarks(question: str, answer: str, top_k: int = 3) -> list:
    try:
        query_text = question + " " + answer
        embedding = embed_text(query_text)
        result = supabase.rpc("match_benchmarks", {
            "query_embedding": embedding,
            "match_threshold": 0.1,
            "match_count": top_k
        }).execute()
        return result.data or []
    except Exception as e:
        print(f"RAG retrieval error: {e}")
        return []