"""
This file defines the Pydantic schemas for data validation and API request/response modeling.
Includes definitions for auth, video, quiz, quiz history, and educator operations.
"""
import re
from datetime import datetime
from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional


# ---------------------------------------------------------------------------
# Auth schemas
# ---------------------------------------------------------------------------
class UserRegister(BaseModel):
    email: str
    password: str
    role: str = "student"

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.match(pattern, v):
            raise ValueError("Invalid email format")
        return v.lower().strip()

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-+=\[\]\\\/~`]", v):
            raise ValueError("Password must contain at least one special character")
        return v

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in ("student", "educator"):
            raise ValueError("Role must be 'student' or 'educator'")
        return v


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    role: str

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ---------------------------------------------------------------------------
# Quiz option schemas
# ---------------------------------------------------------------------------
class QuizOptionBase(BaseModel):
    id: int
    option_text: str
    is_correct: bool

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Quiz schemas
# ---------------------------------------------------------------------------
class QuizBase(BaseModel):
    id: int
    video_id: int
    question: str
    timestamp: float
    explanation: str
    options: List[QuizOptionBase] = []

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Video schemas
# ---------------------------------------------------------------------------
class VideoBase(BaseModel):
    id: int
    title: str
    description: str
    video_url: str
    duration: int
    difficulty: str
    view_count: int = 0
    created_by: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class FeedResponse(BaseModel):
    videos: List[VideoBase]


# ---------------------------------------------------------------------------
# Quiz attempt / submission schemas
# ---------------------------------------------------------------------------
class AnswerSubmission(BaseModel):
    selected_option_id: int


class AnswerResponse(BaseModel):
    is_correct: bool
    explanation: str
    correct_option_id: int


# ---------------------------------------------------------------------------
# Quiz history schemas (student)
# ---------------------------------------------------------------------------
class QuizAttemptDetail(BaseModel):
    id: int
    quiz_id: int
    question: str
    video_title: str
    selected_option_text: str
    correct_option_text: str
    is_correct: bool
    attempted_at: datetime

    model_config = ConfigDict(from_attributes=True)


class QuizHistoryStats(BaseModel):
    total_attempted: int
    total_correct: int
    accuracy_percent: float
    attempts: List[QuizAttemptDetail]


# ---------------------------------------------------------------------------
# Educator schemas
# ---------------------------------------------------------------------------
class VideoCreate(BaseModel):
    title: str
    description: str
    video_url: str
    duration: int
    difficulty: str = "medium"


class QuizOptionCreate(BaseModel):
    option_text: str
    is_correct: bool = False


class QuizCreate(BaseModel):
    question: str
    timestamp: float = 0.0
    explanation: str = ""
    options: List[QuizOptionCreate]

    @field_validator("options")
    @classmethod
    def validate_options(cls, v: List[QuizOptionCreate]) -> List[QuizOptionCreate]:
        if len(v) < 2:
            raise ValueError("A quiz must have at least 2 options")
        correct_count = sum(1 for opt in v if opt.is_correct)
        if correct_count != 1:
            raise ValueError("Exactly one option must be marked as correct")
        return v
