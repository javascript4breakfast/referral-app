# Referral App (Take-Home)

A compact TypeScript + Next.js application that showcases a referral-driven user acquisition flow. It supports new user signups, invitation sending, and conversion tracking so we can attribute referred signups back to their inviters.

## Core Goals

- Implement end-to-end referral mechanics: signup, invite creation, and acceptance.
- Attribute every referred signup to the original inviter and surface key conversion metrics.
- Provide a runnable demo that evaluators can deploy and explore quickly.
- Document setup, workflows, and assumptions clearly within the 6-hour build window.

## Tech Stack

- Next.js (App Router) for the UI and API routes
- TypeScript for type safety    
- Prisma ORM with SQLite for persistence
- ESLint + Prettier for linting and formatting
- Vitest for unit-level coverage

## Project Structure

- `src/app` – Next.js routes, including referral dashboard and invite APIs
- `src/components` – UI components such as the invite form and metrics widgets
- `src/lib` – Shared utilities (Prisma client, metrics helpers, ID generation)
- `prisma` – Schema definition and generated SQLite database

## Getting Started

Prerequisites: Node.js 18+, `pnpm`, and SQLite (bundled with most Node installs).

1. Install dependencies:
  
   pnpm install
   2. Create a `.env` file with the database connection:
  
   echo 'DATABASE_URL="file:./prisma/dev.db"' > .env
      Adjust the path if you prefer a different SQLite location.
3. Run database migrations (also seeds the schema):
  
   pnpm prisma migrate dev --name init
   4. Start the development server:
  
   pnpm dev
      The app runs at `http://localhost:3000`.

## Email Configuration

The app uses [Resend](https://resend.com) for sending invitation emails. Email functionality works in two modes:

### Development Mode (Default)
Without an API key, emails are logged to the console instead of being sent. This is perfect for development and testing.

### Production Mode
To send real emails, add these environment variables to your `.env` file:

```bash
RESEND_API_KEY="re_your_api_key_here"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

Get your API key by signing up at [resend.com](https://resend.com). You'll need to verify your sending domain to send emails in production.

## Available Scripts

- `pnpm dev` – Start Next.js in development mode.
- `pnpm build` / `pnpm start` – Produce and serve a production build.
- `pnpm lint` – Run ESLint and Prettier checks.
- `pnpm test` – Execute unit tests with Vitest.
- `pnpm prisma studio` – Inspect the SQLite data via Prisma Studio.

## Testing & QA

- Unit tests live alongside their modules; extend them when adding new logic.
- Stub external dependencies (email provider, analytics) as needed to focus on core referral logic.
- Consider adding integration tests for critical referral flows if time allows.

## Deployment

Deploy the app to any platform that supports Next.js (e.g., Vercel). Be sure to configure the `DATABASE_URL` environment variable in the hosting environment and run `prisma migrate deploy` during build or release.

## Documentation & Follow-Up

- Track any open TODOs directly in the code (search for `TODO:`).
- Include metrics screenshots or short Loom demos if helpful when submitting.