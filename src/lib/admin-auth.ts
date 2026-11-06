import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySession } from "./admin-session";

/** Constant-time password check (both sides hashed first so the lengths always match). */
export function passwordMatches(input: string, expected: string | undefined): boolean {
  if (!expected) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i > -1 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return undefined;
}

export async function isAdminRequest(request: Request): Promise<boolean> {
  return verifySession(readCookie(request.headers.get("cookie"), ADMIN_COOKIE), process.env.ADMIN_SESSION_SECRET);
}

/** Route-level check, in addition to the proxy: returns a 401 response, or null when the session is valid. */
export async function requireAdmin(request: Request): Promise<NextResponse | null> {
  if (await isAdminRequest(request)) return null;
  return NextResponse.json({ error: "ログインが必要です。" }, { status: 401, headers: { "Cache-Control": "no-store" } });
}

export function jsonError(message: string, status: number, extra: Record<string, unknown> = {}): NextResponse {
  return NextResponse.json({ error: message, ...extra }, { status, headers: { "Cache-Control": "no-store" } });
}

export function jsonOk(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
