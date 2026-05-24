#!/bin/bash
sudo service postgresql start
redis-server &
cd  $ (dirname " $ 0")
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
celery -A app.workers.celery_app worker --loglevel=info &
celery -A app.workers.celery_app beat --loglevel=info &
