"""
Educator API routes.
Provides video creation, listing, and quiz creation for educators.
All endpoints require the 'educator' role.
Migrated to Beanie async MongoDB queries.
"""
import uuid

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.models.models import Video, Quiz, QuizOption, User
from app.schemas.schemas import VideoBase, VideoCreate, QuizBase, QuizOptionBase, QuizCreate
from app.core.security import require_role

router = APIRouter()


def _video_to_schema(video: Video) -> VideoBase:
    return VideoBase(
        id=str(video.id),
        title=video.title,
        description=video.description,
        video_url=video.video_url,
        duration=video.duration,
        difficulty=video.difficulty,
        view_count=video.view_count,
        created_by=str(video.created_by) if video.created_by else None,
    )


def _quiz_to_schema(quiz: Quiz) -> QuizBase:
    return QuizBase(
        id=str(quiz.id),
        video_id=str(quiz.video_id),
        question=quiz.question,
        timestamp=quiz.timestamp,
        explanation=quiz.explanation,
        options=[
            QuizOptionBase(id=opt.id, option_text=opt.option_text, is_correct=opt.is_correct)
            for opt in quiz.options
        ],
    )


@router.post("/videos", response_model=VideoBase, status_code=status.HTTP_201_CREATED)
async def create_video(
    payload: VideoCreate,
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
    await video.insert()
    return _video_to_schema(video)


@router.get("/videos", response_model=list[VideoBase])
async def list_my_videos(
    current_user: User = Depends(require_role("educator")),
):
    """List all videos created by the current educator."""
    videos = await Video.find(Video.created_by == current_user.id).to_list()
    return [_video_to_schema(v) for v in videos]


@router.post("/videos/{video_id}/quiz", response_model=QuizBase, status_code=status.HTTP_201_CREATED)
async def create_quiz_for_video(
    video_id: str,
    payload: QuizCreate,
    current_user: User = Depends(require_role("educator")),
):
    """Create a quiz with options for a specific video (educator only)."""
    try:
        vid_oid = PydanticObjectId(video_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid video_id format")

    video = await Video.find_one(Video.id == vid_oid, Video.created_by == current_user.id)
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found or you don't own this video",
        )

    options = [
        QuizOption(
            id=uuid.uuid4().hex,
            option_text=opt.option_text,
            is_correct=opt.is_correct,
        )
        for opt in payload.options
    ]

    quiz = Quiz(
        video_id=vid_oid,
        question=payload.question,
        timestamp=payload.timestamp,
        explanation=payload.explanation,
        options=options,
    )
    await quiz.insert()
    return _quiz_to_schema(quiz)


@router.get("/videos/{video_id}/quizzes", response_model=list[QuizBase])
async def list_quizzes_for_video(
    video_id: str,
    current_user: User = Depends(require_role("educator")),
):
    """List all quizzes for a specific video owned by the current educator."""
    try:
        vid_oid = PydanticObjectId(video_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid video_id format")

    video = await Video.find_one(Video.id == vid_oid, Video.created_by == current_user.id)
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found or you don't own this video",
        )

    quizzes = await Quiz.find(Quiz.video_id == vid_oid).to_list()
    return [_quiz_to_schema(q) for q in quizzes]
