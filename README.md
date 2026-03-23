# Shrinkit

A high-performance URL shortener built with Next.js 14, Supabase, Drizzle ORM, and Upstash Redis.

## Features

- Shorten any URL instantly
- **Custom aliases** (3–20 chars, `[a-zA-Z0-9_-]`)
- **Link expiration** (1–365 days) with Active/Expired badge on dashboard
- **Redis-cached redirects** — hot path skips DB on cache hit
- **Async click analytics** — redirect fires immediately, tracking happens in background
- Per-link **stats page**: total clicks + recent click history (time, referrer, user agent)
- **QR codes** for every short link
- **Dashboard** to manage, view, and delete your links
- Google OAuth via Supabase Auth
- Rate limiting on all API routes (10 req / 10s sliding window)
- URL validation — rejects non-http(s), localhost, and private IP ranges

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | PostgreSQL via Supabase |
| ORM | Drizzle ORM |
| Auth | Supabase Auth (Google OAuth) |
| Cache / Rate Limit | Upstash Redis |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| QR Codes | qrcode.react |

## Getting Started

### 1. Clone and install

```bash
git clone <repo>
cd shawty
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in all values — see [Environment Variables](#environment-variables) below.

### 3. Push database schema

```bash
pnpm db:push
```

### 4. Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase PostgreSQL pooled connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `REDIS_URL` | Upstash Redis REST URL |
| `REDIS_TOKEN` | Upstash Redis REST token |
| `BASE_URL` | Full app URL, e.g. `https://yourapp.com` (default: `http://localhost:3000`) |

> Google OAuth credentials are configured inside the Supabase dashboard — no additional env vars needed.

## Project Structure

```
src/
  app/
    [slug]/route.ts              # Redirector — Redis cache + async click tracking
    api/
      shorten/route.ts           # POST — create short URL
      user-urls/route.ts         # GET  — list authenticated user's URLs
      user-urls/[id]/route.ts    # DELETE — delete a URL + invalidate cache
      stats/[shortCode]/route.ts # GET  — per-link stats (owner only)
    auth/callback/route.ts       # OAuth callback handler
    auth/auth-code-error/page.tsx# Auth error page
    dashboard/page.tsx           # User dashboard
    stats/[shortCode]/page.tsx   # Per-link stats page
    privacy-policy/page.tsx      # Privacy policy
    terms-of-service/page.tsx    # Terms of service
    page.tsx                     # Homepage / shorten form
  lib/
    db/schema.ts                 # Drizzle schema (urls, urlAnalytics, auth tables)
    db/index.ts                  # Drizzle client
    supabase/client.ts           # Browser Supabase client
    supabase/server.ts           # Server Supabase client
    redis.ts                     # Redis client + ratelimit
    env.mjs                      # Zod-validated env
  utils/
    generateCode.ts              # Short code generator (nanoid)
    validateUrl.ts               # URL safety validator
```

## API Reference

### `POST /api/shorten`

Create a short URL. Rate limited — 10 req / 10s per IP.

**Body:**
```json
{
  "url": "https://example.com/very-long-path",
  "customAlias": "my-link",    // optional, 3-20 chars, [a-zA-Z0-9_-]
  "expirationDays": 7          // optional, 1-365
}
```

**Response:** `{ "shortCode": "my-link" }`

**Errors:** 400 (invalid URL or alias format), 409 (alias taken), 429 (rate limited)

---

### `GET /api/stats/:shortCode`

Get stats for a link. Requires authentication + ownership.

**Response:**
```json
{
  "shortUrl": "https://yourapp.com/abc123",
  "originalUrl": "https://...",
  "createdAt": "...",
  "expiresAt": null,
  "clickCount": 42,
  "recentClicks": [
    { "id": 1, "accessTime": "...", "referrer": "...", "userAgent": "...", "ipAddress": "..." }
  ]
}
```

---

### `DELETE /api/user-urls/:id`

Delete a URL by numeric ID. Requires authentication + ownership. Invalidates the Redis cache entry.

**Response:** `{ "success": true }`

## Database Schema

```
urls
  id, original_url, short_code (unique, max 20 chars), user_id,
  click_count, created_at, expires_at

url_analytics
  id, short_code → urls.short_code (cascade delete),
  access_time, user_agent, ip_address, referrer
```

## Deployment

Deploy to Vercel. Set all env vars in project settings. Use the **pooled** Supabase connection string for `DATABASE_URL`.

```bash
vercel --prod
```

## License

MIT
