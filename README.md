# Referrly - Referral Management System

> **Live Demo:** [https://referral-app-gold.vercel.app](https://referral-app-gold.vercel.app)

A full-stack TypeScript referral management application built with Next.js 16, featuring user authentication, invite tracking, email notifications, and comprehensive analytics. Track your referral performance with detailed conversion metrics and manage your entire referral network from an intuitive dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)
![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)

## ✨ Features

### 🔐 **Authentication & Authorization**
- **Secure Sign Up/Login** - Password-based authentication with bcrypt hashing
- **NextAuth Integration** - JWT-based sessions for scalable authentication
- **Protected Routes** - Automatic redirects for authenticated/unauthenticated users
- **Session Management** - Persistent sessions with automatic token refresh

### 📊 **Referral Tracking & Analytics**
- **Unique Referral Codes** - Automatically generated 6-character codes for each user
- **Conversion Tracking** - Real-time tracking of invite acceptance and signup conversions
- **Performance Metrics**:
  - Total invites sent
  - Accepted invites count
  - Pending invites tracking
  - Conversion rate calculation
  - Referral success rate

### 📧 **Email Invitation System**
- **Invite by Email** - Send referral invitations directly from the dashboard
- **Resend Integration** - Professional email delivery with Resend API
- **Custom Referral Links** - Personalized signup URLs with referral codes
- **Duplicate Prevention** - Automatic checks to prevent duplicate invites
- **Email Status Tracking** - Monitor sent, accepted, and pending invites

### 🎨 **User Interface**
- **Modern Design** - Clean, responsive UI with Adobe React Spectrum components
- **Dark/Light Mode** - Theme toggle for user preference
- **Real-time Updates** - Live metrics and invite status updates
- **Responsive Layout** - Mobile-first design that works on all devices
- **Copy to Clipboard** - One-click referral link copying

### 🛡️ **Security & Best Practices**
- **Input Validation** - Email and password validation on client and server
- **SQL Injection Protection** - Prisma ORM with parameterized queries
- **Environment Variables** - Secure credential management
- **HTTPS Only** - Secure connections in production
- **Rate Limiting Ready** - Middleware support for API protection

### 📈 **Dashboard Features**
- **Overview Metrics** - At-a-glance performance indicators
- **Recent Activity** - List of recent invites with status
- **Referral History** - Track all successful referrals
- **Shareable Links** - Easy-to-share referral URLs

## 🏗️ Tech Stack

### **Frontend**
- **Next.js 16.0.1** - React framework with App Router
- **TypeScript 5.x** - Type-safe development
- **Adobe React Spectrum** - Enterprise-grade UI components
- **CSS Modules** - Scoped styling with zero runtime overhead

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth 4.24** - Authentication solution
- **Prisma 6.19** - Type-safe ORM
- **PostgreSQL (Neon)** - Serverless Postgres database
- **bcrypt** - Password hashing

### **Infrastructure**
- **Vercel** - Deployment and hosting
- **Neon** - Managed PostgreSQL database
- **Resend** - Transactional email delivery
- **GitHub** - Version control

### **Testing & Quality**
- **Vitest** - Unit testing framework
- **Testing Library** - Component testing utilities
- **ESLint** - Code linting
- **TypeScript** - Compile-time type checking

## 📁 Project Structure

