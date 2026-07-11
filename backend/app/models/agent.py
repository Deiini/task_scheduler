from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Agent(Base):
    __tablename__ = "agents"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    hostname = Column(String(255), nullable=True)
    ip_address = Column(String(45), nullable=True)
    status = Column(String(50), default="offline")
    last_heartbeat = Column(DateTime(timezone=True), nullable=True)
    capabilities = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())