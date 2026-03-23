import { redirect } from "next/navigation";
import { cache } from "react";
import { headers } from "next/headers";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { urls, urlAnalytics } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { redis } from "@/lib/redis";
import { env } from "@/lib/env.mjs";
import RedirectClient from "./redirect-client";

interface CachedUrl {
  originalUrl: string;
  expiresAt: string | null;
}

const getUrl = cache(async (slug: string): Promise<CachedUrl | null> => {
  const cached = await redis.get<CachedUrl>(`url:${slug}`);
  if (cached) return cached;

  const result = await db.query.urls.findFirst({
    where: eq(urls.shortCode, slug),
  });
  if (!result) return null;

  const data: CachedUrl = {
    originalUrl: result.originalUrl,
    expiresAt: result.expiresAt ? result.expiresAt.toISOString() : null,
  };
  redis.set(`url:${slug}`, JSON.stringify(data), { ex: 3600 }).catch(() => {});
  return data;
});

async function fetchOgData(url: string) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ShrinkitBot/1.0; +https://rg-shrinkit.vercel.app)" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000),
    });
    const html = await res.text();

    const getMeta = (prop: string) => {
      const m =
        html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i")) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, "i"));
      return m ? m[1] : null;
    };

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

    return {
      title: getMeta("og:title") || titleMatch?.[1]?.trim() || url,
      description: getMeta("og:description") || getMeta("description") || "Shared via Shrinkit",
      image: getMeta("og:image") || null,
    };
  } catch {
    return { title: url, description: "Shared via Shrinkit", image: null };
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getUrl(params.slug);
  if (!data) return { title: "Link not found – Shrinkit" };

  const og = await fetchOgData(data.originalUrl);
  const pageUrl = `${env.BASE_URL}/${params.slug}`;

  return {
    title: og.title,
    description: og.description,
    openGraph: {
      title: og.title,
      description: og.description,
      url: pageUrl,
      siteName: "Shrinkit",
      ...(og.image && { images: [{ url: og.image }] }),
    },
    twitter: {
      card: og.image ? "summary_large_image" : "summary",
      title: og.title,
      description: og.description,
      ...(og.image && { images: [og.image] }),
    },
  };
}

export default async function SlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (slug === "favicon.ico" || slug.includes(".")) redirect("/");

  const data = await getUrl(slug);
  if (!data) redirect("/");

  if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
    redirect("/?error=expired");
  }

  // Fire-and-forget analytics
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const referrer = headersList.get("referer");
  const ip = headersList.get("x-forwarded-for") ?? null;

  Promise.all([
    db.update(urls).set({ clickCount: sql`${urls.clickCount} + 1` }).where(eq(urls.shortCode, slug)),
    db.insert(urlAnalytics).values({ shortCode: slug, userAgent, ipAddress: ip, referrer }),
  ]).catch(() => {});

  return <RedirectClient url={data.originalUrl} />;
}
