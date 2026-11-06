import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { isValidSlug } from "./blog-slug";

export { isValidSlug, SLUG_RE, SLUG_MAX } from "./blog-slug";

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

/** Newest first; same-day posts keep a stable order by slug. */
export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

/** Every post in `dir` (drafts included) in no particular order. */
export function readPostsFromDir(dir: string): BlogPost[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parsePost(fs.readFileSync(path.join(dir, f), "utf-8"), f.replace(/\.md$/, "")));
}

export function selectPublished(posts: BlogPost[]): BlogPost[] {
  return sortPosts(posts.filter((p) => p.title && p.published && isValidSlug(p.slug)));
}

/** Published posts, newest first. */
export function getAllPosts(): BlogPost[] {
  return selectPublished(readPostsFromDir(BLOG_DIR));
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

/** Neighbours of `slug` in the published list: `newer` is the previous entry, `older` the next one. */
export function getAdjacentPosts(slug: string): { newer: BlogPost | null; older: BlogPost | null } {
  const posts = getAllPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) return { newer: null, older: null };
  return { newer: posts[i - 1] ?? null, older: posts[i + 1] ?? null };
}
