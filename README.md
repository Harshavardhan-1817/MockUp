# MOCKUP

MockUp is an AI-powered mock interview platform built to help students and job seekers practice interviews in a more realistic way.

Instead of solving random interview questions from websites, users can paste an actual job description, choose the interview type and difficulty, and go through a live interview experience with AI-generated questions, voice interaction, speech recognition, and detailed feedback.

The goal behind this project was to create something that feels closer to a real interview rather than a simple quiz app.

Live Demo: https://trymockup.vercel.app/

What it does
Generates interview questions from a job description
Supports technical, behavioral, and mixed interviews
AI reads questions aloud
Users answer using voice
Converts speech to text in real time
Evaluates answers using AI + benchmark retrieval
Gives detailed feedback and scoring
Saves interview history and previous attempts
Allows users to retake past interviews
Tech Stack
Frontend
React + Vite
Framer Motion
React Router
Axios
Supabase Auth
Web Speech API
Backend
FastAPI
Python
LangChain
Groq API
Sentence Transformers
Database
Supabase PostgreSQL
pgvector
How the interview flow works
User pastes a job description
AI extracts the role
Questions are generated based on the role and interview type
AI reads each question aloud
User answers verbally
Speech recognition converts answers into text
Backend evaluates the response
Final scorecard is generated with feedback
Interview gets saved to the dashboard
Features
AI Question Generation

Questions are dynamically generated from the provided job description instead of using fixed question banks.

Voice-Based Interview Experience

The app uses speech synthesis and speech recognition to create a more natural interview flow.

RAG-Based Evaluation

Answers are evaluated using:

LLM scoring
Benchmark similarity search
Context-aware feedback
Dashboard & History

Users can:

View previous interviews
Track scores
Retake interviews
Monitor progress
## Project Structure

1. Backend
   - app/
     - auth.py
     - database.py
     - evaluate.py
     - questions.py
     - rag.py
     - seed_benchmarks.py
   - main.py
   - .env

2. Frontend
   - src/
     - pages/
     - App.jsx
     - supabase.js
     - index.css

3. README.md
Running the project locally
Backend
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

py -3.10 -m uvicorn main:app --reload

Backend runs on:

https://mockup-backend1.onrender.com

Frontend
cd frontend

npm install

npm run dev

Frontend runs on:

https://vercel.com/harshavardhan-1817s-projects/mockup

Environment Variables


SUPABASE_URL=

SUPABASE_KEY=

GROQ_API_KEY=

Current Status

Working features:

Authentication
AI question generation
Voice interaction
Speech-to-text
AI evaluation
Interview history
Dashboard
Retake flow

Still improving:

Mobile responsiveness
PDF export
Coding interview mode
Progress analytics
Better UI polish
Why I built this

Most interview prep platforms either feel too generic or too static.

I wanted to build something that feels more interactive and closer to an actual interview experience while also giving useful feedback instead of just showing correct answers.

This project also helped me explore:

AI integrations
RAG systems
Full-stack development
Voice APIs
Vector search
Real-time workflows
Future Plans
Add coding interview support
Add live analytics and charts
Improve evaluation accuracy
Add resume-based interviews
Improve mobile UI
Deploy backend fully for production use
Feedback

If you have suggestions or ideas for improvement, feel free to open an issue or contribute.

Built by Harsha.
