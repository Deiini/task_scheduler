from app.tasks.celery_app import celery_app
from app.core.database import SessionLocal
from app.models.task import Task, TaskStatus
from app.models.agent import Agent
import subprocess
import logging

logger = logging.getLogger(__name__)

@celery_app.task(name="execute_task")
def execute_task(task_id: int):
    db = SessionLocal()
    try:
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            logger.error(f"Task {task_id} not found")
            return {"status": "error", "message": "Task not found"}
        
        task.status = TaskStatus.RUNNING
        db.commit()
        
        logger.info(f"Executing task {task_id}: {task.command}")
        
        result = subprocess.run(
            task.command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=3600
        )
        
        if result.returncode == 0:
            task.status = TaskStatus.COMPLETED
            logger.info(f"Task {task_id} completed successfully")
        else:
            task.status = TaskStatus.FAILED
            logger.error(f"Task {task_id} failed: {result.stderr}")
        
        db.commit()
        return {
            "status": task.status,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "returncode": result.returncode
        }
    except Exception as e:
        logger.error(f"Error executing task {task_id}: {str(e)}")
        task.status = TaskStatus.FAILED
        db.commit()
        return {"status": "error", "message": str(e)}
    finally:
        db.close()

@celery_app.task(name="check_agents_heartbeat")
def check_agents_heartbeat():
    db = SessionLocal()
    try:
        from datetime import datetime, timedelta
        threshold = datetime.utcnow() - timedelta(minutes=5)
        agents = db.query(Agent).filter(
            Agent.last_heartbeat < threshold,
            Agent.status == "online"
        ).all()
        for agent in agents:
            agent.status = "offline"
        db.commit()
        return {"checked": len(agents)}
    finally:
        db.close()