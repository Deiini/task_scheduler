import time
import platform
import socket
import subprocess
import requests
import logging
from datetime import datetime
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

CONFIG = {
    "server_url": os.getenv("SERVER_URL", "http://localhost:8000"),
    "polling_interval": int(os.getenv("POLLING_INTERVAL", "60")),
    "agent_name": os.getenv("AGENT_NAME", "agent-local"),
    "log_file": "agent.log"
}

class Agent:
    def __init__(self):
        self.agent_id = None
        self.register_agent()

    def register_agent(self):
        try:
            response = requests.post(
                f"{CONFIG['server_url']}/api/v1/agents/",
                json={
                    "name": CONFIG["agent_name"],
                    "description": f"Agent on {platform.node()}",
                    "os": platform.system().lower(),
                    "ip_address": socket.gethostbyname(socket.gethostname())
                }
            )
            if response.status_code == 201:
                self.agent_id = response.json()["id"]
                logger.info(f"Agent registered with ID: {self.agent_id}")
            else:
                logger.error(f"Failed to register agent: {response.text}")
        except Exception as e:
            logger.error(f"Error registering agent: {e}")

    def poll_tasks(self):
        while True:
            try:
                response = requests.get(
                    f"{CONFIG['server_url']}/api/v1/tasks/",
                    headers={"Authorization": "Bearer admin_token"}
                )
                if response.status_code == 200:
                    tasks = response.json()
                    for task in tasks:
                        if task["is_active"]:
                            self.execute_task(task)
            except Exception as e:
                logger.error(f"Error polling tasks: {e}")
            time.sleep(CONFIG["polling_interval"])

    def execute_task(self, task):
        try:
            result = subprocess.run(task["script_path"], shell=True, capture_output=True, text=True)
            logger.info(f"Task {task['id']} executed: {result.stdout}")
        except Exception as e:
            logger.error(f"Error executing task: {e}")

if __name__ == "__main__":
    agent = Agent()
    agent.poll_tasks()
