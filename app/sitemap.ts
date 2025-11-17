import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://makeshorten.online";

const STATIC_ROUTES = ["/", "/andy", "/api/public-links", "/api/shorten"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  return STATIC_ROUTES.map((path) => ({
    url: `${APP_URL}${path}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: path === "/" ? 1 : 0.6,
  }));
}
