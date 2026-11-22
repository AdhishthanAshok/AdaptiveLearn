# Database Integration & Architecture

This document describes the database configuration for the AdaptiveLearn project.

## Goal

The project uses PostgreSQL for all data storage. The setup is designed to seamlessly switch between local development and cloud production environments without changing the underlying architecture or ORM logic.

### Environments

```text
Local development
    ↓
Local PostgreSQL

Cloud / Production
    ↓
Aiven PostgreSQL
```

## Environment Variables

### Local Environment
For local development, the database connection is managed via the `.env` file located in the `backend/` directory:

```env
# backend/.env
DATABASE_URL=postgresql://postgres:password@localhost:5432/adaptivelearn
ENVIRONMENT=development
```

### Production Environment
For cloud deployments (or cloud testing), the database connection is managed via the `.env.production` file:

```env
# backend/.env.production
DATABASE_URL=postgresql://avnadmin:PASSWORD@AIVEN_HOST:AIVEN_PORT/DATABASE_NAME?sslmode=require
ENVIRONMENT=production
```

**Important**: Aiven credentials are not hardcoded anywhere in the source code. The actual `DATABASE_URL` is provided through environment variables and secrets in the CI/CD pipeline or hosting platform.

## Configuration Details

- **Database Engine**: PostgreSQL
- **ORM**: SQLAlchemy (Python)
- **Local Connection**: Requires a local PostgreSQL instance running.
- **Aiven Connection**: Requires `sslmode=require` in the connection string.

## Running the Application

The application can load different environments using standard Python `python-dotenv` mechanisms. In `backend/app/core/config.py`, settings are loaded from `.env` or `.env.production` depending on the environment.

### Local Development
To run the backend against the local database:
```bash
cd backend
uvicorn app.main:app --reload
```

### Seeding the Database
A seed script is provided to pre-populate either environment with roles and sample content.
```bash
python backend/seed.py
```
This script respects the active environment configuration, correctly seeding either the local instance or the Aiven cloud database.

## Principles Followed
- No duplicated database configuration/code.
- Unified SQLAlchemy models and schemas.
- No hardcoded cloud credentials.
- Aiven SSL requirement strictly enforced via `sslmode=require`.
