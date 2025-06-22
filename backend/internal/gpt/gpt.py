import json
import logging
import os
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
from .prompts import get_hint_prompt, get_question_prompt


load_dotenv()
if not os.getenv("GPT_API_KEY"):
    raise ValueError("GPT_API_KEY is missing in environment variables.")
openai_client = OpenAI(
    base_url="https://models.github.ai/inference",
    api_key=os.getenv("GPT_API_KEY"),
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HintRequest(BaseModel):
    code: str
    hintType: str

class QuestionRequest(BaseModel):
    difficulty: str
    company: str
    topic: str

class Message(BaseModel):
    type: str
    code: str
    hintType: str


# GPT generation logic
async def get_gpt_response(code: str, hint_type: str) -> str:
    prompt = get_hint_prompt(code, hint_type)
    response = openai_client.chat.completions.create(
        model="openai/gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful interviewer during a technical Software Engineering interview."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500,
        temperature=0.7,
    )

    return response.choices[0].message.content.strip()

async def generate_question(difficulty: str, company: str, topic: str) -> str:
    prompt = get_question_prompt(difficulty, company, topic)
    response = openai_client.chat.completions.create(
        model="openai/gpt-4o",
        messages=[
            {
                "role": "system",
                "content": """You are a professional technical interviewer. 
                Return only the coding interview question — do not include explanations, hints, or solutions. 
                Follow this exact format:

                1. A clear description of the problem. Each sentence is on a new line.
                2. Mention any time/space complexity constraints if relevant.
                3. Include exactly one example, labeled as: Example 1:
                4. Do not include any headers like 'Question:' or 'Problem:', or 'Title:'.
                5. Do not add greetings or prefaces like 'Sure, here is...'.

                Format all content as plain text with line breaks. Avoid Markdown or numbered lists."""
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        max_tokens=500,
        temperature=0.7,
    )

    return response.choices[0].message.content.strip()
    

# REST API endpoint
@app.post("/api/hint")
async def hint_handler(req: HintRequest):
    try:
        hint = await get_gpt_response(req.code, req.hintType)
        return {"hint": hint}
    except Exception as e:
        logging.error("Hint generation failed", exc_info=True)
        return {"error": "Failed to generate hint"}
    
@app.post("/api/generate")
async def generate_handler(req: QuestionRequest):
    try:
        question = await generate_question(req.difficulty, req.company, req.topic)
        return {"question": question}
    except Exception as e:
        logging.error("Question gneration failed", exc_info=True)
        return {"error": "Failed to generate question"}

