import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { urls, urlAnalytics } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { redis } from "@/lib/redis";

interface CachedUrl {
  originalUrl: string;
  expiresAt: string | null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Check Redis cache first
  let originalUrl: string;
  let expiresAt: string | null;

  const cached = await redis.get<CachedUrl>(`url:${slug}`);
  if (cached) {
    originalUrl = cached.originalUrl;
    expiresAt = cached.expiresAt;
  } else {
    const result = await db.query.urls.findFirst({
      where: eq(urls.shortCode, slug),
    });
    if (!result) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    originalUrl = result.originalUrl;
    expiresAt = result.expiresAt ? result.expiresAt.toISOString() : null;
    // Cache for next time
    redis.set(`url:${slug}`, JSON.stringify({ originalUrl, expiresAt }), { ex: 3600 }).catch(() => {});
  }

  // Expiry check
  if (expiresAt && new Date(expiresAt) < new Date()) {
    return NextResponse.redirect(new URL("/?error=expired", req.url));
  }

  // Fire-and-forget analytics tracking
  const userAgent = req.headers.get("user-agent");
  const referrer = req.headers.get("referer");
  const ipAddress = req.ip ?? req.headers.get("x-forwarded-for") ?? null;

  Promise.all([
    db.update(urls).set({ clickCount: sql`${urls.clickCount} + 1` }).where(eq(urls.shortCode, slug)),
    db.insert(urlAnalytics).values({ shortCode: slug, userAgent, ipAddress, referrer }),
  ]).catch(() => {});

  return NextResponse.redirect(new URL(originalUrl));
}
