"""
This file implements the feed-related API routes for the backend.
It defines endpoints to fetch the initial video feed for the user.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Video
from app.schemas.schemas import FeedResponse

router = APIRouter()


@router.get("", response_model=FeedResponse)
@router.get("/", response_model=FeedResponse)
def get_feed(db: Session = Depends(get_db)):
    # For MVP, just return all videos
    videos = db.query(Video).all()
    return {"videos": videos}
