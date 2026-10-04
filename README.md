# AdaptiveLearn

> An adaptive short-form learning platform that turns educational videos into personalized, interactive learning sessions.

AdaptiveLearn combines the engagement of short-form video with quizzes, knowledge tracking, and personalized recommendations. Instead of assuming that watching means learning, the platform tests understanding and adapts future content based on each learner's performance.

## How It Works

```text
Choose topics
     ↓
Watch a focused educational video
     ↓
Answer an interactive question
     ↓
Evaluate understanding
     ↓
Update topic mastery
     ↓
Recommend the next best video
```

**Learn → Test → Diagnose → Adapt**

## Key Features

- **Short educational videos** focused on one concept at a time
- **Topic-based feeds** based on learner interests
- **Interactive quizzes** shown during or after videos
- **Timestamp-based questions** connected to relevant video sections
- **Instant explanations** and relevant-content replay after an answer
- **Knowledge tracking** for individual topics and concepts
- **Personalized recommendations** based on interests, weaknesses, difficulty, and revision needs
- **Quick revision** through resurfaced concepts and future spaced repetition support
- **AI-assisted content creation** for transcripts, topic extraction, question generation, and difficulty classification

## Example

A learner watches a video about Python decorators and answers a question incorrectly. AdaptiveLearn records the knowledge gap, updates the learner's mastery score, explains the answer, and recommends related content for reinforcement.

```text
Python Decorators mastery:
35% → 52% → 74% → 88%
```

## Architecture

```text
Next.js / React frontend
          ↓ REST API
FastAPI backend
          ↓
Learning and recommendation services
          ↓
PostgreSQL database
          ↓
LLM content pipeline
```

The platform is organized around users, topics, videos, quizzes, quiz attempts, and per-topic learning progress.

## Technology Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI, Pydantic, SQLAlchemy
- **Database:** PostgreSQL
- **AI:** LLM APIs for transcript processing and question generation
- **Infrastructure:** Docker and GitHub

## AI Content Pipeline

```text
Video
  ↓
Speech-to-text transcript
  ↓
Topic and concept extraction
  ↓
Question generation
  ↓
Difficulty classification
  ↓
Content validation
  ↓
Publish
```

AI-generated content should be reviewed and validated before it is made available to learners.

## Recommendation Engine

Recommendations can combine:

- Topic interests
- Knowledge gaps and mastery scores
- Previous quiz performance
- Video difficulty
- Content freshness
- Revision priority

A future version can replace the initial rule-based scoring system with a machine-learning ranking model.

## Project Structure

```text
AdaptiveLearn/
├── backend/       # FastAPI API, services, models, and tests
├── frontend/      # Next.js web application
├── docs/          # Architecture and API documentation
├── .env.example   # Environment variable template
├── docker-compose.yml
└── README.md
```

## Development Setup

### Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL
- Git
- Docker (optional)

### Clone the repository

```bash
git clone https://github.com/AdhishthanAshok/AdaptiveLearn.git
cd AdaptiveLearn
```

### Backend

```bash
cd backend
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\\Scripts\\activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`, with interactive documentation at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The web application is available at `http://localhost:3000`.

### Environment Variables

Create a `.env` file using `.env.example` as a reference:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/adaptivelearn
SECRET_KEY=your_secret_key
LLM_API_KEY=your_api_key
VIDEO_STORAGE_URL=your_storage_url
```

Never commit secrets or the `.env` file.

### Docker

```bash
docker compose up --build
```

## Roadmap

- [ ] Authentication and user profiles
- [ ] Topic selection and personalized feed
- [ ] Video upload and playback
- [ ] Interactive and timestamp-based quizzes
- [ ] Quiz explanations and answer history
- [ ] Topic mastery and knowledge-gap tracking
- [ ] Personalized recommendations
- [ ] AI-assisted transcription and question generation
- [ ] Revision scheduling and spaced repetition
- [ ] Performance analytics and creator tools
- [ ] Mobile applications

## Project Status

**In development.** The initial goal is to validate the web-based learning experience before expanding to mobile platforms and more advanced recommendation models.

## License

This project is currently intended as a personal/portfolio project. License information will be added before public distribution.
