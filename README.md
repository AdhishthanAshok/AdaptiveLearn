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

---

## Users

Stores user account information.

```text
users
-----
id
email
password_hash
role (student/educator)
created_at
last_active_at
```

---

## Topics

Represents educational topics.

```text
topics
------
id
name
description
parent_topic_id
created_at
```

Example:

```text
Machine Learning
    ├── Supervised Learning
    ├── Unsupervised Learning
    ├── Regression
    └── Classification
```

---

## Videos

Stores educational video metadata.

```text
videos
------
id
title
description
video_url
duration
difficulty
view_count
created_by (educator)
```

---

## Video Topics

A video can cover multiple concepts.

```text
video_topics
------------
video_id
topic_id
relevance_score
```

---

## Quizzes

```text
quizzes
-------
id
video_id
question
question_type
timestamp
explanation
difficulty
```

---

## Quiz Options

```text
quiz_options
------------
id
quiz_id
option_text
is_correct
```

---

## Quiz Attempts

Stores user answers.

```text
quiz_attempts
-------------
id
user_id
quiz_id
selected_option_id
is_correct
attempted_at
```

---

## User Knowledge

Stores estimated knowledge for individual concepts.

```text
user_knowledge
--------------
id
user_id
topic_id
mastery_score
questions_attempted
questions_correct
last_reviewed_at
```

---

# AI Pipeline

AdaptiveLearn can automate part of the educational content pipeline using LLMs.

The pipeline:

```text
Educational Video
       ↓
Speech-to-Text
       ↓
Transcript
       ↓
LLM Processing
       ↓
Concept Extraction
       ↓
Question Generation
       ↓
Difficulty Classification
       ↓
Content Validation
       ↓
Database
```

---

# Concept Extraction

Given a transcript:

```text
"A Python decorator allows you to modify the behavior
of a function without permanently changing its source code..."
```

The AI pipeline can identify:

```json
{
  "topics": [
    "Python",
    "Decorators",
    "Functions"
  ]
}
```

---

# Question Generation

The LLM can generate:

```json
{
  "question": "What is the purpose of a Python decorator?",
  "options": [
    "Modify function behavior",
    "Create a database",
    "Compile Python",
    "Manage memory"
  ],
  "correct_answer": 0,
  "difficulty": "easy",
  "explanation": "Decorators allow additional behavior..."
}
```

Generated content should ideally go through validation before being published.

---

# Recommendation Engine

The recommendation engine is responsible for deciding which video should appear next.

A basic scoring model can be:

```text
Recommendation Score =
    Topic Interest
    + Knowledge Gap
    + Difficulty Match
    + Recency
    + Revision Priority
    + Previous Performance
```

A simplified implementation:

```python
score = (
    interest_score * 0.25
    + weakness_score * 0.30
    + difficulty_score * 0.15
    + revision_score * 0.15
    + freshness_score * 0.15
)
```

The weights can later be optimized using real user interaction data.

---

# Knowledge Tracking

Each concept has an estimated mastery score.

Example:

```text
Concept                  Mastery
--------------------------------
Python Functions          91%
Decorators                42%
Generators                63%
Async Programming         28%
```

A correct answer can increase mastery:

```text
mastery += positive_update
```

An incorrect answer can decrease or slow mastery:

```text
mastery -= negative_update
```

The exact algorithm can later be replaced with a more advanced learner model.

---

# Interactive Video Questions

Questions can be connected to timestamps.

Example:

```json
{
  "video_id": 101,
  "timestamp": 24.5,
  "question_id": 205
}
```

Frontend behavior:

```text
Video starts
   ↓
24.5 seconds
   ↓
Pause video
   ↓
Show question
   ↓
User answers
   ↓
Show result
   ↓
Resume video
```

This prevents the assessment from feeling completely disconnected from the learning content.

---

# Content Creation Pipeline

Content can be created manually by educators or assisted by AI.

## Manual Flow

```text
Creator
  ↓
Upload video
  ↓
Add title
  ↓
Select topics
  ↓
Create questions
  ↓
Publish
```

