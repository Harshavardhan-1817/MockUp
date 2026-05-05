import re
import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import json

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.1-8b-instant"
)

def extract_role_name(jd: str) -> str:
    try:
        response = llm.invoke(f"Extract only the job title/role name from this job description. Return only the role name, nothing else, maximum 4 words. JD: {jd[:500]}")
        return response.content.strip()
    except:
        return "Interview Session"

def generate_questions(jd: str, interview_type: str, difficulty: str, count: int):
    prompt = f"""Generate {count} interview questions for this job.

Job: {jd}
Type: {interview_type}
Level: {difficulty}

Respond with ONLY a valid JSON array. No extra text, no markdown, no backticks:
[{{"question":"your question","type":"{interview_type}","what_to_look_for":"what to look for","ideal_answer_points":["point1","point2"]}}]"""

    try:
        response = llm.invoke(prompt)
        text = response.content.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        
        json_match = re.search(r'\[.*\]', text, re.DOTALL)
        if json_match:
            text = json_match.group()
        
        parsed = json.loads(text)
        print(f"Generated {len(parsed)} questions OK")
        return parsed
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        print(f"Raw text: {text[:300]}")
        # Return a fallback question so interview doesn't break
        return [{"question": f"Tell me about your experience relevant to this {interview_type} role.", "type": interview_type, "what_to_look_for": "General experience and fit", "ideal_answer_points": ["Relevant experience", "Clear communication", "Enthusiasm"]}]
    except Exception as e:
        print(f"Generation error: {e}")
        raise e
def extract_role_name(jd: str) -> str:
    try:
        response = llm.invoke(f"""Extract ONLY the job title from this job description. 
Examples of good outputs: "Senior React Developer", "Data Scientist", "ML Engineer", "Product Manager"
Return ONLY the job title, maximum 4 words, nothing else.
JD: {jd[:800]}""")
        role = response.content.strip().strip('"').strip("'")
        # Clean up any extra text
        if len(role) > 40:
            role = role[:40]
        return role
    except:
        return "Interview Session"
