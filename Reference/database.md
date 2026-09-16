```text
Local development → Local PostgreSQL
Production        → Aiven PostgreSQL
```

And ideally:

```bash
npm run dev       → local DB
npm run dev:cloud → Aiven DB
npm run start     → production/cloud DB
```

Here is the short document I'd give Antigravity.

---

# Aiven PostgreSQL — Cloud Database Integration

## Goal

The project already has a working local PostgreSQL database and database integration.

**Do not change the existing database architecture, ORM, schema, models, or migrations.**

Only modify the database connection configuration so that different environments can use different PostgreSQL instances.

### Required behavior

```text
Local development
    ↓
Local PostgreSQL

Cloud / Production
    ↓
Aiven PostgreSQL
```

## Environment variables

Keep the existing local database configuration:

```env
# .env
DATABASE_URL=postgresql://localhost:5432/my_database
```

Add a separate production/cloud environment file:

```env
# .env.production
DATABASE_URL=postgresql://avnadmin:PASSWORD@AIVEN_HOST:AIVEN_PORT/DATABASE_NAME?sslmode=require
```

**Do not hardcode the Aiven credentials anywhere in the source code.**

The actual Aiven `DATABASE_URL` will be provided through environment variables/secrets.

## Aiven configuration

Aiven PostgreSQL:

```text
Project: resume-projects
Service: postgres-main
User: avnadmin
SSL: Required
```

Use the database created for this application.

The Aiven connection must use:

```text
sslmode=require
```

## Scripts

Modify the existing package scripts only as necessary so that:

```bash
npm run dev
```

continues using the **local database**.

A separate command may be added for cloud testing, for example:

```bash
npm run dev:cloud
```

which loads the cloud/Aiven environment.

Production should automatically use the production environment:

```bash
npm run build
npm start
```

Use the environment-loading mechanism appropriate for the project's existing framework. **Do not introduce unnecessary dependencies.**

## Important

- Keep the existing local DB working exactly as it does now.
- Do not duplicate database configuration/code.
- Do not change existing models/schema.
- Do not create a second ORM.
- Do not hardcode Aiven credentials.
- Do not expose `DATABASE_URL` to the frontend.
- Do not commit production credentials to Git.
- Use Aiven's SSL connection.
- Verify both local and cloud connections after the change.

## Expected result

```text
npm run dev
       ↓
.env
       ↓
LOCAL PostgreSQL


npm run dev:cloud
       ↓
.env.production / cloud environment
       ↓
AIVEN PostgreSQL


Production deployment
       ↓
Production environment variable
       ↓
AIVEN PostgreSQL
```

### Antigravity instruction

> Inspect the existing project first. Make the **minimum possible changes** required to support separate local and Aiven PostgreSQL connections. Preserve the existing database layer completely. Implement environment-based switching and give me the exact commands/files changed after implementation.
