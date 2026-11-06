import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-url";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/company", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/recruitment", changeFrequency: "monthly", priority: 0.8 },
  { path: "/english", changeFrequency: "monthly", priority: 0.8 },
  { path: "/japanese", changeFrequency: "monthly", priority: 0.8 },
  { path: "/ict", changeFrequency: "monthly", priority: 0.8 },
  { path: "/notion", changeFrequency: "monthly", priority: 0.7 },
  { path: "/offshore", changeFrequency: "monthly", priority: 0.7 },
  { path: "/smart-mensetsu", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
];

/** Static pages plus any extra entries (the blog phase passes the post URLs). */
export function buildSitemap(extra: MetadataRoute.Sitemap = []): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${base}${r.path === "/" ? "/" : r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
  return [...entries, ...extra];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const posts: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return buildSitemap(posts);
}
