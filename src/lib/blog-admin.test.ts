import { describe, expect, it } from "vitest";
import matter from "gray-matter";
import {
  MAX_UPLOAD_BYTES,
  buildUploadName,
  isLocalBlogImagePath,
  referencedImagePaths,
  serializePost,
  sniffImageType,
  validatePostInput,
  validateUpload,
} from "./blog-admin";

const good = { title: "題名", slug: "my-post", date: "2026-03-04", excerpt: "要約", coverImage: "/images/blog/a.jpg", published: true, content: "本文" };

describe("validatePostInput", () => {
  it("accepts a valid payload and trims", () => {
    const r = validatePostInput({ ...good, title: "  題名 " });
    expect(r.ok && r.value.title).toBe("題名");
  });
  it("defaults published to true", () => {
    const { published: _p, ...rest } = good;
    void _p;
    const r = validatePostInput(rest);
    expect(r.ok && r.value.published).toBe(true);
  });
  it("collects errors", () => {
    const r = validatePostInput({ title: "", slug: "Bad Slug", date: "2026-02-30", coverImage: "https://evil.test/x.png", published: "yes" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.length).toBeGreaterThanOrEqual(5);
  });
  it("rejects non-objects", () => {
    expect(validatePostInput(null).ok).toBe(false);
    expect(validatePostInput("x").ok).toBe(false);
  });
  it("only allows local or GitHub raw cover images", () => {
    expect(validatePostInput({ ...good, coverImage: "" }).ok).toBe(true);
    expect(validatePostInput({ ...good, coverImage: "https://raw.githubusercontent.com/o/r/main/public/images/blog/a.jpg" }).ok).toBe(true);
    expect(validatePostInput({ ...good, coverImage: "/images/blog/../../etc/passwd" }).ok).toBe(false);
    expect(validatePostInput({ ...good, coverImage: "/images/other/a.jpg" }).ok).toBe(false);
  });
});

describe("isLocalBlogImagePath", () => {
  it("rejects nesting and traversal", () => {
    expect(isLocalBlogImagePath("/images/blog/a.jpg")).toBe(true);
    for (const v of ["/images/blog/", "/images/blog/a/b.jpg", "/images/blog/..", "/images/blog/a..b", "/images/blog/a.jpg?x"]) {
      expect(isLocalBlogImagePath(v)).toBe(false);
    }
  });
});

describe("serializePost", () => {
  it("round-trips through gray-matter, including quotes and newlines", () => {
    const p = { ...good, title: '引用 "q": コロン\n改行', excerpt: "a: b" };
    const parsed = matter(serializePost(p));
    expect(parsed.data.title).toBe(p.title);
    expect(parsed.data.excerpt).toBe("a: b");
    expect(parsed.data.slug).toBe("my-post");
    expect(parsed.data.published).toBe(true);
    expect(parsed.content.trim()).toBe("本文");
  });
  it("omits an empty cover image", () => {
    expect(serializePost({ ...good, coverImage: "" })).not.toContain("coverImage");
  });
});

describe("referencedImagePaths", () => {
  it("finds cover and body images, decoding percent-encoding", () => {
    const paths = referencedImagePaths({
      coverImage: "/images/blog/c.png",
      content: "![](/images/blog/%E6%8E%A5.png)\n![x](https://example.com/a.png)\n![](/images/blog/d.jpg)",
    });
    expect(paths.sort()).toEqual(["/images/blog/c.png", "/images/blog/d.jpg", "/images/blog/接.png"].sort());
  });
});

const jpeg = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46]);
const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const webp = Uint8Array.from([...Buffer.from("RIFF"), 0, 0, 0, 0, ...Buffer.from("WEBP")]);
const avif = Uint8Array.from([0, 0, 0, 0x1c, ...Buffer.from("ftypavif"), 0, 0, 0, 0]);

describe("upload validation", () => {
  it("sniffs supported formats", () => {
    expect(sniffImageType(jpeg)).toBe("image/jpeg");
    expect(sniffImageType(png)).toBe("image/png");
    expect(sniffImageType(webp)).toBe("image/webp");
    expect(sniffImageType(avif)).toBe("image/avif");
    expect(sniffImageType(Uint8Array.from(Buffer.from("<svg></svg>")))).toBeNull();
  });
  it("accepts matching type and bytes", () => {
    expect(validateUpload({ declaredType: "image/png", size: png.length, bytes: png })).toEqual({ ok: true, mime: "image/png", ext: "png" });
  });
  it("rejects wrong type, spoofed bytes, empty and oversize files", () => {
    expect(validateUpload({ declaredType: "image/gif", size: 10, bytes: png }).ok).toBe(false);
    expect(validateUpload({ declaredType: "image/svg+xml", size: 10, bytes: png }).ok).toBe(false);
    expect(validateUpload({ declaredType: "image/png", size: jpeg.length, bytes: jpeg }).ok).toBe(false);
    expect(validateUpload({ declaredType: "image/png", size: 5, bytes: Uint8Array.from(Buffer.from("<?php")) }).ok).toBe(false);
    expect(validateUpload({ declaredType: "image/png", size: 0, bytes: new Uint8Array() }).ok).toBe(false);
    expect(validateUpload({ declaredType: "image/png", size: MAX_UPLOAD_BYTES + 1, bytes: png }).ok).toBe(false);
  });
});

describe("buildUploadName", () => {
  it("builds timestamp-sanitized.ext", () => {
    expect(buildUploadName("My Photo (1).JPG", "jpg", 123)).toBe("123-my-photo-1.jpg");
    expect(buildUploadName("../../etc/写真.png", "png", 5)).toBe("5-image.png");
    expect(buildUploadName("a".repeat(100) + ".png", "png", 1)).toBe(`1-${"a".repeat(40)}.png`);
  });
});
