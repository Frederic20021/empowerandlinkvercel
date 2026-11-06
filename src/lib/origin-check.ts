/**
 * CSRF defence in depth for the API. Browsers send `Origin` (and
 * `Sec-Fetch-Site`) on every POST/PUT/PATCH/DELETE, so a write that comes
 * from another site can be refused before it reaches a route handler.
 * Requests without either header (curl, server-to-server) carry no victim
 * cookies and are left to the route's own auth.
 * Pure (no server imports) so it can be unit tested.
 */

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/** Routes called by other sites by design (none on this site yet). */
const EXEMPT_PREFIXES: string[] = [];

export function isCrossSiteApiWrite(input: {
  method: string;
  pathname: string;
  host: string | null;
  origin: string | null;
  secFetchSite: string | null;
  allowedOrigins?: string[];
}): boolean {
  const { method, pathname, host, origin, secFetchSite, allowedOrigins = [] } = input;
  if (SAFE_METHODS.has(method.toUpperCase())) return false;
  if (!pathname.startsWith('/api/')) return false;
  if (EXEMPT_PREFIXES.some((p) => pathname.startsWith(p))) return false;

  if (secFetchSite === 'cross-site') return true;

  if (origin) {
    if (origin === 'null') return true;
    if (allowedOrigins.includes(origin)) return false;
    try {
      return new URL(origin).host !== host;
    } catch {
      return true;
    }
  }
  return false;
}
