"""
Views route — increments the view count for a video.
Migrated to Beanie async MongoDB queries.
"""
from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException

from app.models.models import Video

router = APIRouter()


@router.post("/videos/{video_id}/view")
async def increment_view_count(video_id: str):
    """Increments the view count for a specific video."""
    try:
        vid_oid = PydanticObjectId(video_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid video_id format")

    video = await Video.get(vid_oid)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    video.view_count += 1
    await video.save()

    return {"message": "View count incremented successfully", "view_count": video.view_count}
