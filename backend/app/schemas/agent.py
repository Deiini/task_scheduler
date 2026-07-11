from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AgentBase(BaseModel):
    name: str
    hostname: Optional[str] = None
    ip_address: Optional[str] = None

class AgentCreate(AgentBase):
    capabilities: Optional[str] = None

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    hostname: Optional[str] = None
    ip_address: Optional[str] = None
    status: Optional[str] = None
    capabilities: Optional[str] = None
    is_active: Optional[bool] = None

class AgentResponse(AgentBase):
    id: int
    status: str
    last_heartbeat: Optional[datetime] = None
    capabilities: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True