## AI-Assisted Flow

```text
Creator uploads video
        ↓
Transcript generated
        ↓
AI extracts concepts
        ↓
AI generates questions
        ↓
Creator reviews questions
        ↓
Creator approves
        ↓
Publish
```

The second approach reduces content creation effort while keeping humans involved in final validation.

---

# API Design

The backend exposes REST APIs through FastAPI.

## Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

---

## Topics

```http
GET  /api/v1/topics
GET  /api/v1/topics/{topic_id}
POST /api/v1/users/me/topics
```

---

## Videos

```http
GET  /api/v1/videos
GET  /api/v1/videos/{video_id}
POST /api/v1/videos
```

---

## Feed

```http
GET /api/v1/feed
```

Example response:

```json
{
  "videos": [
    {
      "id": 101,
      "title": "Python Decorators",
      "duration": 42,
      "difficulty": "medium"
    }
  ]
}
```

---

## Quiz

```http
GET  /api/v1/videos/{video_id}/quiz
POST /api/v1/quizzes/{quiz_id}/attempt
```

---

## Learning Progress

```http
GET /api/v1/users/me/progress
GET /api/v1/users/me/knowledge
```

---

## Recommendations

```http
GET /api/v1/recommendations
```

---

# Frontend Architecture

The first version targets the web.

The interface follows a vertical short-form video experience.

Example:

```text
┌─────────────────────────────┐
│                             │
│                             │
│        VIDEO CONTENT        │
│                             │
│                             │
│                             │
│                             │
│                       ♡     │
│                       🔖    │
│                             │
│  Python Decorators          │
│  Learn how decorators work  │
│                             │
│ ──────────────────────────  │
│                             │
│          ↑ Swipe            │
└─────────────────────────────┘
```

The interface should minimize unnecessary distractions.

---

# Authentication

Authentication can initially support:

* Email/password
* Session management
* Protected API endpoints
* User-specific learning history

Authentication implementation can be extended later with third-party identity providers.

---

# Video Processing

Videos should be optimized for short-form delivery.

Initial constraints:

```text
Maximum duration: 45–60 seconds
Target quality:   720p
Format:           MP4
Orientation:      Vertical
```

The goal is to keep the initial system simple while maintaining sufficient educational quality.

---

# Performance Considerations

The application should be designed with low-latency feed loading in mind.

Potential optimizations:

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

* [x] Repository setup
* [x] FastAPI backend
* [x] PostgreSQL database
* [x] Next.js frontend
* [x] Authentication
* [ ] Basic user profile

---

## Phase 2 — Educational Feed

* [ ] Topic selection
* [ ] Video upload
* [ ] Video metadata
* [ ] Vertical video feed
* [ ] Video playback
* [ ] Basic pagination
* [ ] Bookmarking

---

## Phase 3 — Interactive Learning

* [ ] MCQ support
* [ ] Timestamp-based questions
* [ ] Answer submission
* [ ] Instant feedback
* [ ] Explanation
* [ ] Replay relevant section
* [ ] Attempt history

---

## Phase 4 — Adaptive Learning

* [ ] Topic mastery tracking
* [ ] Knowledge-gap detection
* [ ] Personalized feed
* [ ] Difficulty adjustment
* [ ] Revision scheduling
* [ ] Performance dashboard

---

## Phase 5 — AI Integration

* [ ] Video transcription
* [ ] Topic extraction
* [ ] Concept extraction
* [ ] AI question generation
* [ ] Difficulty classification
* [ ] AI-assisted content creation
* [ ] Question validation

---

## Phase 6 — Optimization

* [ ] Feed optimization
* [ ] Video prefetching
* [ ] Database indexing
* [ ] Recommendation optimization
* [ ] Caching
* [ ] API performance testing
* [ ] Load testing

---

# Future Improvements

Potential future features include:

### Advanced Recommendations

Replace rule-based recommendations with machine-learning-based ranking.

