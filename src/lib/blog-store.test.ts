import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createGithubStore, createLocalStore, deletePostAndImages, resolveDriver, resolveInside } from "./blog-store";
import type { PostInput } from "./blog-admin";

const post = (over: Partial<PostInput> = {}): PostInput => ({
  title: "題名",
  slug: "my-post",
  date: "2026-03-04",
  excerpt: "要約",
  coverImage: "",
  published: true,
  content: "本文",
  ...over,
});

describe("local store", () => {
  let dir: string;
  let blogDir: string;
  let imageDir: string;
  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), "store-"));
    blogDir = path.join(dir, "content", "blog");
    imageDir = path.join(dir, "public", "images", "blog");
  });
  afterEach(() => fs.rm(dir, { recursive: true, force: true }));

  it("writes, reads, lists (drafts included) and deletes", async () => {
    const s = createLocalStore({ blogDir, imageDir });
    expect(await s.listPosts()).toEqual([]);
    expect((await s.savePost(post())).created).toBe(true);
    expect((await s.savePost(post({ title: "新題名" }))).created).toBe(false);
    await s.savePost(post({ slug: "draft", date: "2026-05-01", published: false }));
    const got = await s.getPost("my-post");
    expect(got?.title).toBe("新題名");
    expect((await s.listPosts()).map((p) => p.slug)).toEqual(["draft", "my-post"]);
    expect(await s.deletePost("my-post")).toBe(true);
    expect(await s.deletePost("my-post")).toBe(false);
    expect(await s.getPost("my-post")).toBeNull();
  });

  it("saves and deletes images, never overwriting", async () => {
    const s = createLocalStore({ blogDir, imageDir });
    const r = await s.saveImage("1-a.png", Uint8Array.from([1, 2, 3]));
    expect(r).toEqual({ path: "/images/blog/1-a.png", previewUrl: "/images/blog/1-a.png" });
    expect(await fs.readFile(path.join(imageDir, "1-a.png"))).toEqual(Buffer.from([1, 2, 3]));
    await expect(s.saveImage("1-a.png", Uint8Array.from([9]))).rejects.toThrow();
    await s.deleteImage("/images/blog/1-a.png");
    await s.deleteImage("/images/blog/1-a.png");
    await expect(fs.stat(path.join(imageDir, "1-a.png"))).rejects.toThrow();
  });

  it("rejects path traversal", async () => {
    const s = createLocalStore({ blogDir, imageDir });
    await expect(s.getPost("../secret")).rejects.toThrow();
    await expect(s.savePost(post({ slug: "../x" }))).rejects.toThrow();
    await expect(s.saveImage("../evil.png", Uint8Array.from([1]))).rejects.toThrow();
    await expect(s.saveImage("a/b.png", Uint8Array.from([1]))).rejects.toThrow();
    await expect(s.deleteImage("/images/blog/../../package.json")).rejects.toThrow();
    expect(() => resolveInside(blogDir, "..")).toThrow();
    expect(() => resolveInside(blogDir, "a/../../b")).toThrow();
  });

  it("deletePostAndImages keeps images that another post still uses", async () => {
    const s = createLocalStore({ blogDir, imageDir });
    await s.saveImage("own.png", Uint8Array.from([1]));
    await s.saveImage("shared.png", Uint8Array.from([2]));
    await s.savePost(post({ slug: "a", coverImage: "/images/blog/own.png", content: "![](/images/blog/shared.png)" }));
    await s.savePost(post({ slug: "b", content: "![](/images/blog/shared.png)" }));
    expect(await deletePostAndImages(s, "a")).toBe(true);
    await expect(fs.stat(path.join(imageDir, "own.png"))).rejects.toThrow();
    await expect(fs.stat(path.join(imageDir, "shared.png"))).resolves.toBeTruthy();
    expect(await deletePostAndImages(s, "a")).toBe(false);
  });
});

