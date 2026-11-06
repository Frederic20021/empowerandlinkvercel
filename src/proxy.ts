import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySession } from "@/lib/admin-session";
import { isCrossSiteApiWrite } from "@/lib/origin-check";

const LOGIN_PAGE = "/admin/login";
const LOGIN_API = "/api/admin/login";

const APP_ORIGINS = (() => {
  try {
    return process.env.NEXT_PUBLIC_SITE_URL ? [new URL(process.env.NEXT_PUBLIC_SITE_URL).origin] : [];
  } catch {
    return [];
  }
})();

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CSRF: refuse API writes sent from another site.
  if (
    isCrossSiteApiWrite({
      method: request.method,
      pathname,
      host: request.nextUrl.host,
      origin: request.headers.get("origin"),
      secFetchSite: request.headers.get("sec-fetch-site"),
      allowedOrigins: APP_ORIGINS,
    })
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();
  if (pathname === LOGIN_PAGE || pathname === LOGIN_API) return NextResponse.next();

  const ok = await verifySession(request.cookies.get(ADMIN_COOKIE)?.value, process.env.ADMIN_SESSION_SECRET);
  if (ok) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.redirect(new URL(LOGIN_PAGE, request.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/:path*"],
};
