import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { parsePost, sortPosts, type BlogPost } from "./blog";
import { isValidSlug } from "./blog-slug";
import { IMAGE_DIR_URL, isLocalBlogImagePath, referencedImagePaths, serializePost, type PostInput } from "./blog-admin";

/** Storage behind the admin APIs. Two drivers: files on disk (`local`) or the GitHub Contents API (`github`). */
export interface BlogStore {
  readonly driver: "local" | "github";
  /** Every post including drafts, newest first. */
  listPosts(): Promise<BlogPost[]>;
  getPost(slug: string): Promise<BlogPost | null>;
  /** Creates or overwrites `<slug>.md`. */
  savePost(input: PostInput): Promise<{ created: boolean }>;
  /** Returns false when there was nothing to delete. */
  deletePost(slug: string, title?: string): Promise<boolean>;
  saveImage(fileName: string, bytes: Uint8Array): Promise<{ path: string; previewUrl: string }>;
  /** `imagePath` is a `/images/blog/<name>` URL path. Missing files are ignored. */
  deleteImage(imagePath: string): Promise<void>;
}

const BLOG_REL = "content/blog";
const IMAGES_REL = "public/images/blog";

function assertSlug(slug: string): void {
  if (!isValidSlug(slug)) throw new Error("Invalid slug");
}

/** A single safe file name: no separators, no traversal, no NUL. */
export function assertSafeFileName(name: string): void {
  if (!name || name.length > 255 || name === "." || name === ".." || /[\\/\0]/.test(name) || name.includes("..")) {
    throw new Error("Invalid file name");
  }
}

function imageNameFromPath(imagePath: string): string {
  if (!isLocalBlogImagePath(imagePath)) throw new Error("Invalid image path");
  return imagePath.slice(IMAGE_DIR_URL.length);
}

/** Resolves `name` inside `base` and refuses anything that escapes it. */
export function resolveInside(base: string, name: string): string {
  assertSafeFileName(name);
  const root = path.resolve(base);
  const full = path.resolve(root, name);
  if (path.dirname(full) !== root) throw new Error("Path escapes the storage directory");
  return full;
}

// ------------------------------------------------------------------ local

export function createLocalStore(opts: { blogDir?: string; imageDir?: string } = {}): BlogStore {
  const blogDir = opts.blogDir ?? path.join(process.cwd(), BLOG_REL);
  const imageDir = opts.imageDir ?? path.join(process.cwd(), IMAGES_REL);

  const postFile = (slug: string) => {
    assertSlug(slug);
    return resolveInside(blogDir, `${slug}.md`);
  };

  async function readPost(file: string, slug: string): Promise<BlogPost | null> {
    try {
      return parsePost(await fs.readFile(file, "utf-8"), slug);
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw e;
    }
  }

  return {
    driver: "local",
    async listPosts() {
      let names: string[] = [];
      try {
        names = await fs.readdir(blogDir);
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
      }
      const posts = await Promise.all(
        names.filter((n) => n.endsWith(".md")).map((n) => readPost(path.join(blogDir, n), n.replace(/\.md$/, ""))),
      );
      return sortPosts(posts.filter((p): p is BlogPost => p !== null));
    },
    async getPost(slug) {
      return readPost(postFile(slug), slug);
    },
    async savePost(input) {
      const file = postFile(input.slug);
      const existed = await fs.stat(file).then(() => true, () => false);
      await fs.mkdir(blogDir, { recursive: true });
      await fs.writeFile(file, serializePost(input), "utf-8");
      return { created: !existed };
    },
    async deletePost(slug) {
      try {
        await fs.unlink(postFile(slug));
        return true;
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code === "ENOENT") return false;
        throw e;
      }
    },
    async saveImage(fileName, bytes) {
      const file = resolveInside(imageDir, fileName);
      await fs.mkdir(imageDir, { recursive: true });
      await fs.writeFile(file, bytes, { flag: "wx" });
      const p = `${IMAGE_DIR_URL}${fileName}`;
      return { path: p, previewUrl: p };
    },
    async deleteImage(imagePath) {
      const file = resolveInside(imageDir, imageNameFromPath(imagePath));
      await fs.rm(file, { force: true });
    },
  };
}

// ------------------------------------------------------------------ github

export type GithubStoreOptions = {
  token: string;
  /** "owner/name" */
  repo: string;
  branch: string;
  /** Injected in tests; defaults to the global fetch at call time. */
  fetchImpl?: typeof fetch;
};

type ContentsFile = { sha: string; content: string; encoding?: string };

const encodePath = (p: string) => p.split("/").map(encodeURIComponent).join("/");

