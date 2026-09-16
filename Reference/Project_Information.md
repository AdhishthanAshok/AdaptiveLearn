# AdaptiveLearn

> An adaptive short-form learning platform that combines the engagement of short-form videos with the structured learning and assessment of online education platforms.

AdaptiveLearn is a web-based educational platform where users learn through short, focused educational videos and are tested using interactive questions directly inside the learning experience.

Instead of showing random educational content, AdaptiveLearn tracks what the learner understands and where they struggle, then uses that information to personalize future content.

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Core Idea](#core-idea)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Adaptive Learning Flow](#adaptive-learning-flow)
- [Example User Journey](#example-user-journey)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [AI Pipeline](#ai-pipeline)
- [Recommendation Engine](#recommendation-engine)
- [Knowledge Tracking](#knowledge-tracking)
- [Interactive Video Questions](#interactive-video-questions)
- [Content Creation Pipeline](#content-creation-pipeline)
- [API Design](#api-design)
- [Frontend Architecture](#frontend-architecture)
- [Authentication](#authentication)
- [Video Processing](#video-processing)
- [Performance Considerations](#performance-considerations)
- [Security](#security)
- [Development Setup](#development-setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Development Roadmap](#development-roadmap)
- [Future Improvements](#future-improvements)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Goals](#project-goals)
- [License](#license)

---

# Overview

Traditional online learning platforms provide structured courses, while short-form video platforms provide highly engaging content.

AdaptiveLearn combines these two ideas:

```text
Short-form video engagement
            +
Interactive assessment
            +
Personalized learning
            =
        AdaptiveLearn
````

The platform is designed specifically for **educational content**.

Users select topics they are interested in and receive short educational videos focused on quick learning and revision.

During or after a video, the platform can present an interactive question to verify whether the learner understood the concept.

The learner's responses are then used to improve future content recommendations.

---

# Problem Statement

Short-form video platforms are highly engaging, but most of the content is designed for entertainment rather than structured learning.

Traditional learning platforms provide structured education, but they can require:

* Long courses
* Long lectures
* Significant time commitment
* Manual topic selection
* Passive video consumption

Another major problem is that watching educational content does not necessarily mean that the learner understood it.

For example:

```text
User watches:
"Python Decorators Explained"

        ↓

Video ends

        ↓

System assumes:
"User learned decorators"
```

There is no actual evidence that the learner understood the concept.

AdaptiveLearn introduces an assessment layer:

```text
Watch
  ↓
Understand
  ↓
Answer
  ↓
Evaluate
  ↓
Identify knowledge gaps
  ↓
Recommend next content
```

---

# Solution

AdaptiveLearn turns passive short-form video consumption into an interactive learning loop.

```text
┌───────────────┐
│ Select Topics │
└───────┬───────┘
        ↓
┌────────────────┐
│ Watch Short    │
│ Educational    │
│ Video          │
└───────┬────────┘
        ↓
┌────────────────┐
│ Interactive    │
│ Question       │
└───────┬────────┘
        ↓
   ┌────┴─────┐
   ↓          ↓
Correct      Wrong
   ↓          ↓
Increase     Identify
mastery      weakness
   ↓          ↓
   └────┬─────┘
        ↓
┌────────────────────┐
│ Personalized Next  │
│ Content            │
└────────────────────┘
```

The main principle is:

> **Learn → Test → Diagnose → Adapt**

---

# Core Idea

AdaptiveLearn is not intended to be another social media platform for educational videos.

The primary focus is:

1. Short learning sessions
2. Active recall
3. Knowledge-gap detection
4. Personalized recommendations
5. Quick revision

The platform prioritizes educational value over social-media engagement.

---

# Key Features

## 1. Short Educational Videos

Videos are designed to explain a specific concept quickly.

Example:

```text
Python
 └── Functions
      ├── Arguments
      ├── *args
      ├── **kwargs
      └── Decorators
```

Instead of a 30-minute lecture, the user can consume several focused videos.

---

## 2. Topic-Based Feed

Users select topics they want to learn.

Example:

```text
Interests:

[x] Python
[x] Machine Learning
[x] System Design
[ ] Blockchain
[ ] Chemistry
```

The feed is then generated based on these preferences.

---

## 3. Interactive MCQs

Questions can be triggered manually by the user via a "Take Quiz" button overlaid on the video.

Example:

```text
┌──────────────────────────────┐
│                              │
│       Educational Video      │
│                              │
│                 [Take Quiz]  │
├──────────────────────────────┤
│ What does *args store?       │
│                              │
│ ○ Dictionary                 │
│ ○ Tuple                      │
│ ○ List                       │
│ ○ Set                        │
│                              │
│           Submit             │
└──────────────────────────────┘
```

---

## 4. Manual Quiz Triggering

Instead of automatically pausing, users have control over when to test their knowledge. The "Take Quiz" button is always available during playback, allowing learners to check their understanding at any point.

Example:

```text
00:00 ───────────────────── 00:45
                       ↑
                 User clicks
                 "Take Quiz"
```

---

## 5. Explanation After Answer

The system can provide an explanation after the user answers.

Example:

```text
Your answer:
List

Correct answer:
Tuple

Why?

*args collects positional arguments into a tuple.
```

This turns the question into another learning opportunity.

---

## 6. Replay Relevant Content

When a learner answers incorrectly, the platform can replay the relevant section instead of forcing the user to restart the entire video.

Example:

```text
Question
   ↓
Wrong answer
   ↓
Explanation
   ↓
Replay relevant section
   ↓
Follow-up question
```

---

## 7. Personalized Recommendations

The next video is not selected purely randomly.

The recommendation system can consider:

* User interests
* Previous answers
* Incorrect answers
* Topic mastery
* Video difficulty
* Previous exposure
* Recency
* Revision requirements

---

## 8. Knowledge Tracking

The system maintains a knowledge state for individual concepts.

Example:

```text
Python Decorators       35%
Python Functions        82%
Python Classes          71%
Python Generators       48%
```

This allows the system to identify weak areas.

---

## 9. Quick Revision

The system can resurface concepts that the learner has previously studied.

Example:

```text
Monday:
Python Decorators

Tuesday:
Machine Learning

Wednesday:
System Design

Friday:
Python Decorators Revision
```

This can eventually be extended into a spaced-repetition system.

---

## 10. Educational-Only Content

The platform is designed around educational content.

Content categories can include:

* Programming
* Mathematics
* Science
* Engineering
* Finance
* Data Science
* Artificial Intelligence
* History
* General Knowledge
* Exam Preparation

---

# How It Works

A typical learning session looks like:

```text
User opens AdaptiveLearn
        ↓
Selects / confirms interests
        ↓
Personalized feed generated
        ↓
User watches educational reel
        ↓
Interactive question appears
        ↓
User submits answer
        ↓
System evaluates answer
        ↓
Knowledge state updated
        ↓
Recommendation engine recalculates
        ↓
Next video selected
```

---

# Adaptive Learning Flow

The main learning loop is:

```text
                 ┌───────────────┐
                 │ Watch Video   │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │ Ask Question  │
                 └───────┬───────┘
                         ↓
                  ┌──────┴──────┐
                  │   Answer    │
                  └──────┬──────┘
                         ↓
              ┌──────────┴──────────┐
              ↓                     ↓
          Correct                  Wrong
              ↓                     ↓
       Increase mastery       Reduce mastery
              ↓                     ↓
              └──────────┬──────────┘
                         ↓
                Update user state
                         ↓
               Recommendation
                         ↓
                   Next Video
```

---

# Example User Journey

Suppose the user selects:

```text
Python
Machine Learning
System Design
```

The system initially recommends:

```text
1. Python Decorators
2. Bias vs Variance
3. Load Balancing
```

The user watches:

```text
Python Decorators
```

The system asks:

```text
What is the primary purpose of a decorator?

A. Modify or extend function behavior
B. Create a database
C. Allocate memory
D. Compile Python code
```

The user answers incorrectly.

The system records:

```text
Concept:
Python Decorators

Result:
Incorrect

Knowledge score:
↓
```

Later, the recommendation engine prioritizes another video:

```text
"Python Decorators: Practical Example"
```

After the learner answers several questions correctly:

```text
Decorator mastery:
35%
      ↓
52%
      ↓
74%
      ↓
88%
```

The system can eventually move the learner to more advanced concepts.

---

# System Architecture

```text
                         ┌──────────────────┐
                         │   Next.js / Web  │
                         │     Frontend     │
                         └────────┬─────────┘
                                  │
                                  │ REST API
                                  ↓
                         ┌──────────────────┐
                         │     FastAPI      │
                         │     Backend      │
                         └────────┬─────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ↓                    ↓                    ↓
      ┌─────────────┐     ┌───────────────┐    ┌──────────────┐
      │ User / Auth │     │ Learning      │    │ Content      │
      │ Services    │     │ Engine        │    │ Service      │
      └─────────────┘     └───────┬───────┘    └──────┬───────┘
                                  │                    │
                                  ↓                    ↓
                         ┌────────────────┐    ┌──────────────┐
                         │ Recommendation │    │ Video Store  │
                         │ Engine         │    │ / Storage    │
                         └───────┬────────┘    └──────────────┘
                                 │
                                 ↓
                         ┌────────────────┐
                         │  PostgreSQL    │
                         └────────────────┘
                                 │
                                 ↓
                         ┌────────────────┐
                         │      LLM       │
                         │    Pipeline    │
                         └────────────────┘
```

---

# Technology Stack

## Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy

## Database

* PostgreSQL

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## AI

* LLM APIs
* LLM-based content processing
* Automated question generation
* Topic and difficulty classification

## Development

* Git
* GitHub
* Docker

---

# Project Structure

The initial project can follow:

```text
adaptivelearn/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py
│   │   │   │   ├── videos.py
│   │   │   │   ├── quizzes.py
│   │   │   │   ├── users.py
│   │   │   │   └── recommendations.py
│   │   │   │
│   │   │   └── router.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── video.py
│   │   │   ├── quiz.py
│   │   │   ├── attempt.py
│   │   │   └── knowledge.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── video.py
│   │   │   ├── quiz.py
│   │   │   └── recommendation.py
│   │   │
│   │   ├── services/
│   │   │   ├── video_service.py
│   │   │   ├── quiz_service.py
│   │   │   ├── learning_service.py
│   │   │   └── recommendation_service.py
│   │   │
│   │   ├── ai/
│   │   │   ├── question_generator.py
│   │   │   ├── topic_extractor.py
│   │   │   └── difficulty_classifier.py
│   │   │
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   └── migrations/
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   │
│   │   └── main.py
│   │
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── app/
│   │   ├── feed/
│   │   ├── topics/
│   │   ├── profile/
│   │   └── login/
│   │
│   ├── components/
│   │   ├── VideoPlayer.tsx
│   │   ├── QuizOverlay.tsx
│   │   ├── TopicSelector.tsx
│   │   └── ProgressBar.tsx
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── recommendation.md
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

# Database Design

The core database entities are:

```text
User
 │
 ├── UserInterest
 │
 ├── LearningProgress
 │
 └── QuizAttempt
             │
             ↓
           Quiz
             │
             ↓
           Video
             │
             ↓
          Topic
```

---

## Users

Stores user account information and roles.

**Roles**:
- **Student**: Can watch videos and answer quizzes.
- **Educator**: Can upload educational videos and create quizzes.

```text
users
-----
id
email
password_hash
role (student/educator)
created_at
updated_at
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

Stores educational video metadata and tracking. Only Educators can create videos.

```text
videos
------
id
title
description
video_url
duration
difficulty
transcript
view_count
created_at
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
selected_option
is_correct
answered_at
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

* Async FastAPI endpoints
* Database indexing
* Pagination
* Efficient recommendation queries
* Connection pooling

### Frontend

* Lazy video loading
* Prefetch next video
* Video buffering
* Optimized thumbnails
* Client-side caching

### Database

Indexes should be added for frequently queried fields such as:

```text
user_id
topic_id
video_id
created_at
difficulty
```

---

# Security

The backend should follow standard API security practices.

Important considerations:

* Password hashing
* Authentication middleware
* Authorization checks
* Input validation
* SQL injection protection
* Rate limiting
* Secure environment variables
* File upload validation
* Video upload size limits

Secrets should never be committed to Git.

---

# Development Setup

## Prerequisites

Install:

* Python 3.11+
* Node.js 20+
* PostgreSQL
* Git

Optional:

* Docker
* Docker Compose

---

# Clone Repository

```bash
git clone https://github.com/<username>/adaptivelearn.git

cd adaptivelearn
```

---

# Backend Setup

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# Frontend Setup

```bash
cd frontend

npm install
```

---

# Environment Variables

Create:

```text
.env
```

Example:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/adaptivelearn

SECRET_KEY=your_secret_key

LLM_API_KEY=your_api_key

VIDEO_STORAGE_URL=your_storage_url
```

Never commit `.env`.

Use:

```text
.env.example
```

for documenting required environment variables.

---

# Running the Backend

From the backend directory:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

# Running the Frontend

From the frontend directory:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# Docker

The project can eventually support running the complete development environment using Docker Compose.

Example:

```bash
docker compose up --build
```

Services:

```text
Frontend
Backend
PostgreSQL
```

---

# Development Roadmap

## Phase 1 — Foundation

* [ ] Repository setup
* [ ] FastAPI backend
* [ ] PostgreSQL database
* [ ] Next.js frontend
* [ ] Authentication
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
