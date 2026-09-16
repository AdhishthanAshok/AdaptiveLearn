# AdaptiveLearn - Foundation Draft Walkthrough

I have successfully laid the foundation for the AdaptiveLearn project based on the requirements in `Project_Information.md`!

> [!NOTE]
> We focused on establishing a clean architecture for the "Learn → Test" loop, prioritizing speed of setup with an SQLite database and a simple mocked video feed.

## What Was Built

### 1. Backend (FastAPI)
- **Architecture**: Created a scalable structure (`app/api/routes`, `app/models`, `app/schemas`, `app/db`).
- **Database**: Initialized an SQLite database for V1 to reduce setup friction.
- **Models**: Created `Video`, `Quiz`, and `QuizOption` SQLAlchemy models.
- **API**: Exposed REST endpoints:
  - `GET /api/v1/feed` - Fetches the initial video feed.
  - `GET /api/v1/videos/{id}/quiz` - Fetches the interactive quiz for a specific video.
  - `POST /api/v1/quizzes/{id}/attempt` - Evaluates the user's answer and returns the explanation.
- **Seed Script**: Executed a script to pre-populate the database with two placeholder video concepts (Python Decorators & Machine Learning) and their respective quizzes.

### 2. Frontend (Next.js & Tailwind CSS)
- **App Directory**: Built a responsive, vertical video feed UI using Next.js App Router and Tailwind CSS.
- **VideoPlayer Component**: A sleek component with a clean, asymmetrical layout. Action buttons (Like, Comment, Bookmark, Share) are arranged in a right-aligned vertical sidebar, while the Video Title, Views, and "Take Quiz" buttons are neatly organized at the bottom.
- **QuizOverlay Component**: A clean overlay that presents the multiple-choice question, provides immediate feedback (correct/incorrect) upon submission, and shows the educational explanation.
- **Strict Premium Aesthetics**: Implemented a disciplined, high-contrast design using neutral `zinc` backgrounds and an `emerald` accent color. Features explicitly styled component states (hover/focus/active) with clean `lucide-react` iconography, avoiding unmotivated generic drop-shadows and neon glows.

## How to Verify

Both development servers are currently running in the background! You can test the application right now.

1. **Open the Frontend**: Go to [http://localhost:3000](http://localhost:3000) in your browser.
2. **Explore the Feed**: You should see a vertical video player.
3. **Trigger the Quiz**: Watch the video (or scrub forward). At the predefined timestamp, the video will pause, and a quiz will appear.
4. **Learn and Test**: Answer the question and observe the feedback system in action.
5. **Backend API Docs**: You can also view the auto-generated Swagger UI for the FastAPI backend at [http://localhost:8000/docs](http://localhost:8000/docs).

> [!TIP]
> This is a foundational draft. From here, we can start implementing actual user authentication, PostgreSQL integration, or the LLM-powered content generation pipeline!


- **To run backend**: uvicorn app.main:app --reload --port 8000
- **To run frontend**: npm run dev
