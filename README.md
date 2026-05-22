# TalentStream AI

TalentStream AI is an internal recruiter ATS built with Next.js 15, TypeScript, Prisma, Clerk, and Postgres. It is designed for fast recruiter workflows: create jobs, upload resumes, parse candidate data, score matches, and review applicants in one place.

## Features

- Internal recruiter dashboard with protected routes
- Job creation and editing with structured fields
- Resume upload with parsing, deduplication, and Cloudinary storage
- Candidate matching using embeddings, skill overlap, and experience signals
- Candidate detail drawer with status updates and recruiter notes
- Match explanation dialog for recruiters
- Prisma-backed persistence with Postgres

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL
- Clerk authentication
- Cloudinary uploads
- Tailwind CSS and Radix UI

## Prerequisites

- Node.js 18 or newer
- A PostgreSQL database
- Clerk account and application keys
- Cloudinary account and upload credentials
- Optional local AI services or API keys for embeddings and model fallback

## Environment Variables

Create a `.env.local` file in the project root and provide the values listed below.

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
DATABASE_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_EMBED_MODEL=nomic-embed-text
GROQ_API_KEY=
GROQ_CHAT_MODEL=llama-3.1-70b-versatile
```

## Getting Started

1. Install dependencies.

```bash
npm install
```

2. Generate the Prisma client.

```bash
npm run prisma:generate
```

3. Apply database migrations.

```bash
npm run prisma:migrate
```

4. Start the development server.

```bash
npm run dev
```

Open the app at `http://localhost:3000`.

## Useful Scripts

- `npm run dev` - start the local development server
- `npm run build` - build the production app
- `npm run start` - run the production build locally
- `npm run lint` - run ESLint
- `npm run prisma:generate` - generate the Prisma client
- `npm run prisma:migrate` - run Prisma migrations in development
- `npm run prisma:studio` - open Prisma Studio

## Project Structure

- `src/app` - App Router routes, pages, API routes, and auth-protected screens
- `src/components/ats` - ATS-specific UI components
- `src/components/ui` - shared UI primitives
- `src/lib` - data access, AI helpers, resume parsing, auth, and utilities
- `prisma/schema.prisma` - database schema

## Notes

- This project is intentionally recruiter-focused and does not include a public candidate portal.
- Matching scores are computed server-side and stored with the application record.
- Resume uploads are deduplicated and normalized before scoring.
