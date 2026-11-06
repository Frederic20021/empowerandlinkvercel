/** Slug rules shared by the public blog, the admin UI and the admin APIs (no server-only imports). */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG_MAX = 120;

export function isValidSlug(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= SLUG_MAX && SLUG_RE.test(value);
}
