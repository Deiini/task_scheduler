# Task Scheduler Dashboard

Application complète pour la gestion des tâches planifiées avec FastAPI, React, Celery et PostgreSQL.

## 🚀 Structure du projet

```
task_scheduler_project/
├── backend/          # API FastAPI + Celery
├── frontend/         # Dashboard React
├── agent/            # Agent Python
├── scripts/          # Scripts d'installation et démarrage
└── docs/             # Documentation
```

## ⚡ Installation rapide

```bash
# 1. Cloner ou extraire le projet
cd task_scheduler_project

# 2. Installer les dépendances
./scripts/install.sh

# 3. Démarrer tous les services
./scripts/start_all.sh
```

## 🔧 Configuration

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/taskscheduler
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=votre-cle-secrete
```

### Démarrage manuel
```bash
# Backend
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Celery Worker
celery -A app.tasks.celery_app worker --loglevel=info

# Frontend
cd frontend
npm run dev
```

## 📱 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/tasks/ | Liste des tâches |
| POST | /api/tasks/ | Créer une tâche |
| PUT | /api/tasks/{id} | Modifier une tâche |
| DELETE | /api/tasks/{id} | Supprimer une tâche |
| POST | /api/tasks/{id}/execute | Exécuter une tâche |
| GET | /api/agents/ | Liste des agents |
| POST | /api/agents/{id}/heartbeat | Heartbeat agent |

## 🖥️ Interface

- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **API Health**: http://localhost:8000/health

## 📋 Prérequis

- Python 3.9+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optionnel)

## 🔒 Sécurité

⚠️ **IMPORTANT**: Changez les valeurs par défaut dans `.env` avant production !

```env
SECRET_KEY=<generer-une-cle-secrete>
DATABASE_PASSWORD=<mot-de-passe-fort>
```

## 📝 Licence

MIT License - 2026
