import { describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { isValidSlug, parsePost, readPostsFromDir, selectPublished, sortPosts } from "./blog";

const md = (slug: string, date: string, extra = "") =>
  `---\ntitle: "T ${slug}"\nslug: ${slug}\ndate: ${date}\nexcerpt: "e"\ncoverImage: /images/blog/a.jpg\n${extra}---\nbody\n`;

describe("parsePost", () => {
  it("parses front matter and body", () => {
    const p = parsePost(md("a-b", "2026-01-02"), "file");
    expect(p).toMatchObject({ slug: "a-b", title: "T a-b", date: "2026-01-02", excerpt: "e", published: true });
    expect(p.content.trim()).toBe("body");
  });
  it("falls back to the file slug and treats published:false as draft", () => {
    const p = parsePost("---\ntitle: x\npublished: false\n---\nhi", "from-file");
    expect(p.slug).toBe("from-file");
    expect(p.published).toBe(false);
  });
});

describe("sorting and filtering", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "blog-"));
  fs.writeFileSync(path.join(dir, "old.md"), md("old", "2025-01-01"));
  fs.writeFileSync(path.join(dir, "new.md"), md("new", "2026-05-01"));
  fs.writeFileSync(path.join(dir, "draft.md"), md("draft", "2026-06-01", "published: false\n"));
  fs.writeFileSync(path.join(dir, "note.txt"), "ignored");

  it("reads only markdown files", () => {
    expect(readPostsFromDir(dir)).toHaveLength(3);
    expect(readPostsFromDir(path.join(dir, "missing"))).toEqual([]);
  });
  it("keeps published posts, newest first", () => {
    expect(selectPublished(readPostsFromDir(dir)).map((p) => p.slug)).toEqual(["new", "old"]);
  });
  it("is stable for equal dates", () => {
    const ps = [parsePost(md("b", "2026-01-01"), "b"), parsePost(md("a", "2026-01-01"), "a")];
    expect(sortPosts(ps).map((p) => p.slug)).toEqual(["a", "b"]);
  });
});

describe("isValidSlug", () => {
  it("accepts lowercase kebab slugs", () => {
    expect(isValidSlug("hello-world-2")).toBe(true);
    expect(isValidSlug("a")).toBe(true);
  });
  it("rejects everything else", () => {
    for (const s of ["", "Hello", "a--b", "-a", "a-", "a/b", "../x", "a b", "日本語", "a".repeat(121)]) {
      expect(isValidSlug(s)).toBe(false);
    }
    expect(isValidSlug(undefined)).toBe(false);
    expect(isValidSlug("a".repeat(120))).toBe(true);
  });
});
