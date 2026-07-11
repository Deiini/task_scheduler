#!/usr/bin/env python3
"""Agent de tâches planifiées pour Windows/Linux/macOS"""
import requests
import psutil
import socket
import platform
import time
import json
from datetime import datetime

class TaskSchedulerAgent:
    def __init__(self, api_url: str, agent_name: str = None):
        self.api_url = api_url.rstrip('/')
        self.agent_name = agent_name or socket.gethostname()
        self.agent_id = None
        self.status = "offline"
        
    def register(self) -> dict:
        """Enregistrer l'agent auprès de l'API"""
        response = requests.post(
            f"{self.api_url}/api/agents/",
            json={
                "name": self.agent_name,
                "hostname": socket.gethostname(),
                "ip_address": self.get_ip_address(),
                "capabilities": self.get_capabilities()
            }
        )
        response.raise_for_status()
        self.agent_id = response.json()["id"]
        self.status = "online"
        return response.json()
    
    def heartbeat(self) -> dict:
        """Envoyer un heartbeat à l'API"""
        if not self.agent_id:
            raise RuntimeError("Agent non enregistré")
        response = requests.post(f"{self.api_url}/api/agents/{self.agent_id}/heartbeat")
        response.raise_for_status()
        return response.json()
    
    def execute_command(self, command: str) -> dict:
        """Exécuter une commande système"""
        import subprocess
        try:
            result = subprocess.run(
                command, shell=True, capture_output=True, text=True, timeout=3600
            )
            return {
                "returncode": result.returncode,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {"error": str(e), "timestamp": datetime.utcnow().isoformat()}
    
    def get_capabilities(self) -> str:
        return json.dumps({
            "os": platform.system(),
            "os_version": platform.version(),
            "python_version": platform.python_version(),
            "cpu_count": psutil.cpu_count(),
            "memory_total": psutil.virtual_memory().total,
            "disk_total": psutil.disk_usage('/').total if platform.system() != 'Windows' else psutil.disk_usage('C:').total
        })
    
    @staticmethod
    def get_ip_address() -> str:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except Exception:
            return "127.0.0.1"
    
    def run(self, heartbeat_interval: int = 60):
        """Boucle principale de l'agent"""
        self.register()
        print(f"Agent {self.agent_name} enregistré (ID: {self.agent_id})")
        while True:
            try:
                self.heartbeat()
                print(f"[{datetime.now()}] Heartbeat envoyé")
            except Exception as e:
                print(f"Erreur heartbeat: {e}")
            time.sleep(heartbeat_interval)

if __name__ == "__main__":
    import sys
    api_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    agent = TaskSchedulerAgent(api_url)
    agent.run()
