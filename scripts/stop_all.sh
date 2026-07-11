#!/bin/bash
echo "Arrêt de tous les services..."
pkill -f "uvicorn app.main:app" || true
pkill -f "celery.*worker" || true
pkill -f "celery.*beat" || true
pkill -f "npm run dev" || true
echo "Services arrêtés."
