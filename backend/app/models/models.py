"""
This file defines the Beanie Document models for the application.
Replaces SQLAlchemy ORM models with async MongoDB documents.
MongoDB's _id is exposed as `id: str` via Beanie's Settings.json_schema_extra
and a custom serialiser so the frontend receives the same shape as before.
"""
from datetime import datetime, timezone
from typing import Optional
import uuid

from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Embedded sub-document (not a Collection)
# ---------------------------------------------------------------------------
class QuizOption(BaseModel):
    """Embedded option inside a Quiz document."""
    id: str = Field(default_factory=lambda: uuid.uuid4().hex)
    option_text: str
    is_correct: bool = False


# ---------------------------------------------------------------------------
# User document  →  collection: users
# ---------------------------------------------------------------------------
class User(Document):
    email: Indexed(str, unique=True)  # type: ignore[valid-type]
    password_hash: str
    role: str = "student"  # "student" | "educator"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_active_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"

    @property
    def id_str(self) -> str:
        return str(self.id)


# ---------------------------------------------------------------------------
# Video document  →  collection: videos
# ---------------------------------------------------------------------------
class Video(Document):
    title: str
    description: str
    video_url: str
    duration: int
    difficulty: str
    view_count: int = 0
    created_by: Optional[PydanticObjectId] = None  # ObjectId of the creator User

    class Settings:
        name = "videos"


# ---------------------------------------------------------------------------
# Quiz document (options embedded)  →  collection: quizzes
# ---------------------------------------------------------------------------
class Quiz(Document):
    video_id: PydanticObjectId
    question: str
    timestamp: float = 0.0
    explanation: str = ""
    options: list[QuizOption] = []

    class Settings:
        name = "quizzes"


# ---------------------------------------------------------------------------
# QuizAttempt document  →  collection: quiz_attempts
# ---------------------------------------------------------------------------
class QuizAttempt(Document):
    user_id: PydanticObjectId
    quiz_id: PydanticObjectId
    selected_option_id: str   # uuid hex matching QuizOption.id
    is_correct: bool
    attempted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "quiz_attempts"