describe("github store (mocked fetch)", () => {
  const ok = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
  const b64 = (s: string) => Buffer.from(s, "utf-8").toString("base64");
  const make = (fetchImpl: typeof fetch) => createGithubStore({ token: "tkn", repo: "o/r", branch: "main", fetchImpl });

  it("creates a post: reads sha (404), then PUTs base64 UTF-8 with a Japanese commit message", async () => {
    const calls: Array<{ url: string; init: RequestInit }> = [];
    const f = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(url), init: init ?? {} });
      return init?.method === "PUT" ? ok({}) : new Response("{}", { status: 404 });
    });
    const r = await make(f as unknown as typeof fetch).savePost(post());
    expect(r.created).toBe(true);
    expect(calls[0].url).toBe("https://api.github.com/repos/o/r/contents/content/blog/my-post.md?ref=main");
    const put = calls[1];
    expect(put.url).toBe("https://api.github.com/repos/o/r/contents/content/blog/my-post.md");
    expect(put.init.method).toBe("PUT");
    expect((put.init.headers as Record<string, string>).Authorization).toBe("Bearer tkn");
    const body = JSON.parse(put.init.body as string);
    expect(body.message).toBe("ブログ記事を追加: 題名");
    expect(body.branch).toBe("main");
    expect(body.sha).toBeUndefined();
    expect(Buffer.from(body.content, "base64").toString("utf-8")).toContain('title: "題名"');
  });

  it("updates with the existing sha", async () => {
    const f = vi.fn(async (_u: RequestInfo | URL, init?: RequestInit) =>
      init?.method === "PUT" ? ok({}) : ok({ sha: "abc123", content: b64("old") }),
    );
    const r = await make(f as unknown as typeof fetch).savePost(post());
    expect(r.created).toBe(false);
    const body = JSON.parse((f.mock.calls[1][1] as RequestInit).body as string);
    expect(body.sha).toBe("abc123");
    expect(body.message).toBe("ブログ記事を更新: 題名");
  });

  it("reads posts (base64 UTF-8 round trip) and lists only .md files", async () => {
    const md = '---\ntitle: "日本語"\nslug: a\ndate: 2026-01-01\n---\nこんにちは';
    const f = vi.fn(async (url: RequestInfo | URL) => {
      const u = String(url);
      if (u.includes("contents/content/blog?ref")) return ok([{ name: "a.md", type: "file" }, { name: "x.txt", type: "file" }]);
      return ok({ sha: "s1", content: b64(md).replace(/(.{20})/g, "$1\n") });
    });
    const posts = await make(f as unknown as typeof fetch).listPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe("日本語");
    expect(posts[0].content.trim()).toBe("こんにちは");
  });

  it("deletes with sha, and reports false when missing", async () => {
    const f = vi.fn(async (_u: RequestInfo | URL, init?: RequestInit) =>
      init?.method === "DELETE" ? ok({}) : ok({ sha: "zz", content: b64("x") }),
    );
    expect(await make(f as unknown as typeof fetch).deletePost("my-post", "題名")).toBe(true);
    const del = JSON.parse((f.mock.calls[1][1] as RequestInit).body as string);
    expect(del).toMatchObject({ sha: "zz", branch: "main", message: "ブログ記事を削除: 題名" });
    const missing = vi.fn(async () => new Response("{}", { status: 404 }));
    expect(await make(missing as unknown as typeof fetch).deletePost("my-post")).toBe(false);
  });

  it("uploads images with raw binary base64 and returns a raw.githubusercontent preview", async () => {
    const f = vi.fn(async () => ok({}));
    const bytes = Uint8Array.from([0xff, 0xd8, 0xff, 0x00, 0x80]);
    const r = await make(f as unknown as typeof fetch).saveImage("1-a.jpg", bytes);
    expect(r.path).toBe("/images/blog/1-a.jpg");
    expect(r.previewUrl).toBe("https://raw.githubusercontent.com/o/r/main/public/images/blog/1-a.jpg");
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.github.com/repos/o/r/contents/public/images/blog/1-a.jpg");
    expect(Buffer.from(JSON.parse(init.body as string).content, "base64")).toEqual(Buffer.from(bytes));
  });

  it("surfaces API failures and rejects bad slugs without calling the network", async () => {
    const f = vi.fn(async () => new Response("{}", { status: 500 }));
    const s = make(f as unknown as typeof fetch);
    await expect(s.getPost("my-post")).rejects.toThrow(/500/);
    f.mockClear();
    await expect(s.getPost("../x")).rejects.toThrow();
    expect(f).not.toHaveBeenCalled();
  });

  it("never touches the global fetch when one is injected", async () => {
    const spy = vi.spyOn(globalThis, "fetch");
    const f = vi.fn(async () => ok([]));
    await make(f as unknown as typeof fetch).listPosts();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("resolveDriver", () => {
  it("honours BLOG_STORAGE and defaults by NODE_ENV", () => {
    expect(resolveDriver({ BLOG_STORAGE: "local", NODE_ENV: "production" })).toBe("local");
    expect(resolveDriver({ BLOG_STORAGE: "github" })).toBe("github");
    expect(resolveDriver({ NODE_ENV: "production" })).toBe("github");
    expect(resolveDriver({ NODE_ENV: "development" })).toBe("local");
    expect(resolveDriver({ BLOG_STORAGE: "bogus", NODE_ENV: "production" })).toBe("github");
  });
});
