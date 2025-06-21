import json
import logging
import os
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

# Load env variables 
load_dotenv()

# Validates API key
if not os.getenv("GPT_API_KEY"):
    raise ValueError("GPT_API_KEY is missing in environment variables.")

# Initialize GPT-4o
openai_client = OpenAI(
    base_url="https://models.github.ai/inference",
    api_key=os.getenv("GPT_API_KEY"),
)

# FastAPI 
app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models request 
class HintRequest(BaseModel):
    code: str
    hintType: str

class Message(BaseModel):
    type: str
    code: str
    hintType: str

# GPT generation logic
async def get_gpt_response(code: str, hint_type: str) -> str:
    if hint_type == "weak":
        prompt = f"I'm working on this code:\n\n{code}\n\nIf there is nothing, say No code shown. Tell me if I am on the right track. Give me a vague or small hint or suggestion to improve it in one paragraph. Don't give the answer and don't say anything acknowledging me or the prompt like I am happy to help or Ok, just say the advice of logic or syntax errors. DONT FOCUS ON TIME COMPLEXITY ADVICE AT ALL"
    else:
        prompt = f"Here is my code:\n\n{code}\n\nIf there is nothing say no code shown. Tell me if I am on the right track. Please give me a very detailed or strong hint and guidance in the right direction to help me improve it in one paragraph along with time complexity advice. Do not give me the full answer, just advice to lead me in the right direction. Don't say anything acknowledging me or the prompt like I am happy to help or Ok. Just say the advice"

    response = openai_client.chat.completions.create(
        model="openai/gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful interviewer."},
            {"role": "user", "content": prompt}
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
        logging.error("GPT generation failed", exc_info=True)
        return {"error": "Failed to generate hint"}

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            msg = Message(**json.loads(data))

            if msg.type == "hint":
                try:
                    hint = await get_gpt_response(msg.code, msg.hintType)
                    await websocket.send_json({"type": "hint", "hint": hint})
                except Exception as e:
                    logging.error("GPT generation error in WebSocket", exc_info=True)
                    await websocket.send_json({"error": "GPT failed to generate a response"})
    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