```
referral-app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── auth/            # NextAuth endpoints
│   │   │   ├── health/          # Health check
│   │   │   ├── invites/         # Invite management
│   │   │   └── signup/          # User registration
│   │   ├── dashboard/           # User dashboard
│   │   ├── login/               # Login page
│   │   ├── signup/              # Registration page
│   │   └── page.tsx             # Landing page
│   ├── components/              # Reusable React components
│   │   ├── CopyReferralLink.tsx
│   │   ├── InviteForm.tsx
│   │   ├── Metrics.tsx
│   │   ├── Navbar.tsx
│   │   ├── RedirectLoader.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/                # React Context providers
│   │   └── ThemeContext.tsx
│   ├── lib/                     # Utility functions
│   │   ├── auth.ts             # Auth helpers
│   │   ├── email.ts            # Email service
│   │   ├── ids.ts              # ID generation
│   │   ├── metrics.ts          # Analytics helpers
│   │   └── prisma.ts           # Database client
│   ├── types/                   # TypeScript definitions
│   └── middleware.ts            # Route protection
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Database migrations
│   └── seed.ts                 # Seed data
├── vitest.config.ts            # Test configuration
└── tests/                      # Test files
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **pnpm** (or npm/yarn)
- **PostgreSQL database** (or use Neon)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/javascript4breakfast/referral-app.git
   cd referral-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   # Database (Local Development)
   DATABASE_URL="file:./prisma/dev.db"

   # Or use PostgreSQL/Neon for production-like development
   # DATABASE_URL="postgresql://user:password@host:5432/database"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"

   # Application
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"

   # Email (Optional - emails log to console without this)
   RESEND_API_KEY="re_your_api_key"
   RESEND_FROM_EMAIL="noreply@yourdomain.com"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm prisma generate

   # Run migrations
   pnpm prisma migrate dev --name init

   # (Optional) Seed the database
   pnpm prisma db seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

The project includes a comprehensive test suite covering API routes and utility functions.

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test -- --coverage

# Run tests with UI
pnpm test:ui
```

**Test Coverage:**
- ✅ Signup API (7/7 tests passing)
- ✅ Health Check API (3/3 tests passing)
- ✅ ID Generation utilities (3/3 tests passing)
- ✅ Invite API (6 tests)
- ✅ Metrics calculations (5 tests)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run test suite |
| `pnpm test:ui` | Run tests with UI |
| `pnpm prisma:studio` | Open Prisma Studio |
| `pnpm db:reset` | Reset local database |

## 🌐 Deployment

### Deploying to Vercel

1. **Create a Neon Database**
   - Sign up at [https://neon.tech](https://neon.tech)
   - Create a new database
   - Copy the connection string

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel**
   
   Go to your project settings and add:
   ```bash
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-production-secret"
   NEXTAUTH_URL="https://your-app.vercel.app"
   NEXT_PUBLIC_BASE_URL="https://your-app.vercel.app"
   RESEND_API_KEY="re_..."  # Optional
   RESEND_FROM_EMAIL="noreply@yourdomain.com"  # Optional
   ```

4. **Run Database Migrations**
   ```bash
   # Pull environment variables
   vercel env pull .env.production

   # Run migrations
   source .env.production
   pnpm prisma db push
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🗄️ Database Schema

### **User**
- Unique email and referral code
- Password (hashed with bcrypt)
- Timestamps for tracking

### **Invite**
- Links inviter to invited email
- Tracks status (SENT, ACCEPTED)
- Unique token for security
- Acceptance timestamp

### **Referral**
- Links inviter to successfully signed-up user
- Optional link to original invite
- One-to-one relationship with signup user

## 📧 Email Configuration

### Development Mode
Without `RESEND_API_KEY`, emails are logged to the console - perfect for testing.

### Production Mode
1. Sign up at [resend.com](https://resend.com)
2. Verify your sending domain
3. Get your API key
4. Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to environment variables

## 🔒 Security

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT-based session management
- ✅ Protected API routes with middleware
- ✅ Input validation on all forms
- ✅ SQL injection protection via Prisma
- ✅ HTTPS enforced in production
- ✅ Environment variables for secrets
- ✅ No sensitive data in git history

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Regenerate Prisma client
pnpm prisma generate
```

### Build Failures
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Test Failures
```bash
# Clear test cache
pnpm test -- --clearCache

# Run specific test file
pnpm test src/app/api/signup/route.test.ts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [NextAuth](https://next-auth.js.org/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [Neon](https://neon.tech/) - Serverless Postgres
- [Resend](https://resend.com/) - Email delivery
- [Adobe React Spectrum](https://react-spectrum.adobe.com/) - UI components
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the maintainer.

---

**Built with ❤️ using Next.js, TypeScript, and PostgreSQL**
