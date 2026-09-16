"""
Educator API routes.
Provides video creation, listing, and quiz creation for educators.
All endpoints require the 'educator' role.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import Video, Quiz, QuizOption, User
from app.schemas.schemas import VideoBase, VideoCreate, QuizBase, QuizCreate
from app.core.security import require_role

router = APIRouter()


@router.post("/videos", response_model=VideoBase, status_code=status.HTTP_201_CREATED)
def create_video(
    payload: VideoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("educator")),
):
    """Create a new educational video (educator only)."""
    video = Video(
        title=payload.title,
        description=payload.description,
        video_url=payload.video_url,
        duration=payload.duration,
        difficulty=payload.difficulty,
        created_by=current_user.id,
    )
    db.add(video)
    db.commit()
    db.refresh(video)
    return video


@router.get("/videos", response_model=list[VideoBase])
def list_my_videos(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("educator")),
):
    """List all videos created by the current educator."""
    return db.query(Video).filter(Video.created_by == current_user.id).all()


@router.post("/videos/{video_id}/quiz", response_model=QuizBase, status_code=status.HTTP_201_CREATED)
def create_quiz_for_video(
    video_id: int,
    payload: QuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("educator")),
):
    """Create a quiz with options for a specific video (educator only)."""
    video = db.query(Video).filter(Video.id == video_id, Video.created_by == current_user.id).first()
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found or you don't own this video",
        )

    quiz = Quiz(
        video_id=video_id,
        question=payload.question,
        timestamp=payload.timestamp,
        explanation=payload.explanation,
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    for opt in payload.options:
        option = QuizOption(
            quiz_id=quiz.id,
            option_text=opt.option_text,
            is_correct=opt.is_correct,
        )
        db.add(option)
    db.commit()
    db.refresh(quiz)
    return quiz


@router.get("/videos/{video_id}/quizzes", response_model=list[QuizBase])
def list_quizzes_for_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("educator")),
):
    """List all quizzes for a specific video owned by the current educator."""
    video = db.query(Video).filter(Video.id == video_id, Video.created_by == current_user.id).first()
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found or you don't own this video",
        )
    return db.query(Quiz).filter(Quiz.video_id == video_id).all()
