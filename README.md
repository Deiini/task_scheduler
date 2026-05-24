# 🚀 Task Scheduler - Système d'Automatisation de Tâches

[![CI/CD Pipeline](https://github.com/ton-utilisateur/task-scheduler/actions/workflows/test.yml/badge.svg)](https://github.com/ton-utilisateur/task-scheduler/actions)
![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95.2-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)
![Redis](https://img.shields.io/badge/Redis-7+-red.svg)

---

## 📌 Description

**Task Scheduler** est une solution complète pour l'automatisation et la gestion centralisée de tâches système (backups, monitoring, scripts personnalisés, etc.). Développé avec :
- **Backend** : FastAPI (Python) + Celery pour l'exécution asynchrone
- **Frontend** : React (TypeScript) avec Material-UI pour une interface moderne
- **Agent** : Agent Python multiplateforme (Linux/Windows) pour exécuter les tâches localement
- **Base de données** : PostgreSQL pour le stockage des tâches et des logs
- **Message Broker** : Redis pour la communication entre les composants

---

## ✨ Fonctionnalités Clés

| Fonctionnalité               | Description                                                                 |
|------------------------------|-----------------------------------------------------------------------------|
| **Gestion des tâches**       | Création, planification et suivi des tâches (cron, intervalle personnalisé) |
| **Tableau de bord**          | Interface React pour visualiser l'état des tâches et des agents            |
| **Authentification JWT**     | Sécurisation des endpoints avec tokens JWT                                |
| **Agents distribués**        | Déploiement d'agents sur plusieurs machines (Linux/Windows)                |
| **Logs et historique**       | Journalisation des exécutions (succès/échecs) avec sortie détaillée        |
| **API RESTful**              | Documentation interactive via Swagger/OpenAPI                              |
| **Scalabilité**              | Architecture modulaire pour ajouter des agents ou des tâches dynamiquement |

---

## 📁 Structure du Projet

```bash
task-scheduler/
├── .github/                  # Configuration CI/CD (GitHub Actions)
│   └── workflows/
│       └── test.yml          # Pipeline de tests automatisés
├── backend/                  # API FastAPI + Celery
│   ├── app/                  # Code source de l'API
│   │   ├── __init__.py
│   │   ├── main.py           # Point d'entrée de l'API
│   │   ├── core/             # Configuration et sécurité
│   │   ├── db/               # Modèles SQLAlchemy et sessions
│   │   ├── api/              # Routes et contrôleurs
│   │   ├── services/         # Logique métier
│   │   └── workers/          # Tâches Celery
│   ├── .env                  # Variables d'environnement (à personnaliser)
│   ├── requirements.txt      # Dépendances Python
│   └── run.sh                # Script de démarrage (Linux)
├── frontend/                 # Interface React
│   ├── public/               # Fichiers statiques
│   ├── src/                  # Code source React
│   │   ├── components/       # Composants réutilisables
│   │   ├── pages/            # Pages principales
│   │   ├── services/         # Appels API
│   │   ├── types/            # Types TypeScript
│   │   ├── App.tsx           # Composant racine
│   │   ├── index.tsx         # Point d'entrée React
│   │   └── styles.css        # Styles globaux
│   ├── package.json          # Dépendances Node.js
│   └── .env                  # Variables d'environnement frontend
├── agent/                    # Agent Python
│   ├── agent.py              # Logique principale de l'agent
│   ├── config.py             # Configuration de l'agent
│   └── .env                  # Variables d'environnement de l'agent
├── scripts/                  # Scripts utilitaires
│   └── setup_db.sh           # Initialisation de la base de données
├── .gitignore                # Fichiers à ignorer par Git
└── README.md                 # Ce fichier

