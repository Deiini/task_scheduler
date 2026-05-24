from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.routes import tasks, agents, auth
from .db.session import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Scheduler API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["Tasks"])
app.include_router(agents.router, prefix="/api/v1/agents", tags=["Agents"])

@app.get("/")
async def root():
    return {"message": "Task Scheduler API is running!"}
