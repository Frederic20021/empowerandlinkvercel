import { describe, expect, it } from "vitest";
import { signSession, verifySession, SESSION_TTL_SECONDS } from "./admin-session";

const SECRET = "x".repeat(40);
const T0 = 1_800_000_000_000;

describe("admin session", () => {
  it("verifies a fresh token", async () => {
    const t = await signSession(SECRET, T0);
    expect(await verifySession(t, SECRET, T0 + 1000)).toBe(true);
  });
  it("expires after the TTL", async () => {
    const t = await signSession(SECRET, T0);
    expect(await verifySession(t, SECRET, T0 + (SESSION_TTL_SECONDS - 1) * 1000)).toBe(true);
    expect(await verifySession(t, SECRET, T0 + SESSION_TTL_SECONDS * 1000)).toBe(false);
  });
  it("rejects a wrong secret, tampered payload or signature, and junk", async () => {
    const t = await signSession(SECRET, T0);
    const [p, s] = t.split(".");
    expect(await verifySession(t, "y".repeat(40), T0)).toBe(false);
    const forged = btoa(JSON.stringify({ exp: 9_999_999_999 })).replace(/=+$/, "");
    expect(await verifySession(`${forged}.${s}`, SECRET, T0)).toBe(false);
    expect(await verifySession(`${p}.${s.slice(0, -2)}AA`, SECRET, T0)).toBe(false);
    for (const junk of ["", "abc", "a.b.c", "!!.??", undefined, null]) {
      expect(await verifySession(junk as string, SECRET, T0)).toBe(false);
    }
  });
  it("refuses short or missing secrets", async () => {
    await expect(signSession("short", T0)).rejects.toThrow();
    const t = await signSession(SECRET, T0);
    expect(await verifySession(t, "short", T0)).toBe(false);
    expect(await verifySession(t, undefined, T0)).toBe(false);
  });
});
