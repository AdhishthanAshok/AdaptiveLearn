"""
This file implements the quiz-related API routes for the backend.
It handles fetching quizzes for specific videos, evaluating user quiz attempts
(with persistent tracking), and retrieving quiz history for students.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import Quiz, QuizOption, QuizAttempt, User
from app.schemas.schemas import QuizBase, AnswerSubmission, AnswerResponse, QuizAttemptDetail, QuizHistoryStats
from app.core.security import get_current_user

router = APIRouter()


@router.get("/videos/{video_id}/quiz", response_model=QuizBase)
def get_quiz_for_video(video_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.video_id == video_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found for this video")
    return quiz


@router.post("/quizzes/{quiz_id}/attempt", response_model=AnswerResponse)
def attempt_quiz(
    quiz_id: int,
    attempt: AnswerSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    selected_option = (
        db.query(QuizOption)
        .filter(QuizOption.id == attempt.selected_option_id, QuizOption.quiz_id == quiz_id)
        .first()
    )
    if not selected_option:
        raise HTTPException(status_code=400, detail="Invalid option selected")

    correct_option = (
        db.query(QuizOption)
        .filter(QuizOption.quiz_id == quiz_id, QuizOption.is_correct == True)
        .first()
    )

    # Record the attempt
    quiz_attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz_id,
        selected_option_id=selected_option.id,
        is_correct=selected_option.is_correct,
    )
    db.add(quiz_attempt)
    db.commit()

    return {
        "is_correct": selected_option.is_correct,
        "explanation": quiz.explanation,
        "correct_option_id": correct_option.id if correct_option else -1,
    }


@router.get("/quizzes/history", response_model=QuizHistoryStats)
def get_quiz_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the authenticated student's complete quiz attempt history with stats."""
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == current_user.id)
        .order_by(QuizAttempt.attempted_at.desc())
        .all()
    )

    total_attempted = len(attempts)
    total_correct = sum(1 for a in attempts if a.is_correct)
    accuracy = (total_correct / total_attempted * 100) if total_attempted > 0 else 0.0

    attempt_details = []
    for a in attempts:
        quiz = a.quiz
        video = quiz.video
        selected_opt = a.selected_option
        correct_opt = (
            db.query(QuizOption)
            .filter(QuizOption.quiz_id == quiz.id, QuizOption.is_correct == True)
            .first()
        )
        attempt_details.append(
            QuizAttemptDetail(
                id=a.id,
                quiz_id=quiz.id,
                question=quiz.question,
                video_title=video.title if video else "Unknown",
                selected_option_text=selected_opt.option_text if selected_opt else "Unknown",
                correct_option_text=correct_opt.option_text if correct_opt else "Unknown",
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
