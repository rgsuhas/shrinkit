# LinkShrink - URL Shortener

A **highly scalable URL shortener** built with Next.js with advanced features like QR codes, rate limiting, and Supabase integration.

## 🚀 Features

- **Lightning Fast**: Generate shortened URLs in milliseconds
- **Supabase Auth**: Secure user authentication and session management
- **QR Code Generation**: Instant QR codes for easy sharing
- **Rate Limiting**: API protection with Upstash Redis
- **Click Analytics**: Track clicks and monitor performance
- **Personal Dashboard**: Manage all your URLs in one place
- **Scalable Architecture**: Built on Next.js 14 with Serverless Functions
- **Beautiful UI**: Modern interface built with Tailwind CSS

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | Next.js 14 | Full-stack React framework with App Router |
| Authentication | Supabase Auth | Built-in authentication and social login |
| Database | PostgreSQL (Supabase) | Scalable PostgreSQL database |
| ORM | Drizzle ORM | Lightweight, type-safe database queries |
| Rate Limiting | Upstash Redis | API protection and abuse prevention |
| QR Codes | qrcode.react | QR code generation for shortened URLs |
| Short IDs | nanoid | Unique, URL-safe short codes |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Hosting | Vercel | Serverless deployment platform |

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd url-shortener
pnpm install
```

### 2. Set up Database & Auth

1. Create a [Supabase](https://supabase.com) project.
2. Go to Settings > API and get your `URL` and `Anon Key`.
3. Go to Authentication > Providers and enable the Google provider (requires Google Cloud Console setup).

### 3. Configure Environment

Create `.env.local` based on `.env.example`:

```env
DATABASE_URL="postgresql://postgres.ref:[password]@aws-0-region.pooler.supabase.com:6543/postgres"
NEXT_PUBLIC_SUPABASE_URL="your-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
REDIS_URL="your-upstash-redis-url"
REDIS_TOKEN="your-upstash-token"
BASE_URL="http://localhost:3000"
```

### 4. Push Schema

Sync your Drizzle schema with Supabase:

```bash
pnpm run db:push
```

### 5. Run Development Server

```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your URL shortener!

## 🔧 Architecture Notes

- **Authentication**: Using `@supabase/ssr` to handle session refreshing and cookie management across server and client components.
- **Database Driver**: Using `postgres.js` with Drizzle ORM for optimal performance in serverless environments.
- **Middleware**: A `middleware.ts` is implemented to ensure that user sessions are refreshed automatically before reaching server components.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.
