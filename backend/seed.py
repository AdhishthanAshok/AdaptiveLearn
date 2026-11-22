"""
This script seeds MongoDB with sample data using Beanie async ODM.
Run from the backend directory:  python seed.py
"""
import asyncio
import os
import uuid

from motor.motor_asyncio import AsyncIOMotorClient
import beanie

from app.core.config import settings
from app.core.security import hash_password
from app.models.models import User, Video, Quiz, QuizOption, QuizAttempt


async def seed_db() -> None:
    print(f"Connecting to MongoDB [{settings.ENVIRONMENT}]: {settings.MONGODB_URL}")

    client = AsyncIOMotorClient(settings.MONGODB_URL)
    database = client[settings.DATABASE_NAME]

    await beanie.init_beanie(
        database=database,
        document_models=[User, Video, Quiz, QuizAttempt],
    )

    # Drop existing collections for a clean reseed
    await User.find_all().delete()
    await Video.find_all().delete()
    await Quiz.find_all().delete()
    await QuizAttempt.find_all().delete()

    # ------------------------------------------------------------------ users
    student = User(
        email="student@example.com",
        password_hash=hash_password("Student@123"),
        role="student",
    )
    educator = User(
        email="educator@example.com",
        password_hash=hash_password("Educator@123"),
        role="educator",
    )
    await student.insert()
    await educator.insert()

    # ------------------------------------------------------------------ videos
    # Read video URLs from videos.txt (optional)
    video_urls: list[str] = []
    videos_txt_path = os.path.join(
        os.path.dirname(__file__), "..", "frontend", "public", "videos.txt"
    )
    if os.path.exists(videos_txt_path):
        with open(videos_txt_path, "r") as f:
            video_urls = [line.strip() for line in f if line.strip()]

    url1 = video_urls[0] if len(video_urls) > 0 else "/videos/video1.mp4"
    url2 = video_urls[1] if len(video_urls) > 1 else "/videos/video2.mp4"

    v1 = Video(
        title="Understanding Python Decorators",
        description="A quick dive into how decorators work in Python.",
        video_url=url1,
        duration=60,
        difficulty="medium",
        created_by=educator.id,
    )
    v2 = Video(
        title="Intro to Machine Learning",
        description="What is ML and how does it work?",
        video_url=url2,
        duration=52,
        difficulty="easy",
        created_by=educator.id,
    )
    await v1.insert()
    await v2.insert()

    # ------------------------------------------------------------------ quizzes (embedded options)
    qo1_id = uuid.uuid4().hex
    qo2_id = uuid.uuid4().hex
    qo3_id = uuid.uuid4().hex

    q1 = Quiz(
        video_id=v1.id,
        question="What is the primary purpose of a Python decorator?",
        timestamp=10.0,
        explanation="Decorators allow you to modify or extend the behavior of a function without changing its source code.",
        options=[
            QuizOption(id=qo1_id, option_text="Modify or extend function behavior", is_correct=True),
            QuizOption(id=qo2_id, option_text="Create a database connection", is_correct=False),
            QuizOption(id=qo3_id, option_text="Allocate memory", is_correct=False),
        ],
    )
    await q1.insert()

    qo4_id = uuid.uuid4().hex
    qo5_id = uuid.uuid4().hex
    qo6_id = uuid.uuid4().hex

    q2 = Quiz(
        video_id=v2.id,
        question="Which of the following is NOT a type of Machine Learning?",
        timestamp=20.0,
        explanation="Supervised, Unsupervised, and Reinforcement are the main types. Magic is not.",
        options=[
            QuizOption(id=qo4_id, option_text="Supervised Learning", is_correct=False),
            QuizOption(id=qo5_id, option_text="Magic Learning", is_correct=True),
            QuizOption(id=qo6_id, option_text="Reinforcement Learning", is_correct=False),
        ],
    )
    await q2.insert()

    # ------------------------------------------------------------------ quiz attempts
    attempt1 = QuizAttempt(
        user_id=student.id,
        quiz_id=q1.id,
        selected_option_id=qo1_id,
        is_correct=True,
    )
    attempt2 = QuizAttempt(
        user_id=student.id,
        quiz_id=q2.id,
        selected_option_id=qo4_id,
        is_correct=False,
    )
    await attempt1.insert()
    await attempt2.insert()

    client.close()

    print("MongoDB seeded successfully!")
    print("  Student login:  student@example.com / Student@123")
    print("  Educator login: educator@example.com / Educator@123")


if __name__ == "__main__":
    asyncio.run(seed_db())
