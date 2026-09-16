"""
This script seeds the database with sample data.
It works seamlessly across both local PostgreSQL and Aiven cloud PostgreSQL.
Uses bcrypt to properly hash passwords for seeded users.
"""
from app.db.database import SessionLocal, engine, Base
from app.models.models import Video, Quiz, QuizOption, User, QuizAttempt
from app.core.config import settings
from app.core.security import hash_password


def seed_db():
    # Mask password in URL for display
    url = str(engine.url)
    if engine.url.password:
        url = url.replace(engine.url.password, "******")
    print(f"Connecting to database [{settings.ENVIRONMENT}]: {url}")

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed users with properly hashed passwords
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
    db.add_all([student, educator])
    db.commit()
    db.refresh(student)
    db.refresh(educator)

    # Read video URLs from videos.txt
    video_urls = []
    import os
    videos_txt_path = os.path.join(
        os.path.dirname(__file__), "..", "frontend", "public", "videos.txt"
    )
    if os.path.exists(videos_txt_path):
        with open(videos_txt_path, "r") as f:
            video_urls = [line.strip() for line in f if line.strip()]

    # Fallbacks in case videos.txt is missing or doesn't have enough lines
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

    db.add(v1)
    db.add(v2)
    db.commit()
    db.refresh(v1)
    db.refresh(v2)

    q1 = Quiz(
        video_id=v1.id,
        question="What is the primary purpose of a Python decorator?",
        timestamp=10.0,
        explanation="Decorators allow you to modify or extend the behavior of a function without changing its source code.",
    )
    db.add(q1)
    db.commit()
    db.refresh(q1)

    qo1 = QuizOption(quiz_id=q1.id, option_text="Modify or extend function behavior", is_correct=True)
    qo2 = QuizOption(quiz_id=q1.id, option_text="Create a database connection", is_correct=False)
    qo3 = QuizOption(quiz_id=q1.id, option_text="Allocate memory", is_correct=False)
    db.add_all([qo1, qo2, qo3])
    db.commit()
    db.refresh(qo1)

    q2 = Quiz(
        video_id=v2.id,
        question="Which of the following is NOT a type of Machine Learning?",
        timestamp=20.0,
        explanation="Supervised, Unsupervised, and Reinforcement are the main types. Magic is not.",
    )
    db.add(q2)
    db.commit()
    db.refresh(q2)

    qo4 = QuizOption(quiz_id=q2.id, option_text="Supervised Learning", is_correct=False)
    qo5 = QuizOption(quiz_id=q2.id, option_text="Magic Learning", is_correct=True)
    qo6 = QuizOption(quiz_id=q2.id, option_text="Reinforcement Learning", is_correct=False)
    db.add_all([qo4, qo5, qo6])
    db.commit()

    # Seed sample quiz attempts for the student
    attempt1 = QuizAttempt(
        user_id=student.id,
        quiz_id=q1.id,
        selected_option_id=qo1.id,
        is_correct=True,
    )
    attempt2 = QuizAttempt(
        user_id=student.id,
        quiz_id=q2.id,
        selected_option_id=qo4.id,
        is_correct=False,
    )
    db.add_all([attempt1, attempt2])
    db.commit()

    print("Database seeded successfully!")
    print(f"  Student login:  student@example.com / Student@123")
    print(f"  Educator login: educator@example.com / Educator@123")


if __name__ == "__main__":
    seed_db()
