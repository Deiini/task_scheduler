#!/bin/bash
# Script d'installation pour Task Scheduler

set -e

echo "=========================================="
echo "Installation de Task Scheduler Dashboard"
echo "=========================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Vérifications
command -v python3 >/dev/null 2>&1 || { echo -e "${RED}Python3 requis${NC}"; exit 1; }
command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js requis${NC}"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${YELLOW}Docker non trouvé - installation manuelle${NC}"; }

echo -e "${GREEN}[1/4] Installation du backend...${NC}"
cd backend
pip install -r requirements.txt

echo -e "${GREEN}[2/4] Installation du frontend...${NC}"
cd ../frontend
npm install

echo -e "${GREEN}[3/4] Configuration de PostgreSQL et Redis...${NC}"
if command -v docker >/dev/null 2>&1; then
    docker run -d --name task-scheduler-postgres -e POSTGRES_DB=taskscheduler -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15
    docker run -d --name task-scheduler-redis -p 6379:6379 redis:7
    echo -e "${GREEN}Conteneurs Docker lancés${NC}"
else
    echo -e "${YELLOW}Démarrez manuellement PostgreSQL et Redis${NC}"
fi

echo -e "${GREEN}[4/4] Configuration finale...${NC}"
cd ..
cp .env.example .env 2>/dev/null || true
echo -e "${GREEN}=========================================="
echo "Installation terminée!"
echo "=========================================="
