# Deployment Guide for Vercel

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- Vercel CLI installed: `npm i -g vercel`

## Database Options for Production

⚠️ **Important**: SQLite won't work on Vercel's serverless environment. Choose one of these options:

### Option 1: Turso (Recommended - SQLite in the Cloud)
Turso provides SQLite as a service, perfect for this app.

1. Sign up at https://turso.tech
2. Install Turso CLI: `curl -sSfL https://get.tur.so/install.sh | bash`
3. Create a database:
   ```bash
   turso db create referral-app
   turso db show referral-app
   ```
4. Get connection URL:
   ```bash
   turso db show referral-app --url
   ```
5. Update `prisma/schema.prisma` datasource to:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
6. Set DATABASE_URL in Vercel to your Turso URL

### Option 2: Vercel Postgres (Alternative)
1. Go to your Vercel project → Storage → Create Database → Postgres
2. Copy the DATABASE_URL environment variable
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Regenerate migrations for PostgreSQL:
   ```bash
   rm -rf prisma/migrations
   pnpm prisma migrate dev --name init
   ```

## Environment Variables Required

Set these in your Vercel project settings:

```bash
# Database (required)
DATABASE_URL="your-database-url-here"

# NextAuth (required)
NEXTAUTH_SECRET="your-random-secret-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="https://your-app.vercel.app"

# Application (required)
NEXT_PUBLIC_BASE_URL="https://your-app.vercel.app"

# Email (optional - for production email sending)
RESEND_API_KEY="re_your_api_key_here"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

## Deployment Steps

### Step 1: Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
From the project root:
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No**
- What's your project's name? **referral-app** (or your choice)
- In which directory is your code located? **./**
- Want to override settings? **No**

### Step 4: Set Environment Variables
After deployment, set environment variables:

```bash
# Navigate to your project settings on Vercel dashboard, or use CLI:
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add NEXT_PUBLIC_BASE_URL

# Optional email config:
vercel env add RESEND_API_KEY
vercel env add RESEND_FROM_EMAIL
```

### Step 5: Run Database Migrations
For Turso or any remote database:

```bash
# Set DATABASE_URL locally to your production database
export DATABASE_URL="your-production-database-url"

# Push the schema
pnpm prisma db push

# Or run migrations
pnpm prisma migrate deploy
```

### Step 6: Redeploy
After setting environment variables and running migrations:

```bash
vercel --prod
```

## Quick Start (Using Turso)

```bash
# 1. Create Turso database
turso db create referral-app
TURSO_URL=$(turso db show referral-app --url)
TURSO_TOKEN=$(turso db tokens create referral-app)

# 2. Deploy to Vercel
vercel

# 3. Set environment variables
vercel env add DATABASE_URL production
# Paste: $TURSO_URL?authToken=$TURSO_TOKEN

vercel env add NEXTAUTH_SECRET production
# Generate and paste: $(openssl rand -base64 32)

vercel env add NEXTAUTH_URL production
# Paste your Vercel URL (e.g., https://referral-app-xxx.vercel.app)

vercel env add NEXT_PUBLIC_BASE_URL production
# Paste your Vercel URL

# 4. Push database schema
DATABASE_URL="$TURSO_URL?authToken=$TURSO_TOKEN" pnpm prisma db push

# 5. Deploy to production
vercel --prod
```

## Verification

After deployment:

1. Visit your app URL
2. Check the health endpoint: `https://your-app.vercel.app/api/health`
3. Sign up a new user
4. Test the referral flow

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all environment variables are set
- Verify Prisma schema matches your database

### Database Connection Issues
- Verify DATABASE_URL is correct
- For Turso, ensure auth token is included
- Check database is accessible from Vercel's regions

### Email Not Sending
- Verify RESEND_API_KEY is set
- Check Resend dashboard for logs
- In development, emails log to console (expected behavior)

## Local Development with Production Database

To test with the production database locally:

```bash
# Copy production DATABASE_URL to .env.local
echo 'DATABASE_URL="your-production-url"' >> .env.local

# Run dev server
pnpm dev
```

---

**Note**: This deployment guide assumes you want to keep SQLite (via Turso). If you prefer PostgreSQL, follow Option 2 and update the schema accordingly.

