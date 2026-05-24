from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from ..db.base import Base

class TaskLog(Base):
    __tablename__ = "task_logs"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    status = Column(String(20))
    output = Column(Text)
    error = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
