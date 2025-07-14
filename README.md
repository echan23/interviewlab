# InterviewLab
Check out the live site: InterviewLab.dev

InterviewLab is a real-time, collaborative coding interview platform designed for practicing technical interviews with AI-driven assistance, in-browser code execution, and persistent code sessions.

## 🚀 Features
⚡ Real-Time Collaboration
Multi-user code editing with live synchronization powered by Go, WebSockets, and Redis Pub/Sub.

🧠 AI Code Assistance
GPT-4o-powered microservice (FastAPI on AWS Lambda) provides real-time hints, feedback, and problem generation.

🖥️ In-Browser Execution
Compile and run code inside the browser via secure backend execution environments.

💾 Persistent Storage
Sessions and code files stored with PostgreSQL and cached in Redis for fast access and autosaving.

🐳 Scalable Architecture
Containerized with Docker and deployed on AWS ECS, built for performance and scalability.

🧱 Tech Stack
Frontend: React, TypeScript

Backend: Go (Gorilla WebSocket, REST), Redis, PostgreSQL

AI Service: Python (FastAPI), OpenAI API

Infrastructure: AWS ECS, Lambda, Docker, S3, Redis, PostgreSQL
