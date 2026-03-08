import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { urls } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const result = await db.query.urls.findFirst({
    where: eq(urls.shortCode, slug),
  });

  if (!result) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Background update click count
  await db
    .update(urls)
    .set({ clickCount: sql`${urls.clickCount} + 1` })
    .where(eq(urls.id, result.id));

  return NextResponse.redirect(new URL(result.originalUrl));
}
