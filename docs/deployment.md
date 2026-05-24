# Guide de déploiement - Task Scheduler

## Prérequis
- Serveur Linux/Windows avec Python 3.10+
- PostgreSQL 15+
- Redis
- Node.js 18+ (pour React)

## Installation du backend
1. Cloner le dépôt :
   ```bash
   git clone https://github.com/ton-org/task_scheduler.git
   cd task_scheduler/backend

## Création de l'enviromment virtuel
2. Créer un environnement virtuel :
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate

## Installation des dépendances
3. dépendances
pip install -r requirements.txt

## Configuration de la BDD
4. configuration de PostgresSQL :
CREATE DATABASE task_scheduler;
CREATE USER admin WITH PASSWORD 'ton_mot_de_passe_secure';
GRANT ALL PRIVILEGES ON DATABASE task_scheduler TO admin;

## Lancement du serveur 
5. 
uvicorn app.main:app --host 0.0.0.0 --port 8000

## Lancement de Celery dans un second terminal 
6. 
celery -A app.workers.celery_app worker --loglevel=info
celery -A app.workers.celery_app beat --loglevel=info

