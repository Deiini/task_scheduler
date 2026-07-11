from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import tasks, agents
from app.core.database import engine
from app.core.config import settings

app = FastAPI(title="Task Scheduler API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(agents.router, prefix="/api/agents", tags=["agents"])

@app.get("/")
async def root():
    return {"message": "Task Scheduler API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