export function createGithubStore(o: GithubStoreOptions): BlogStore {
  const api = `https://api.github.com/repos/${o.repo}/contents`;
  const doFetch: typeof fetch = (input, init) => (o.fetchImpl ?? fetch)(input, init);
  const headers = {
    Authorization: `Bearer ${o.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };

  async function request(method: string, relPath: string, body?: unknown, query = ""): Promise<Response> {
    return doFetch(`${api}/${encodePath(relPath)}${query}`, {
      method,
      headers,
      cache: "no-store",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  async function fail(res: Response, what: string): Promise<never> {
    throw new Error(`GitHub ${what} failed (${res.status})`);
  }

  async function getFile(relPath: string): Promise<{ sha: string; bytes: Buffer } | null> {
    const res = await request("GET", relPath, undefined, `?ref=${encodeURIComponent(o.branch)}`);
    if (res.status === 404) return null;
    if (!res.ok) return fail(res, "read");
    const data = (await res.json()) as ContentsFile;
    return { sha: data.sha, bytes: Buffer.from(data.content.replace(/\n/g, ""), "base64") };
  }

  async function putFile(relPath: string, bytes: Uint8Array | string, message: string, sha?: string): Promise<void> {
    const content = Buffer.from(typeof bytes === "string" ? Buffer.from(bytes, "utf-8") : bytes).toString("base64");
    const res = await request("PUT", relPath, { message, content, branch: o.branch, ...(sha ? { sha } : {}) });
    if (!res.ok) await fail(res, "write");
  }

  async function removeFile(relPath: string, message: string): Promise<boolean> {
    const existing = await getFile(relPath);
    if (!existing) return false;
    const res = await request("DELETE", relPath, { message, sha: existing.sha, branch: o.branch });
    if (!res.ok) await fail(res, "delete");
    return true;
  }

  const postPath = (slug: string) => {
    assertSlug(slug);
    return `${BLOG_REL}/${slug}.md`;
  };

  return {
    driver: "github",
    async listPosts() {
      const res = await request("GET", BLOG_REL, undefined, `?ref=${encodeURIComponent(o.branch)}`);
      if (res.status === 404) return [];
      if (!res.ok) return fail(res, "list");
      const entries = (await res.json()) as Array<{ name: string; type?: string }>;
      const names = (Array.isArray(entries) ? entries : []).filter((e) => e.name.endsWith(".md") && e.type !== "dir").map((e) => e.name);
      const posts = await Promise.all(
        names.map(async (n) => {
          const f = await getFile(`${BLOG_REL}/${n}`);
          return f ? parsePost(f.bytes.toString("utf-8"), n.replace(/\.md$/, "")) : null;
        }),
      );
      return sortPosts(posts.filter((p): p is BlogPost => p !== null));
    },
    async getPost(slug) {
      const f = await getFile(postPath(slug));
      return f ? parsePost(f.bytes.toString("utf-8"), slug) : null;
    },
    async savePost(input) {
      const rel = postPath(input.slug);
      const existing = await getFile(rel);
      const message = `${existing ? "ブログ記事を更新" : "ブログ記事を追加"}: ${input.title}`;
      await putFile(rel, serializePost(input), message, existing?.sha);
      return { created: !existing };
    },
    async deletePost(slug, title) {
      return removeFile(postPath(slug), `ブログ記事を削除: ${title || slug}`);
    },
    async saveImage(fileName, bytes) {
      assertSafeFileName(fileName);
      await putFile(`${IMAGES_REL}/${fileName}`, bytes, `ブログ画像を追加: ${fileName}`);
      return {
        path: `${IMAGE_DIR_URL}${fileName}`,
        previewUrl: `https://raw.githubusercontent.com/${o.repo}/${encodeURIComponent(o.branch)}/${encodePath(`${IMAGES_REL}/${fileName}`)}`,
      };
    },
    async deleteImage(imagePath) {
      const name = imageNameFromPath(imagePath);
      assertSafeFileName(name);
      await removeFile(`${IMAGES_REL}/${name}`, `ブログ画像を削除: ${name}`);
    },
  };
}

// ------------------------------------------------------------------ selection and helpers

export function resolveDriver(env: Record<string, string | undefined> = process.env): "local" | "github" {
  const v = env.BLOG_STORAGE;
  if (v === "local" || v === "github") return v;
  return env.NODE_ENV === "production" ? "github" : "local";
}

let cached: BlogStore | null = null;

export function getBlogStore(): BlogStore {
  if (cached) return cached;
  if (resolveDriver() === "github") {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN is not configured");
    cached = createGithubStore({
      token,
      repo: process.env.GITHUB_REPO || "Frederic20021/empowerandlinkvercel",
      branch: process.env.GITHUB_BRANCH || "main",
    });
  } else {
    cached = createLocalStore();
  }
  return cached;
}

/** Deletes a post and the local images only it used (images shared with another post are kept). */
export async function deletePostAndImages(store: BlogStore, slug: string): Promise<boolean> {
  const post = await store.getPost(slug);
  if (!post) return false;
  const rest = (await store.listPosts()).filter((p) => p.slug !== slug);
  const stillUsed = new Set(rest.flatMap((p) => referencedImagePaths(p)));
  await store.deletePost(slug, post.title);
  for (const img of referencedImagePaths(post)) {
    if (!stillUsed.has(img)) await store.deleteImage(img);
  }
  return true;
}
