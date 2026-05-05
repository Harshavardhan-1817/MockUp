import os
import json
import re
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from app.rag import get_similar_benchmarks

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)

def evaluate_answer(
    question: str,
    answer: str,
    jd: str,
    difficulty: str,
    interview_type: str,
    ideal_points: list,
    eye_contact: float,
    confidence: float,
    filler_words: int,
    answer_duration: int
):
    # Client-side metrics
    filler_penalty = min(filler_words * 0.3, 3.0)

    if answer_duration < 15:
        length_score = 3.0
        length_feedback = "Answer too short — under 15 seconds"
    elif answer_duration > 85:
        length_score = 7.0
        length_feedback = "Answer slightly long — try to be more concise"
    else:
        length_score = 10.0
        length_feedback = "Good answer length"

    if len(answer.split()) < 20:
        length_score = 2.0
        length_feedback = "Answer too brief — needs more detail"

    # RAG — get similar benchmark answers
    benchmarks = get_similar_benchmarks(question, answer, top_k=3)

    # Build benchmark context for the prompt
    benchmark_context = ""
    if benchmarks:
        benchmark_context = "\n\nREFERENCE ANSWERS FROM BENCHMARK DATABASE:\n"
        for i, b in enumerate(benchmarks):
            benchmark_context += f"""
Reference {i+1} (Score: {b['quality_score']}/10, Similarity: {round(b.get('similarity', 0), 2)}):
Question: {b['question']}
Answer: {b['answer']}
---"""
    else:
        benchmark_context = "\n\n(No similar benchmarks found — evaluate based on rubric only)"

    prompt = f"""You are a strict, experienced interview panel evaluator with 15 years of hiring experience.

EVALUATION CONTEXT:
- Job Description: {jd}
- Difficulty Level: {difficulty}
- Interview Type: {interview_type}
- Question Asked: {question}
- Key points expected: {ideal_points}

STUDENT'S ANSWER:
"{answer}"
{benchmark_context}

CRITICAL EVALUATION RULES:
1. NEVER do keyword matching. A keyword used without proper context = 0 credit
2. Generic statements ("communication is important", "I am a team player") with NO specific example = maximum 3/10
3. Vague answers ("I worked on a project", "I solved the problem") with no specifics = maximum 3/10
4. If the answer has specific details, numbers, outcomes, timeframes = reward appropriately
5. Compare against the reference answers above — if the student's answer is clearly worse, score lower
6. Score 5 = average answer, 7 = genuinely good, 9+ = exceptional with specific details and outcomes
7. Be especially calibrated for {difficulty} level

SCORE THESE 4 DIMENSIONS (integer 0-10 each):

RELEVANCE (0-10):
- 0-3: Doesn't answer the question or completely off-topic
- 4-6: Partially addresses the question
- 7-10: Directly and fully answers what was asked

SPECIFICITY (0-10):
- 0-3: No specific details, all generic statements
- 4-6: Some specifics but missing numbers, outcomes, or timeframes
- 7-10: Rich with specific examples, numbers, outcomes, real scenarios

CORRECTNESS (0-10):
- 0-3: Concepts used incorrectly or in wrong context
- 4-6: Mostly correct but some misuse or gaps
- 7-10: All concepts correctly applied in proper context

STAR_STRUCTURE (0-10):
- For behavioral: Situation(2.5) + Task(2.5) + Action(2.5) + Result(2.5)
- For technical: Problem(2.5) + Approach(2.5) + Solution(2.5) + Outcome(2.5)
- Score each component present as 2.5 points

Return ONLY this exact JSON, no extra text:
{{
  "relevance": 0,
  "specificity": 0,
  "correctness": 0,
  "star_structure": 0,
  "what_was_good": "one specific sentence about the strongest part",
  "what_was_missing": "one specific sentence about the biggest gap",
  "ideal_answer_summary": "what a 9/10 answer would have included specifically",
  "improvement_tip": "one specific actionable tip for this student"
}}"""

    response = llm.invoke(prompt)
    text = response.content.strip()

    json_match = re.search(r'\{.*\}', text, re.DOTALL)
    if json_match:
        text = json_match.group()
    else:
        text = text.replace("```json", "").replace("```", "").strip()

    llm_scores = json.loads(text)

    # Weighted answer quality
    answer_quality = (
        llm_scores["relevance"] * 0.30 +
        llm_scores["specificity"] * 0.30 +
        llm_scores["correctness"] * 0.25 +
        llm_scores["star_structure"] * 0.15
    )

    eye_score = eye_contact * 10
    confidence_score = max(0, confidence * 10 - filler_penalty)

    # RAG bonus/penalty — if benchmarks found, adjust score
    rag_adjustment = 0
    if benchmarks:
        avg_benchmark_score = sum(b['quality_score'] for b in benchmarks) / len(benchmarks)
        similarity = benchmarks[0].get('similarity', 0.5)
        # If highly similar to a low-scoring benchmark, penalise
        # If highly similar to a high-scoring benchmark, small bonus
        if similarity > 0.7:
            if avg_benchmark_score >= 8:
                rag_adjustment = 0.3
            elif avg_benchmark_score <= 3:
                rag_adjustment = -0.5

    final_score = round(
        min(10, max(0,
            answer_quality * 0.70 +
            eye_score * 0.15 +
            confidence_score * 0.15 +
            rag_adjustment
        )),
        1
    )

    return {
        "final_score": final_score,
        "answer_quality": round(answer_quality, 1),
        "dimensions": {
            "relevance": llm_scores["relevance"],
            "specificity": llm_scores["specificity"],
            "correctness": llm_scores["correctness"],
            "star_structure": llm_scores["star_structure"]
        },
        "eye_contact_score": round(eye_score, 1),
        "confidence_score": round(confidence_score, 1),
        "length_feedback": length_feedback,
        "filler_words_count": filler_words,
        "what_was_good": llm_scores["what_was_good"],
        "what_was_missing": llm_scores["what_was_missing"],
        "ideal_answer_summary": llm_scores["ideal_answer_summary"],
        "improvement_tip": llm_scores["improvement_tip"],
        "rag_benchmarks_used": len(benchmarks)
    }