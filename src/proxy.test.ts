import { beforeAll, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { signSession } from "@/lib/admin-session";
import { proxy } from "./proxy";

const SECRET = "s".repeat(40);
const url = (p: string) => `http://localhost:3000${p}`;
let cookie: string;

beforeAll(async () => {
  process.env.ADMIN_SESSION_SECRET = SECRET;
  cookie = `el_admin=${await signSession(SECRET)}`;
});

describe("proxy admin guard", () => {
  it("redirects unauthenticated admin pages to the login page", async () => {
    for (const p of ["/admin", "/admin/posts/new", "/admin/posts/abc"]) {
      const res = await proxy(new NextRequest(url(p)));
      expect(res.status).toBe(307);
      expect(new URL(res.headers.get("location")!).pathname).toBe("/admin/login");
    }
  });
  it("returns 401 JSON for unauthenticated admin APIs", async () => {
    for (const [m, p] of [["GET", "/api/admin/posts"], ["PUT", "/api/admin/posts/a"], ["DELETE", "/api/admin/posts/a"], ["POST", "/api/admin/upload"]] as const) {
      const res = await proxy(new NextRequest(url(p), { method: m }));
      expect(res.status).toBe(401);
    }
  });
  it("lets the login page and login API through", async () => {
    expect((await proxy(new NextRequest(url("/admin/login")))).headers.get("x-middleware-next")).toBe("1");
    expect((await proxy(new NextRequest(url("/api/admin/login"), { method: "POST" }))).headers.get("x-middleware-next")).toBe("1");
  });
  it("lets a valid session through and rejects a tampered one", async () => {
    const ok = await proxy(new NextRequest(url("/admin"), { headers: { cookie } }));
    expect(ok.headers.get("x-middleware-next")).toBe("1");
    const bad = await proxy(new NextRequest(url("/api/admin/posts"), { headers: { cookie: cookie.slice(0, -3) + "abc" } }));
    expect(bad.status).toBe(401);
  });
  it("does not touch public pages", async () => {
    expect((await proxy(new NextRequest(url("/blog")))).headers.get("x-middleware-next")).toBe("1");
  });
  it("blocks cross-site API writes", async () => {
    const res = await proxy(new NextRequest(url("/api/admin/login"), { method: "POST", headers: { origin: "https://evil.test" } }));
    expect(res.status).toBe(403);
    const res2 = await proxy(new NextRequest(url("/api/admin/posts/a"), { method: "DELETE", headers: { cookie, "sec-fetch-site": "cross-site" } }));
    expect(res2.status).toBe(403);
  });
});
