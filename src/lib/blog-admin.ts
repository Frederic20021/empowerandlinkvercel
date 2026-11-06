/** Validation and serialisation shared by the admin APIs and the admin UI (no server-only imports). */
import { isValidSlug } from "./blog-slug";

export const IMAGE_DIR_URL = "/images/blog/";
export const GITHUB_RAW_PREFIX = "https://raw.githubusercontent.com/";
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export type PostInput = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
  content: string;
};

const LIMITS = { title: 200, excerpt: 500, content: 200_000, coverImage: 500 };

/** `/images/blog/<one file name>`: no nested paths, no traversal, no query or fragment. */
export function isLocalBlogImagePath(value: string): boolean {
  if (!value.startsWith(IMAGE_DIR_URL)) return false;
  const name = value.slice(IMAGE_DIR_URL.length);
  if (!name || name.length > 255 || name === "." || name === "..") return false;
  return !/[\\/?#\0]/.test(name) && !name.includes("..");
}

export function isGithubRawUrl(value: string): boolean {
  if (!value.startsWith(GITHUB_RAW_PREFIX)) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export type ValidationResult = { ok: true; value: PostInput } | { ok: false; errors: string[] };

export function validatePostInput(input: unknown): ValidationResult {
  const errors: string[] = [];
  const o = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const str = (k: string) => (typeof o[k] === "string" ? (o[k] as string) : "");

  const title = str("title").trim();
  const slug = str("slug").trim();
  const date = str("date").trim();
  const excerpt = str("excerpt").trim();
  const coverImage = str("coverImage").trim();
  const content = str("content");

  if (!title) errors.push("タイトルは必須です。");
  else if (title.length > LIMITS.title) errors.push(`タイトルは${LIMITS.title}文字以内で入力してください。`);
  if (!slug) errors.push("スラッグは必須です。");
  else if (!isValidSlug(slug)) errors.push("スラッグは半角の小文字英数字とハイフンのみ（120文字以内）で入力してください。");
  if (!date) errors.push("公開日は必須です。");
  else if (!isValidDate(date)) errors.push("公開日の形式が正しくありません。");
  if (excerpt.length > LIMITS.excerpt) errors.push(`抜粋は${LIMITS.excerpt}文字以内で入力してください。`);
  if (coverImage && coverImage.length > LIMITS.coverImage) errors.push("カバー画像のパスが長すぎます。");
  else if (coverImage && !isLocalBlogImagePath(coverImage) && !isGithubRawUrl(coverImage)) {
    errors.push("カバー画像は /images/blog/ 配下の画像を指定してください。");
  }
  if (content.length > LIMITS.content) errors.push("本文が長すぎます。");
  if (o.published !== undefined && typeof o.published !== "boolean") errors.push("公開設定の形式が正しくありません。");

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: { title, slug, date, excerpt, coverImage, published: o.published !== false, content },
  };
}

/** Markdown file text with YAML front matter. JSON strings are valid YAML double-quoted scalars. */
export function serializePost(p: PostInput): string {
  const lines = [
    "---",
    `title: ${JSON.stringify(p.title)}`,
    `slug: ${p.slug}`,
    `date: ${p.date}`,
    `excerpt: ${JSON.stringify(p.excerpt)}`,
  ];
  if (p.coverImage) lines.push(`coverImage: ${JSON.stringify(p.coverImage)}`);
  lines.push(`published: ${p.published ? "true" : "false"}`, "---", "", p.content.replace(/^\n+/, "").trimEnd(), "");
  return lines.join("\n");
}

/** Local `/images/blog/...` paths referenced by a post (cover and Markdown images), URL-decoded. */
export function referencedImagePaths(p: Pick<PostInput, "coverImage" | "content">): string[] {
  const found = new Set<string>();
  const add = (raw: string) => {
    let v = raw.trim();
    try {
      v = decodeURI(v);
    } catch {
      /* keep raw */
    }
    if (isLocalBlogImagePath(v)) found.add(v);
  };
  add(p.coverImage);
  for (const m of p.content.matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)>?[^)]*\)/g)) add(m[1]);
  return [...found];
}

// ---------------------------------------------------------------- uploads

export const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

export type ImageMime = keyof typeof IMAGE_TYPES;

const ascii = (b: Uint8Array, from: number, to: number) => String.fromCharCode(...b.slice(from, to));

/** Detects the real image type from the first bytes; null when it is not a supported image. */
export function sniffImageType(b: Uint8Array): ImageMime | null {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((v, i) => b[i] === v)) return "image/png";
  if (b.length >= 12 && ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 12) === "WEBP") return "image/webp";
  if (b.length >= 12 && ascii(b, 4, 8) === "ftyp") {
    const brands = ascii(b, 8, Math.min(b.length, 32));
    if (brands.includes("avif") || brands.includes("avis")) return "image/avif";
  }
  return null;
}

export type UploadCheck = { ok: true; mime: ImageMime; ext: string } | { ok: false; error: string };

export function validateUpload(input: { declaredType: string; size: number; bytes: Uint8Array }): UploadCheck {
  const { declaredType, size, bytes } = input;
  if (size <= 0 || bytes.length === 0) return { ok: false, error: "ファイルが空です。" };
  if (size > MAX_UPLOAD_BYTES || bytes.length > MAX_UPLOAD_BYTES) return { ok: false, error: "画像は5MB以下にしてください。" };
  if (!(declaredType in IMAGE_TYPES)) return { ok: false, error: "JPEG・PNG・WebP・AVIFの画像のみアップロードできます。" };
  const real = sniffImageType(bytes);
  if (!real || real !== declaredType) return { ok: false, error: "画像ファイルの内容が形式と一致しません。" };
  return { ok: true, mime: real, ext: IMAGE_TYPES[real] };
}

/** `<timestamp>-<sanitized>.<ext>`; the extension always comes from the detected type. */
export function buildUploadName(originalName: string, ext: string, now: number = Date.now()): string {
  const base = originalName.replace(/^.*[\\/]/, "").replace(/\.[^.]*$/, "");
  const clean =
    base
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40)
      .replace(/-+$/g, "") || "image";
  return `${now}-${clean}.${ext}`;
}
