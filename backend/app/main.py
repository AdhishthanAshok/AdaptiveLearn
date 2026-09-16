"""
This is the main entry point for the FastAPI backend application.
It configures CORS, initializes the database tables, and registers API routers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import feed, quizzes, views, auth, educator
from app.db.database import engine, Base

from app.core.config import settings

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AdaptiveLearn API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(feed.router, prefix="/api/v1/feed", tags=["feed"])
app.include_router(quizzes.router, prefix="/api/v1", tags=["quizzes"])
app.include_router(views.router, prefix="/api/v1", tags=["views"])
app.include_router(educator.router, prefix="/api/v1/educator", tags=["educator"])

@app.get("/")
def root():
    return {"message": "Welcome to AdaptiveLearn API"}
