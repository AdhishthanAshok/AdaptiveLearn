from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Video

router = APIRouter()

@router.post("/videos/{video_id}/view")
def increment_view_count(video_id: int, db: Session = Depends(get_db)):
    """
    Increments the view count for a specific video.
    """
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    video.view_count += 1
    db.commit()
    
    return {"message": "View count incremented successfully", "view_count": video.view_count}
