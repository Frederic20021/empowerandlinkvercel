/**
 * Signed admin session cookie. Web Crypto only, so it works in proxy.ts and in route handlers.
 * Token = base64url(JSON {exp}) + "." + base64url(HMAC-SHA256(payload, secret)).
 */
export const ADMIN_COOKIE = "el_admin";
export const SESSION_TTL_SECONDS = 8 * 60 * 60;
export const MIN_SECRET_LENGTH = 32;

const enc = new TextEncoder();

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]*$/.test(value)) return null;
  try {
    const bin = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
    return Uint8Array.from(bin, (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

export function isSecretUsable(secret: string | undefined): secret is string {
  return typeof secret === "string" && secret.length >= MIN_SECRET_LENGTH;
}

function importKey(secret: string, usage: "sign" | "verify"): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [usage]);
}

/** `now` is in milliseconds. */
export async function signSession(secret: string, now: number = Date.now(), ttlSeconds = SESSION_TTL_SECONDS): Promise<string> {
  if (!isSecretUsable(secret)) throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters");
  const payload = b64urlEncode(enc.encode(JSON.stringify({ exp: Math.floor(now / 1000) + ttlSeconds })));
  const sig = await crypto.subtle.sign("HMAC", await importKey(secret, "sign"), enc.encode(payload));
  return `${payload}.${b64urlEncode(new Uint8Array(sig))}`;
}

export async function verifySession(token: string | undefined | null, secret: string | undefined, now: number = Date.now()): Promise<boolean> {
  if (!token || !isSecretUsable(secret)) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const sigBytes = b64urlDecode(sig);
  if (!sigBytes) return false;
  // subtle.verify compares in constant time.
  const ok = await crypto.subtle.verify("HMAC", await importKey(secret, "verify"), sigBytes as BufferSource, enc.encode(payload));
  if (!ok) return false;
  const body = b64urlDecode(payload);
  if (!body) return false;
  try {
    const { exp } = JSON.parse(new TextDecoder().decode(body)) as { exp?: unknown };
    return typeof exp === "number" && Number.isFinite(exp) && exp * 1000 > now;
  } catch {
    return false;
  }
}
