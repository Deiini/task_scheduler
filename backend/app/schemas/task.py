from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.task import TaskStatus, TaskPriority

class TaskBase(BaseModel):
    name: str
    description: Optional[str] = None
    command: str
    schedule: Optional[str] = None
    priority: TaskPriority = TaskPriority.NORMAL
    agent_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    command: Optional[str] = None
    schedule: Optional[str] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    agent_id: Optional[int] = None

class TaskResponse(TaskBase):
    id: int
    status: TaskStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True