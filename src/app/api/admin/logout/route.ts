import { ADMIN_COOKIE } from "@/lib/admin-session";
import { jsonOk } from "@/lib/admin-auth";

export async function POST() {
  const res = jsonOk({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}
