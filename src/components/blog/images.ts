import { GITHUB_RAW_PREFIX, isLocalBlogImagePath, isGithubRawUrl } from "@/lib/blog-admin";

export type BlogImageSource = { kind: "local"; src: string } | { kind: "github"; src: string };

/**
 * Which images a post may show: files under /images/blog/ (next/image) and
 * raw.githubusercontent.com URLs (plain <img>). Anything else is dropped.
 */
export function resolveBlogImage(src: string | undefined | null): BlogImageSource | null {
  if (!src) return null;
  let decoded = src;
  try {
    decoded = decodeURI(src);
  } catch {
    return null;
  }
  if (isLocalBlogImagePath(decoded)) return { kind: "local", src };
  if (src.startsWith(GITHUB_RAW_PREFIX) && isGithubRawUrl(src)) return { kind: "github", src };
  return null;
}
