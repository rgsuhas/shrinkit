import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userUrls = await db.query.urls.findMany({
      where: eq(urls.userId, user.id),
      orderBy: [desc(urls.createdAt)],
    });

    return NextResponse.json({ urls: userUrls });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
