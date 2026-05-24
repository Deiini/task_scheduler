from sqlalchemy.orm import Session
from ..db.models.task import Task
from ..schemas.task import TaskCreate

def get_tasks(db: Session):
    return db.query(Task).all()

def create_task(db: Session, task: TaskCreate):
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task
