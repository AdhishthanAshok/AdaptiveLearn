"""
Authentication API routes.
Handles user registration, login, profile retrieval, and inactive account cleanup.
"""
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import User
from app.schemas.schemas import UserRegister, UserLogin, UserResponse, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()

INACTIVITY_DAYS = 60


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    """Register a new user. Returns a JWT token on success."""
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": user.id})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """Authenticate and return a JWT token."""
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Update last active
    user.last_active_at = datetime.now(timezone.utc)
    db.commit()

    token = create_access_token(data={"sub": user.id})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the current authenticated user's profile."""
    return current_user


@router.delete("/cleanup-inactive")
def cleanup_inactive_accounts(db: Session = Depends(get_db)):
    """
    Delete user accounts that have been inactive for more than 60 days.
    Designed to be called by a cron job or scheduled task.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=INACTIVITY_DAYS)
    inactive_users = db.query(User).filter(User.last_active_at < cutoff).all()
    count = len(inactive_users)
    for user in inactive_users:
        db.delete(user)
    db.commit()
    return {"message": f"Deleted {count} inactive account(s)", "deleted_count": count}
