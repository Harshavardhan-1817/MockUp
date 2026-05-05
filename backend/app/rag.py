import os
import json
import numpy as np
from sentence_transformers import SentenceTransformer
from app.database import supabase

model = SentenceTransformer('all-MiniLM-L6-v2')

def embed_text(text: str) -> list:
    embedding = model.encode(text, normalize_embeddings=True)
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
            "match_threshold": 0.3,
            "match_count": top_k
        }).execute()
        
        return result.data or []
    except Exception as e:
        print(f"RAG retrieval error: {e}")
        return []