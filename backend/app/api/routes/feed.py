"""
This file implements the feed-related API routes for the backend.
It defines endpoints to fetch the initial video feed for the user.
Migrated to Beanie async MongoDB queries.
"""
from fastapi import APIRouter

from app.models.models import Video
from app.schemas.schemas import FeedResponse, VideoBase

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


@router.get("", response_model=FeedResponse)
@router.get("/", response_model=FeedResponse)
async def get_feed():
    """For MVP, return all videos."""
    videos = await Video.find_all().to_list()
    return FeedResponse(videos=[_video_to_schema(v) for v in videos])
