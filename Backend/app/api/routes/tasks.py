from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List
from ..schemas.task import TaskCreate, Task, TaskUpdate
from ..services.task_service import get_tasks, get_task, create_task, update_task, delete_task
from ..core.security import decode_token
from ..db.session import SessionLocal

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[Task])
def read_tasks(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    decode_token(token)
    return get_tasks(db)

@router.post("/", response_model=Task, status_code=status.HTTP_201_CREATED)
def add_task(task: TaskCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    decode_token(token)
    return create_task(db, task)
