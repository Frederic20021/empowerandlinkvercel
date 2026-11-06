import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, SESSION_TTL_SECONDS, isSecretUsable, signSession } from "@/lib/admin-session";
import { jsonError, jsonOk, passwordMatches } from "@/lib/admin-auth";
import { getClientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!process.env.ADMIN_PASSWORD || !isSecretUsable(secret)) {
    return jsonError("管理画面の認証が設定されていません。", 503);
  }

  const limit = await rateLimit(`admin-login:${getClientIp(request)}`, { interval: 15 * 60_000, maxRequests: 8 });
  if (!limit.allowed) return rateLimitResponse(limit.resetIn);

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password.slice(0, 1024);
  } catch {
    return jsonError("リクエストの形式が正しくありません。", 400);
  }
  if (!password) return jsonError("パスワードを入力してください。", 400);
  if (!passwordMatches(password, process.env.ADMIN_PASSWORD)) {
    return jsonError("パスワードが正しくありません。", 401);
  }

  const res = jsonOk({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await signSession(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
