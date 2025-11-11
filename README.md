# Referral App (Take-Home)

A small TypeScript + Next.js app that demonstrates a referral flow:
users sign up, invite friends, and we attribute/track conversions.

## Stack

- Next.js (App Router) – UI + API in one repo
- TypeScript
- Prisma + SQLite
- ESLint + Prettier
- Vitest (unit)

## Getting Started

```bash
pnpm i
cp .env.example .env   # or create .env with the vars below
pnpm prisma migrate dev --name init
pnpm dev