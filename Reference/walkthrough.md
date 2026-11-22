# AdaptiveLearn - Project Walkthrough

I have successfully implemented the core foundation and advanced backend features for the AdaptiveLearn project!

> [!NOTE]
> We have evolved the architecture from the initial SQLite draft to a robust setup utilizing PostgreSQL and role-based authentication, all while maintaining the clean "Learn → Test" core loop.

## What Was Built

### 1. Backend (FastAPI)
- **Architecture**: Established a scalable structure (`app/api/routes`, `app/models`, `app/schemas`, `app/db`).
- **Database**: Integrated PostgreSQL. The project supports a local database for development (`.env`) and an Aiven PostgreSQL database for production (`.env.production`).
- **Models**: Created `Video`, `Quiz`, `QuizOption`, `User`, and `QuizAttempt` SQLAlchemy models.
- **Authentication**: Implemented role-based access control with `student` and `educator` roles. User passwords are securely hashed using bcrypt.
- **API**: Exposed REST endpoints:
  - `GET /api/v1/feed` - Fetches the personalized video feed.
  - `GET /api/v1/videos/{id}/quiz` - Fetches the interactive quiz for a specific video.
  - `POST /api/v1/quizzes/{id}/attempt` - Evaluates the user's answer and returns the explanation.
  - Auth routes for login and session management.
- **Seed Script**: Re-engineered `seed.py` to seamlessly populate PostgreSQL with placeholder video concepts (Python Decorators & Machine Learning) and sample educator/student accounts.

### 2. Frontend (Next.js & Tailwind CSS)
- **App Directory**: Built a responsive, vertical video feed UI using Next.js App Router and Tailwind CSS.
- **VideoPlayer Component**: A sleek component with a clean, asymmetrical layout. Action buttons are arranged in a right-aligned vertical sidebar, while the Video Title, Views, and "Take Quiz" buttons are organized at the bottom.
- **QuizOverlay Component**: A clean overlay that presents the multiple-choice question, provides immediate feedback (correct/incorrect) upon submission, and shows the educational explanation.
- **Strict Premium Aesthetics**: Implemented a disciplined, high-contrast design using neutral `zinc` backgrounds and an `emerald` accent color.

## How to Verify

Both development servers are ready to be tested!

1. **Database Setup**: Ensure PostgreSQL is running locally, or you have set up your `.env` variables to point to your cloud instance.
2. **Seed the DB**: Run `python backend/seed.py` to populate test accounts.
3. **Open the Frontend**: Go to [http://localhost:3000](http://localhost:3000) in your browser.
4. **Trigger the Quiz**: Watch the video (or scrub forward). At the predefined timestamp, the video will pause, and a quiz will appear.
5. **Backend API Docs**: View the auto-generated Swagger UI for the FastAPI backend at [http://localhost:8000/docs](http://localhost:8000/docs).

> [!TIP]
> The foundation is solid. The next major milestones involve building the personalized Recommendation Engine and integrating LLMs for automated content processing.

- **To run backend**: `cd backend && uvicorn app.main:app --reload --port 8000`
- **To run frontend**: `cd frontend && npm run dev`

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@example.com` | `Student@123` |
| Educator | `educator@example.com` | `Educator@123` |