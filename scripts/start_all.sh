#!/bin/bash
# Script de démarrage pour Task Scheduler

set -e

echo "=========================================="
echo "Démarrage de Task Scheduler Dashboard"
echo "=========================================="

# Couleurs
GREEN='\033[0;32m'
NC='\033[0m'

# Démarrer le backend
echo -e "${GREEN}[1/3] Démarrage du backend FastAPI...${NC}"
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Démarrer Celery Worker
echo -e "${GREEN}[2/3] Démarrage de Celery Worker...${NC}"
cd backend
celery -A app.tasks.celery_app worker --loglevel=info &
CELERY_PID=$!
cd ..

# Démarrer Celery Beat
echo -e "${GREEN}[3/3] Démarrage de Celery Beat...${NC}"
cd backend
celery -A app.tasks.celery_app beat --loglevel=info &
BEAT_PID=$!
cd ..

# Démarrer le frontend
echo -e "${GREEN}[4/4] Démarrage du frontend React...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}=========================================="
echo "Tous les services sont démarrés!"
echo "=========================================="
echo "API:      http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "Docs:     http://localhost:8000/docs"
echo ""
echo "Pour arrêter: ./scripts/stop_all.sh"
echo "PIDs: $BACKEND_PID $CELERY_PID $BEAT_PID $FRONTEND_PID"
