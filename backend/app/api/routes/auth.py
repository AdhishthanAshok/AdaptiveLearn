"""
Authentication API routes.
Handles user registration, login, profile retrieval, and inactive account cleanup.
Migrated to Beanie async MongoDB queries.
"""
from datetime import datetime, timedelta, timezone

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.models.models import User
from app.schemas.schemas import UserRegister, UserLogin, UserResponse, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()

INACTIVITY_DAYS = 60


def _user_to_response(user: User) -> UserResponse:
    """Convert a Beanie User document to the UserResponse schema (id as str)."""
    return UserResponse(id=str(user.id), email=user.email, role=user.role)


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister):
    """Register a new user. Returns a JWT token on success."""
    existing = await User.find_one(User.email == payload.email)
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
    await user.insert()

    token = create_access_token(data={"sub": str(user.id)})
    return TokenResponse(
        access_token=token,
        user=_user_to_response(user),
    )


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    """Authenticate and return a JWT token."""
    user = await User.find_one(User.email == payload.email.lower().strip())
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Update last active
    user.last_active_at = datetime.now(timezone.utc)
    await user.save()

    token = create_access_token(data={"sub": str(user.id)})
    return TokenResponse(
        access_token=token,
        user=_user_to_response(user),
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Return the current authenticated user's profile."""
    return _user_to_response(current_user)


@router.delete("/cleanup-inactive")
async def cleanup_inactive_accounts():
    """
    Delete user accounts that have been inactive for more than 60 days.
    Designed to be called by a cron job or scheduled task.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=INACTIVITY_DAYS)
    inactive_users = await User.find(User.last_active_at < cutoff).to_list()
    count = len(inactive_users)
    for user in inactive_users:
        await user.delete()
    return {"message": f"Deleted {count} inactive account(s)", "deleted_count": count}
