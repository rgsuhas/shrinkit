import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { generateShortCode } from "@/utils/generateCode";
import { ratelimit } from "@/lib/redis";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const ip = req.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const shortCode = generateShortCode();

    await db.insert(urls).values({
      originalUrl: url,
      shortCode,
      userId: user?.id,
    });

    return NextResponse.json({ shortCode });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
