from celery import shared_task
from ..services.task_service import schedule_task
from ..db.session import SessionLocal
from ..models.task import Task

@shared_task
def schedule_tasks_periodically():
    """Planifie toutes les tâches actives toutes les minutes."""
    db = SessionLocal()
    tasks = db.query(Task).filter(Task.is_active == True).all()

    for task in tasks:
        schedule_task(task)

    return f"Planification de {len(tasks)} tâches"
