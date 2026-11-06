import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type BlogPost = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  excerpt: string;
  coverImage: string;
  published: boolean;
  content: string; // Markdown body
};

export const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function toDate(value: unknown): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

export function parsePost(raw: string, fileSlug: string): BlogPost {
  const { data, content } = matter(raw);
  return {
    slug: typeof data.slug === "string" && data.slug ? data.slug : fileSlug,
    title: typeof data.title === "string" ? data.title : "",
    date: toDate(data.date),
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    coverImage: typeof data.coverImage === "string" ? data.coverImage : "",
    published: data.published !== false,
    content,
  };
}

/** Published posts, newest first. */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parsePost(fs.readFileSync(path.join(BLOG_DIR, f), "utf-8"), f.replace(/\.md$/, "")))
    .filter((p) => p.title && p.published)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}