```text
User behavior
     ↓
Feature extraction
     ↓
Recommendation model
     ↓
Candidate ranking
     ↓
Personalized feed
```

---

### Spaced Repetition

Automatically resurface concepts based on previous performance.

```text
Weak concept
    ↓
Review
    ↓
Correct
    ↓
Wait longer
    ↓
Review again
```

---

### Difficulty Adaptation

If a learner consistently answers easy questions correctly:

```text
Easy
 ↓
Medium
 ↓
Hard
```

If performance decreases:

```text
Hard
 ↓
Medium
 ↓
Concept Revision
```

---

### Multiple Question Types

Future versions can support:

* MCQ
* True/False
* Fill in the blank
* Short answer
* Code completion
* Numerical answer
* Ordering questions

---

### Learning Analytics

Users could eventually see:

```text
Total videos watched
Questions attempted
Accuracy
Strongest topics
Weakest topics
Learning streak
Concept mastery
Time spent learning
```

---

### Creator Dashboard

Educators could manage:

```text
Videos
Topics
Questions
Learner performance
Question accuracy
Video completion rate
Concept difficulty
```

---

### Mobile Application

After validating the web version, the platform can be extended to:

* Android
* iOS

The backend APIs can remain shared between web and mobile clients.

---

# Testing

Testing should cover multiple layers.

## Unit Tests

Test:

* Recommendation scoring
* Knowledge updates
* Quiz evaluation
* Authentication
* Content validation

Example:

```text
test_correct_answer_updates_mastery()
test_wrong_answer_identifies_weak_topic()
test_recommendation_prioritizes_weak_topic()
```

---

## API Tests

Test:

```text
Authentication
Video APIs
Quiz APIs
Feed APIs
Recommendation APIs
Progress APIs
```

---

## Integration Tests

Test the complete learning loop:

```text
User
 ↓
Watch Video
 ↓
Answer Quiz
 ↓
Update Knowledge
 ↓
Generate Recommendation
 ↓
Return Next Video
```

---

# Deployment

The initial production architecture can be:

```text
                 Internet
                    │
                    ↓
              ┌───────────┐
              │ Frontend  │
              └─────┬─────┘
                    │
                    ↓
              ┌───────────┐
              │ FastAPI   │
              │ Backend   │
              └─────┬─────┘
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
    ┌───────────┐       ┌───────────┐
    │PostgreSQL │       │ AI / LLM  │
    └───────────┘       └───────────┘
```

Video files should be stored separately from the application server.

The backend stores metadata and references to the video storage location.

---

# Project Goals

The primary goals of AdaptiveLearn are:

1. Make educational content easier to consume.
2. Convert passive video watching into active learning.
3. Identify knowledge gaps through interactive assessments.
4. Personalize learning content based on user performance.
5. Provide quick revision through short-form educational content.
6. Build an architecture that can scale from a web MVP to a mobile platform.

---

# Design Philosophy

AdaptiveLearn follows three principles:

### 1. Short

Keep individual learning units focused and easy to consume.

### 2. Interactive

Don't assume that watching means learning.

Test the learner.

### 3. Adaptive

Don't show every learner the same content.

Use their performance to decide what they should learn next.

---

# Learning Loop

The central concept of AdaptiveLearn can be summarized as:

```text
              ┌─────────────┐
              │    LEARN    │
              └──────┬──────┘
                     ↓
              ┌─────────────┐
              │    TEST     │
              └──────┬──────┘
                     ↓
              ┌─────────────┐
              │  DIAGNOSE   │
              └──────┬──────┘
                     ↓
              ┌─────────────┐
              │    ADAPT    │
              └──────┬──────┘
                     ↓
              ┌─────────────┐
              │ LEARN AGAIN │
              └─────────────┘
```

This loop is the core of the platform.

---

# Status

**Project Status:** 🚧 In Development

The initial version focuses on the web platform.

Mobile applications are planned after validating the core learning experience.

---

# License

This project is currently intended as a personal/portfolio project.

License information will be added before public distribution.
