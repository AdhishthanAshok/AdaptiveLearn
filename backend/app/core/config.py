"""
Application configuration module.
Loads environment-specific configuration (.env for local development, .env.production for cloud/production)
without hardcoding sensitive credentials.
"""
from pathlib import Path
import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Resolve paths
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ROOT_DIR = BACKEND_DIR.parent

# Determine environment mode (defaults to development/local)
env_name = (os.getenv("APP_ENV") or os.getenv("ENVIRONMENT") or "development").lower()

# Pick target env file based on environment
target_file = ".env.production" if env_name in ("production", "cloud") else ".env"

# Load the target env file if found (does not overwrite already exported system env vars)
loaded = False
for search_dir in [BACKEND_DIR, Path.cwd(), ROOT_DIR]:
    candidate = search_dir / target_file
    if candidate.is_file():
        load_dotenv(dotenv_path=candidate, override=False)
        loaded = True
        break

# Fallback: if .env.production was not found or in dev mode and .env exists, ensure .env is loaded
if not loaded:
    for search_dir in [BACKEND_DIR, Path.cwd(), ROOT_DIR]:
        candidate = search_dir / ".env"
        if candidate.is_file():
            load_dotenv(dotenv_path=candidate, override=False)
            break

class Settings(BaseSettings):
    ENVIRONMENT: str = env_name
    DATABASE_URL: str = "postgresql://localhost:5432/my_database"
    JWT_SECRET_KEY: str = "dev-secret-change-me-in-production-8f3a9b2c"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    CORS_ORIGINS: list[str] = ["*"]

    @property
    def sync_database_url(self) -> str:
        """
        Ensures the SQLAlchemy database URL uses the standard 'postgresql://' dialect
        instead of deprecated 'postgres://'.
        """
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    model_config = {
        "extra": "ignore",
    }

settings = Settings()
