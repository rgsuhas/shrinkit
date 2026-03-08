# Agent Mandates: LinkShrink Project

This project is a high-performance URL shortener built with Next.js, Supabase, and Drizzle ORM. All agents working on this codebase must adhere to the following standards and architecture.

## Core Architecture

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM (`drizzle-orm/postgres-js`)
- **Authentication**: Supabase Auth (`@supabase/ssr`)
- **Cache + Rate Limiting**: Upstash Redis — `redis` export for caching, `ratelimit` export for rate limiting
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **QR Codes**: `qrcode.react`

## Key Conventions

1. **Database Access**: Always use Drizzle ORM via `src/lib/db/index.ts`. Use the `sql` template literal from drizzle only when raw expressions are needed (e.g. `sql\`${urls.clickCount} + 1\``).

2. **Authentication**:
   - Server-side: `createClient()` from `@/lib/supabase/server.ts`
   - Client-side: `createClient()` from `@/lib/supabase/client.ts`

3. **Environment Variables**: All env vars MUST be defined and Zod-validated in `src/lib/env.mjs`. Use `env.BASE_URL` (not `process.env.BASE_URL`) in server code.

4. **API Routes**:
   - Always rate-limit using `ratelimit` from `@/lib/redis.ts`.
   - Always verify Supabase session before processing authenticated requests.
   - Use Zod (`safeParse`) for all request body validation.
   - Validate URLs using `validateUrl` from `@/utils/validateUrl.ts`.

5. **Redis Caching**: The `redis` client is used to cache resolved URLs under the key `url:{shortCode}` with a 1-hour TTL. Always fire cache writes as fire-and-forget (`.catch(() => {})`). On delete, invalidate with `redis.del(...)`.

6. **Redirector** (`src/app/[slug]/route.ts`): Check Redis first, fall back to DB, check expiry, then redirect. Click count increment and `url_analytics` insert are both fire-and-forget — do NOT await them before redirecting.

7. **Short Codes**: Max length 20 chars. Custom aliases validated as `[a-zA-Z0-9_-]`, 3–20 chars. Generated codes use `generateShortCode()` from `@/utils/generateCode.ts`.

8. **Expiration**: `urls.expiresAt` is nullable. Expired URLs redirect to `/?error=expired`. The Redis cache stores `expiresAt` alongside `originalUrl` so expiry can be checked without a DB hit.

## Directory Structure

```
src/app/                         Routes and API handlers
src/app/[slug]/route.ts          Hot-path redirector
src/app/api/shorten/             POST — create URL
src/app/api/user-urls/           GET — list user URLs
src/app/api/user-urls/[id]/      DELETE — delete URL
src/app/api/stats/[shortCode]/   GET — per-link analytics
src/app/dashboard/               Dashboard UI
src/app/stats/[shortCode]/       Stats UI
src/lib/db/schema.ts             Drizzle schema
src/lib/redis.ts                 Redis + ratelimit exports
src/lib/env.mjs                  Validated env
src/utils/generateCode.ts        Short code generator
src/utils/validateUrl.ts         URL safety validator
```

## Database Schema (key tables)

```
urls: id, original_url, short_code (varchar 20, unique), user_id,
      click_count, created_at, expires_at

url_analytics: id, short_code (→ urls.short_code, cascade),
               access_time, user_agent, ip_address, referrer
```

## Security Mandates

- Never log or commit `.env` files.
- `middleware.ts` must remain configured to refresh sessions and protect routes.
- Zod validates all API inputs.
- `validateUrl` blocks non-http(s) schemes, localhost, and private IP ranges.
- All delete/stats endpoints verify that `result.userId === user.id` before acting.
