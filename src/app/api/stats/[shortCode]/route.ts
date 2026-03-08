import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { urls, urlAnalytics } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ratelimit } from "@/lib/redis";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env.mjs";

export async function GET(
  req: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  const ip = req.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { shortCode } = params;

  const urlRow = await db.query.urls.findFirst({
    where: eq(urls.shortCode, shortCode),
  });

  if (!urlRow) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (urlRow.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const recentClicks = await db.query.urlAnalytics.findMany({
    where: eq(urlAnalytics.shortCode, shortCode),
    orderBy: [desc(urlAnalytics.accessTime)],
    limit: 10,
  });

  return NextResponse.json({
    shortUrl: `${env.BASE_URL}/${shortCode}`,
    originalUrl: urlRow.originalUrl,
    createdAt: urlRow.createdAt,
    expiresAt: urlRow.expiresAt,
    clickCount: urlRow.clickCount,
    recentClicks,
  });
}
