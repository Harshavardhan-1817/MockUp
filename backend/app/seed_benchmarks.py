import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.rag import store_benchmark

benchmarks = [
    # Behavioral - Fresher - High quality (8-9/10)
    {
        "question": "Tell me about a time you worked in a team to solve a difficult problem.",
        "answer": "During my final year project, our team of 4 was building a real-time chat application. Two weeks before the deadline, we discovered a critical bug where messages were being dropped under high load. I took ownership of debugging the issue. I set up load testing using Locust, identified that the WebSocket connections were timing out due to a missing heartbeat mechanism. I implemented a ping-pong heartbeat every 30 seconds, tested it under 500 concurrent users, and the drop rate went from 15% to 0.2%. We delivered on time and the project scored 92/100.",
        "quality_score": 9.0,
        "interview_type": "behavioral",
        "difficulty": "fresher"
    },
    {
        "question": "Tell me about a time you worked in a team to solve a difficult problem.",
        "answer": "In my internship at a startup, our backend team hit a performance bottleneck — API response times were averaging 4 seconds. I analyzed the slow queries using Django Debug Toolbar and found 3 N+1 query issues. I rewrote those using select_related and prefetch_related, reducing response time to 400ms. I documented the changes and presented them to the team lead, who then made it a coding standard for the whole team. This directly improved user retention metrics by 12% according to the product team.",
        "quality_score": 9.0,
        "interview_type": "behavioral",
        "difficulty": "fresher"
    },
    {
        "question": "Tell me about a time you worked in a team to solve a difficult problem.",
        "answer": "We worked together on a project and solved the problem as a team. Everyone contributed and we finished on time. I helped with the coding part and we communicated well.",
        "quality_score": 2.0,
        "interview_type": "behavioral",
        "difficulty": "fresher"
    },
    {
        "question": "Describe a situation where you had to learn something quickly under pressure.",
        "answer": "Three days before a hackathon demo, our team decided to add a machine learning component for image classification. I had never used TensorFlow before. I spent 12 hours going through the TensorFlow documentation and fast.ai course, built a MobileNetV2-based classifier fine-tuned on our dataset of 500 images, and achieved 89% accuracy. I integrated it into our Flask API the night before the demo. We won second place and the judges specifically praised the ML component.",
        "quality_score": 9.5,
        "interview_type": "behavioral",
        "difficulty": "fresher"
    },
    {
        "question": "Describe a situation where you had to learn something quickly under pressure.",
        "answer": "I once had to learn a new programming language quickly for a project. I watched some YouTube videos and read documentation. It was challenging but I managed to complete the task.",
        "quality_score": 2.5,
        "interview_type": "behavioral",
        "difficulty": "fresher"
    },
    {
        "question": "Tell me about a project you are most proud of.",
        "answer": "I built a mental health chatbot using Python and Streamlit that conducts PHQ-9 assessments and provides personalized wellness recommendations. The challenge was making the NLP accurate enough to detect distress signals. I used spaCy for intent detection and fine-tuned a BERT model on mental health conversation datasets. The app served 200+ users during a college mental health week. I measured its effectiveness by tracking user engagement — average session length was 8 minutes, significantly higher than the 2-minute industry average for chatbots.",
        "quality_score": 9.0,
        "interview_type": "behavioral",
        "difficulty": "fresher"
    },
    {
        "question": "Tell me about a project you are most proud of.",
        "answer": "I made a chatbot project. It helps people with mental health. I used Python and some NLP libraries. It was a good project and people liked it.",
        "quality_score": 2.0,
        "interview_type": "behavioral",
        "difficulty": "fresher"
    },
    # Technical - Fresher
    {
        "question": "Explain how you would design a REST API for a todo application.",
        "answer": "I would design the API with these endpoints: GET /todos to list all todos with pagination support using limit and offset parameters, POST /todos to create a new todo with validation for required fields like title and due_date, GET /todos/{id} to fetch a specific todo, PUT /todos/{id} to update it, and DELETE /todos/{id} to remove it. I'd use HTTP status codes correctly — 201 for creation, 404 for not found, 422 for validation errors. For authentication I'd add JWT tokens in Authorization headers. I'd also add filtering like GET /todos?status=completed and sorting like GET /todos?sort=due_date. The response would always be JSON with a consistent structure including data, error, and meta fields.",
        "quality_score": 9.0,
        "interview_type": "technical",
        "difficulty": "fresher"
    },
    {
        "question": "Explain how you would design a REST API for a todo application.",
        "answer": "I would create endpoints for creating, reading, updating and deleting todos. I would use GET for reading, POST for creating, PUT for updating and DELETE for deleting. The API would return JSON responses.",
        "quality_score": 3.0,
        "interview_type": "technical",
        "difficulty": "fresher"
    },
    {
        "question": "What is the difference between SQL and NoSQL databases? When would you use each?",
        "answer": "SQL databases like PostgreSQL and MySQL store data in structured tables with predefined schemas and use ACID transactions — ideal when data relationships matter and consistency is critical, like in financial systems or e-commerce order management. NoSQL databases like MongoDB or Redis store unstructured or semi-structured data — MongoDB uses documents, Redis uses key-value pairs. I'd choose NoSQL when I need horizontal scaling for high write throughput, flexible schemas that change frequently, or when storing unstructured data like user activity logs or social media posts. For example, in a social media app I'd use PostgreSQL for user accounts and relationships but MongoDB for storing post content and comments since their structure varies widely.",
        "quality_score": 9.0,
        "interview_type": "technical",
        "difficulty": "fresher"
    },
    {
        "question": "What is the difference between SQL and NoSQL databases? When would you use each?",
        "answer": "SQL databases use structured query language and have tables with rows and columns. NoSQL databases are more flexible and don't use tables. SQL is used for structured data and NoSQL for unstructured data.",
        "quality_score": 2.5,
        "interview_type": "technical",
        "difficulty": "fresher"
    },
    {
        "question": "How does a hash map work internally?",
        "answer": "A hash map stores key-value pairs using a hash function to convert keys into array indices. When you insert a key-value pair, the hash function computes an index, and the value is stored at that position in an underlying array. For collision handling — when two keys hash to the same index — most implementations use chaining, where each bucket holds a linked list of entries, or open addressing, where we probe for the next empty slot. Python's dict uses open addressing with a technique called random probing. The average time complexity for get, put, and delete is O(1) but degrades to O(n) in worst case with many collisions. The load factor — ratio of entries to buckets — determines when to resize. Python resizes when load factor exceeds 2/3, doubling the array size to maintain performance.",
        "quality_score": 9.5,
        "interview_type": "technical",
        "difficulty": "fresher"
    },
    {
        "question": "How does a hash map work internally?",
        "answer": "A hash map stores key value pairs. It uses a hash function to find where to store the value. It is O(1) for lookups. Collisions can happen when two keys have the same hash.",
        "quality_score": 3.5,
        "interview_type": "technical",
        "difficulty": "fresher"
    },
    # Behavioral - Mid level
    {
        "question": "Tell me about a time you had to deal with a difficult stakeholder.",
        "answer": "At my previous role, the product manager kept changing requirements mid-sprint which was causing the team to miss deadlines. Instead of escalating immediately, I scheduled a 1-on-1 with them to understand their perspective. I learned they were receiving late feedback from clients. I proposed a solution — a weekly 30-minute sync between the PM, one engineer, and the client. This gave the PM early visibility into client needs before sprint planning. Over the next 3 sprints, mid-sprint changes dropped by 70% and we shipped on time consistently. The PM later mentioned this in my performance review as a key contribution.",
        "quality_score": 9.0,
        "interview_type": "behavioral",
        "difficulty": "mid"
    },
    {
        "question": "Tell me about a time you had to deal with a difficult stakeholder.",
        "answer": "I had a difficult manager once who kept changing requirements. I talked to them and explained the impact on the team. We came to an agreement and things got better after that.",
        "quality_score": 3.0,
        "interview_type": "behavioral",
        "difficulty": "mid"
    },
    {
        "question": "Describe a time you improved a system's performance significantly.",
        "answer": "Our recommendation engine was taking 8 seconds to respond, causing 40% of users to abandon the page. I profiled the system using cProfile and found that 90% of time was spent in a nested loop computing cosine similarities for all user-item pairs. I replaced this with a precomputed similarity matrix using numpy that was refreshed every 6 hours, and added Redis caching for the top 1000 most active users. Response time dropped to 120ms — a 98% improvement. User engagement on the recommendation section increased by 35% in the following month as measured by our analytics dashboard.",
        "quality_score": 9.5,
        "interview_type": "behavioral",
        "difficulty": "mid"
    },
    {
        "question": "Describe a time you improved a system's performance significantly.",
        "answer": "I optimized a slow database query by adding indexes and the performance improved significantly. The users were happier and the system ran faster.",
        "quality_score": 2.5,
        "interview_type": "behavioral",
        "difficulty": "mid"
    },
    # Technical - Mid level
    {
        "question": "How would you design a URL shortening service like bit.ly?",
        "answer": "I'd design this as a system that handles two operations: shorten a URL and redirect. For shortening, I'd generate a 6-character base62 string from a counter using a distributed ID generator like Snowflake to avoid collisions. I'd store the mapping in a PostgreSQL table with columns for short_code, original_url, user_id, created_at, and expiry. For redirection, I'd add a Redis cache layer — since 80% of traffic hits 20% of URLs, caching popular redirects reduces DB load by 90%. The redirect endpoint does a cache lookup first, falls back to DB, returns 301 for permanent redirects. For scale, I'd use a CDN for the redirect service, horizontal scaling with a load balancer, and database read replicas. This design handles 100K redirects per second with sub-10ms response times.",
        "quality_score": 9.5,
        "interview_type": "technical",
        "difficulty": "mid"
    },
    {
        "question": "How would you design a URL shortening service like bit.ly?",
        "answer": "I would create a database with original URLs and short codes. When a user submits a URL, I generate a random short code and store the mapping. When someone visits the short URL, I look up the original URL and redirect them.",
        "quality_score": 3.5,
        "interview_type": "technical",
        "difficulty": "mid"
    },
    {
        "question": "Explain the concept of database indexing and when you would use it.",
        "answer": "A database index is a data structure — typically a B-tree — that allows the database to find rows without scanning the entire table. Without an index on a column, a query like WHERE email='user@example.com' requires O(n) full table scan. With a B-tree index, it's O(log n). I use indexes on columns frequently used in WHERE clauses, JOIN conditions, and ORDER BY. However, indexes have a cost — they slow down INSERT, UPDATE, and DELETE since the index must be updated. I avoid indexing on low-cardinality columns like boolean fields since the selectivity is poor. Composite indexes are useful for multi-column queries — the order matters, so an index on (user_id, created_at) supports queries filtering by user_id alone or by both, but not created_at alone due to the leftmost prefix rule.",
        "quality_score": 9.0,
        "interview_type": "technical",
        "difficulty": "mid"
    },
    {
        "question": "Explain the concept of database indexing and when you would use it.",
        "answer": "Database indexes help speed up queries. They work like an index in a book — instead of reading every page, you can jump to the right section. You should use indexes on columns that are frequently searched.",
        "quality_score": 3.0,
        "interview_type": "technical",
        "difficulty": "mid"
    },
    # Mixed types
    {
        "question": "Where do you see yourself in 5 years?",
        "answer": "In 5 years I want to be a senior engineer who can independently architect and deliver complex AI systems end-to-end. More specifically, I want to have led at least 2-3 significant projects from design to production, mentored junior engineers, and developed deep expertise in MLOps and large-scale data systems. I'm particularly interested in the intersection of AI and product — building systems that have measurable real-world impact. I see this role as the right place to build those skills because of the scale of problems you solve and the engineering culture you've described.",
        "quality_score": 8.5,
        "interview_type": "behavioral",
        "difficulty": "fresher"
    },
    {
        "question": "Where do you see yourself in 5 years?",
        "answer": "I want to grow as a developer and learn new technologies. I hope to be in a senior position and contribute more to the company.",
        "quality_score": 2.0,
        "interview_type": "behavioral",
        "difficulty": "fresher"
    },
    {
        "question": "How would you handle a production outage at 3am?",
        "answer": "First I'd check our monitoring dashboard — Datadog or Grafana — to identify the spike or anomaly. I'd look at error rates, latency, and resource utilization simultaneously. I'd check recent deployments in our CI/CD pipeline — if a deployment happened in the last hour, that's the first suspect and I'd initiate a rollback. While the rollback runs, I'd notify stakeholders via our incident channel with a brief status update. I'd check application logs for error patterns, look at database connection pools, and verify third-party service status pages if we have external dependencies. Once the immediate issue is resolved, I'd write a post-mortem within 24 hours covering timeline, root cause, impact, and preventive measures to avoid recurrence.",
        "quality_score": 9.5,
        "interview_type": "technical",
        "difficulty": "mid"
    },
    {
        "question": "How would you handle a production outage at 3am?",
        "answer": "I would wake up and check what the issue is. I would look at the logs and try to fix the problem. I would notify my team and work on resolving it as quickly as possible.",
        "quality_score": 2.0,
        "interview_type": "technical",
        "difficulty": "mid"
    },
    {
        "question": "Explain how you would implement authentication in a web application.",
        "answer": "I'd implement JWT-based authentication. On login, the server validates credentials, generates a JWT containing user_id and role with a 15-minute expiry signed with a secret key, and returns it alongside a refresh token stored in an httpOnly cookie. The short expiry limits damage if a token is stolen. For each authenticated request, the client sends the JWT in the Authorization header as Bearer token. The server validates the signature and expiry — no database lookup needed since JWTs are self-contained. For token refresh, the client sends the refresh token cookie, server validates it against a whitelist in Redis, and issues a new JWT. On logout, I invalidate the refresh token from Redis. I'd also implement rate limiting on the login endpoint to prevent brute force attacks.",
        "quality_score": 9.5,
        "interview_type": "technical",
        "difficulty": "mid"
    },
    {
        "question": "Explain how you would implement authentication in a web application.",
        "answer": "I would use username and password login. The server checks if the credentials are correct and creates a session. The user stays logged in until they log out. I would also use HTTPS for security.",
        "quality_score": 2.5,
        "interview_type": "technical",
        "difficulty": "fresher"
    },
    {
        "question": "What is your approach to writing clean, maintainable code?",
        "answer": "I follow several principles consistently. First, meaningful naming — variables and functions should describe what they do, not how. A function called process_data tells me nothing; calculate_user_churn_rate tells me everything. Second, single responsibility — each function does one thing. If I find myself writing 'and' in a function name, I split it. Third, I write tests before or alongside code — not as an afterthought. I aim for 80%+ coverage on business logic. Fourth, I use code review as a learning tool — I write detailed PR descriptions explaining why, not just what. Finally, I document decisions in ADRs (Architecture Decision Records) for significant choices so future developers understand context. In my last internship, these practices reduced our bug rate by 40% over 3 months.",
        "quality_score": 9.0,
        "interview_type": "behavioral",
        "difficulty": "mid"
    },
    {
        "question": "What is your approach to writing clean, maintainable code?",
        "answer": "I try to write code that is easy to read and understand. I use comments to explain what the code does and follow naming conventions. I also try to keep functions short.",
        "quality_score": 3.0,
        "interview_type": "behavioral",
        "difficulty": "fresher"
    },
]

def seed():
    print(f"Seeding {len(benchmarks)} benchmarks...")
    for i, b in enumerate(benchmarks):
        try:
            store_benchmark(
                b["question"], b["answer"], b["quality_score"],
                b["interview_type"], b["difficulty"]
            )
            print(f"  [{i+1}/{len(benchmarks)}] Stored: {b['question'][:50]}... (score: {b['quality_score']})")
        except Exception as e:
            print(f"  Error on benchmark {i+1}: {e}")
    print("Done! Benchmarks seeded successfully.")

if __name__ == "__main__":
    seed()