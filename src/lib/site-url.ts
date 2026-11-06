/** Canonical origin of the site (no trailing slash). */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://empowerandlink.com").replace(/\/+$/, "");
}
