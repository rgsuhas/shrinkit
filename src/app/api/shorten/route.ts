import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateShortCode } from "@/utils/generateCode";
import { ratelimit, redis } from "@/lib/redis";
import { createClient } from "@/lib/supabase/server";
import { validateUrl } from "@/utils/validateUrl";

const ShortenSchema = z.object({
  url: z.string().min(1),
  customAlias: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  expirationDays: z.number().int().min(1).max(365).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const parsed = ShortenSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { url, customAlias, expirationDays } = parsed.data;

    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      return NextResponse.json({ error: urlValidation.error }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (customAlias) {
      const existing = await db.query.urls.findFirst({
        where: eq(urls.shortCode, customAlias),
      });
      if (existing) {
        return NextResponse.json({ error: "Custom alias already taken" }, { status: 409 });
      }
    }

    const shortCode = customAlias ?? generateShortCode();
    const expiresAt = expirationDays
      ? new Date(Date.now() + expirationDays * 86_400_000)
      : null;

    await db.insert(urls).values({
      originalUrl: url,
      shortCode,
      userId: user?.id,
      expiresAt,
    });

    // Fire-and-forget Redis cache pre-warm
    redis.set(`url:${shortCode}`, JSON.stringify({ originalUrl: url, expiresAt }), { ex: 3600 }).catch(() => {});

    return NextResponse.json({ shortCode });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
