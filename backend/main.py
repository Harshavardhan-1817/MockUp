from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from app.auth import sign_up, sign_in, sign_out
from app.questions import generate_questions, extract_role_name
from app.evaluate import evaluate_answer
from app.database import supabase

app = FastAPI(title="MockUp API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://mockup.vercel.app", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SignUpRequest(BaseModel):
    email: str
    password: str

class SignInRequest(BaseModel):
    email: str
    password: str

class QuestionRequest(BaseModel):
    job_description: str
    interview_type: str
    difficulty: str
    count: int = 5

class EvaluateRequest(BaseModel):
    question: str
    answer: str
    job_description: str
    difficulty: str
    interview_type: str
    ideal_points: List[str]
    eye_contact: float = 0.8
    confidence: float = 0.7
    filler_words: int = 0
    answer_duration: int = 60

class SaveInterviewRequest(BaseModel):
    role_name: str = "Interview Session"
    user_id: str
    job_description: str
    interview_type: str
    difficulty: str
    questions: list
    results: list
    overall_score: float

@app.get("/")
def root():
    return {"status": "MockUp API is live", "version": "1.0"}

@app.post("/auth/signup")
def signup(req: SignUpRequest):
    result = sign_up(req.email, req.password)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.post("/auth/signin")
def signin(req: SignInRequest):
    result = sign_in(req.email, req.password)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.post("/evaluate")
def evaluate(req: EvaluateRequest):
    try:
        result = evaluate_answer(
            req.question, req.answer, req.job_description,
            req.difficulty, req.interview_type, req.ideal_points,
            req.eye_contact, req.confidence, req.filler_words,
            req.answer_duration
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/interview/save")
def save_interview(req: SaveInterviewRequest):
    try:
        data = supabase.table("interviews").insert({
            "user_id": req.user_id,
            "job_description": req.job_description,
            "role_name": req.role_name,
            "interview_type": req.interview_type,
            "difficulty": req.difficulty,
            "questions": req.questions,
            "results": req.results,
            "overall_score": req.overall_score
        }).execute()
        return {"success": True, "data": data.data}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/interview/history/{user_id}")
def get_history(user_id: str):
    try:
        data = supabase.table("interviews")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .execute()
        return {"history": data.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.post("/questions/generate")
def questions(req: QuestionRequest):
    try:
        qs = generate_questions(
            req.job_description,
            req.interview_type,
            req.difficulty,
            req.count
        )
        role_name = extract_role_name(req.job_description)
        return {"questions": qs, "role_name": role_name}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))