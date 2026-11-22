"""
This file sets up the MongoDB connection and Beanie ODM initialization.
Uses Motor async driver with Beanie for async document models.
"""
from motor.motor_asyncio import AsyncIOMotorClient
import beanie

from app.core.config import settings

# Module-level client reference so it can be closed on shutdown
_motor_client: AsyncIOMotorClient | None = None


async def init_db() -> None:
    """Initialize Beanie with the Motor client and all Document models."""
    global _motor_client

    # Deferred import to avoid circular dependency at module load time
    from app.models.models import User, Video, Quiz, QuizAttempt

    _motor_client = AsyncIOMotorClient(settings.MONGODB_URL)
    database = _motor_client[settings.DATABASE_NAME]

    await beanie.init_beanie(
        database=database,
        document_models=[User, Video, Quiz, QuizAttempt],
    )


async def close_db() -> None:
    """Close the Motor client gracefully on application shutdown."""
    global _motor_client
    if _motor_client is not None:
        _motor_client.close()
        _motor_client = None
