"""
This file implements the quiz-related API routes for the backend.
It handles fetching quizzes for specific videos, evaluating user quiz attempts
(with persistent tracking), and retrieving quiz history for students.
Migrated to Beanie async MongoDB queries.
"""
from datetime import datetime, timezone

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.models.models import Quiz, QuizAttempt, Video, User
from app.schemas.schemas import (
    QuizBase, QuizOptionBase, AnswerSubmission, AnswerResponse,
    QuizAttemptDetail, QuizHistoryStats,
)
from app.core.security import get_current_user

router = APIRouter()


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


@router.get("/videos/{video_id}/quiz", response_model=QuizBase)
async def get_quiz_for_video(video_id: str):
    try:
        vid_oid = PydanticObjectId(video_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid video_id format")

    quiz = await Quiz.find_one(Quiz.video_id == vid_oid)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found for this video")
    return _quiz_to_schema(quiz)


@router.post("/quizzes/{quiz_id}/attempt", response_model=AnswerResponse)
async def attempt_quiz(
    quiz_id: str,
    attempt: AnswerSubmission,
    current_user: User = Depends(get_current_user),
):
    try:
        quiz_oid = PydanticObjectId(quiz_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid quiz_id format")

    quiz = await Quiz.get(quiz_oid)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    # Find the selected option from embedded list
    selected_option = next(
        (opt for opt in quiz.options if opt.id == attempt.selected_option_id), None
    )
    if not selected_option:
        raise HTTPException(status_code=400, detail="Invalid option selected")

    # Find the correct option from embedded list
    correct_option = next((opt for opt in quiz.options if opt.is_correct), None)

    # Persist the attempt
    quiz_attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz.id,
        selected_option_id=selected_option.id,
        is_correct=selected_option.is_correct,
    )
    await quiz_attempt.insert()

    return AnswerResponse(
        is_correct=selected_option.is_correct,
        explanation=quiz.explanation,
        correct_option_id=correct_option.id if correct_option else "",
    )


@router.get("/quizzes/history", response_model=QuizHistoryStats)
async def get_quiz_history(
    current_user: User = Depends(get_current_user),
):
    """Return the authenticated student's complete quiz attempt history with stats."""
    attempts = await (
        QuizAttempt.find(QuizAttempt.user_id == current_user.id)
        .sort(-QuizAttempt.attempted_at)
        .to_list()
    )

    total_attempted = len(attempts)
    total_correct = sum(1 for a in attempts if a.is_correct)
    accuracy = (total_correct / total_attempted * 100) if total_attempted > 0 else 0.0

    attempt_details: list[QuizAttemptDetail] = []
    for a in attempts:
        quiz = await Quiz.get(a.quiz_id)
        video = await Video.get(quiz.video_id) if quiz else None

        selected_opt_text = "Unknown"
        correct_opt_text = "Unknown"
        if quiz:
            sel = next((o for o in quiz.options if o.id == a.selected_option_id), None)
            cor = next((o for o in quiz.options if o.is_correct), None)
            selected_opt_text = sel.option_text if sel else "Unknown"
            correct_opt_text = cor.option_text if cor else "Unknown"

        attempt_details.append(
            QuizAttemptDetail(
                id=str(a.id),
                quiz_id=str(a.quiz_id),
                question=quiz.question if quiz else "Unknown",
                video_title=video.title if video else "Unknown",
                selected_option_text=selected_opt_text,
                correct_option_text=correct_opt_text,
                is_correct=a.is_correct,
                attempted_at=a.attempted_at,
            )
        )

    return QuizHistoryStats(
        total_attempted=total_attempted,
        total_correct=total_correct,
        accuracy_percent=round(accuracy, 1),
        attempts=attempt_details,
    )
