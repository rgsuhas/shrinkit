# Agent Mandates: LinkShrink Project

This project is a high-performance URL shortener built with Next.js, Supabase, and Drizzle ORM. All agents working on this codebase must adhere to the following standards and architecture.

## 🏗️ Core Architecture

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM (`drizzle-orm/postgres-js`)
- **Authentication**: Supabase Auth (`@supabase/ssr`)
- **Rate Limiting**: Upstash Redis (Sliding Window)
- **Styling**: Tailwind CSS (Utility-first)
- **Icons**: Lucide React
- **QR Codes**: `qrcode.react`

## 🛠️ Key Conventions

1.  **Database Access**: Always use Drizzle ORM via `src/lib/db/index.ts`. Never use raw SQL unless performance requires it (use `sql` template literal from drizzle).
2.  **Authentication**:
    - Server-side: Use `createClient()` from `@/lib/supabase/server.ts` to get the user session.
    - Client-side: Use `createClient()` from `@/lib/supabase/client.ts`.
3.  **Environment Variables**: All sensitive variables MUST be defined in `src/lib/env.mjs` using Zod for validation.
4.  **API Routes**: 
    - Always implement rate limiting using the `ratelimit` utility from `@/lib/redis.ts`.
    - Secure private routes by checking the Supabase session before processing requests.
5.  **Redirects**: The dynamic redirector is located at `src/app/[slug]/route.ts`. It increments click counts in the database before redirecting.

## 📁 Directory Structure

- `src/app/`: App router pages and API routes.
- `src/lib/db/`: Drizzle schema and database client.
- `src/lib/supabase/`: Supabase client factories for server and client.
- `src/utils/`: Shared utility functions (e.g., short code generation).
- `src/types/`: TypeScript definitions and module augmentations.

## 🚦 Security Mandates

- Never log or commit `.env` files.
- Ensure `middleware.ts` is correctly configured to refresh sessions and protect routes.
- Use Zod for all API input validation to prevent malicious URL injection.
