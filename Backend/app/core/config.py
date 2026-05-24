from pydantic import BaseSettings

class Settings(BaseSettings):
    POSTGRES_USER: str = "admin"
    POSTGRES_PASSWORD: str = "admin"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "task_scheduler"

    SECRET_KEY: str = "ta_clef_secrete_tres_secure_1234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:8000"

    class Config:
        env_file = ".env"

settings = Settings()
