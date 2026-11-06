import { beforeEach, describe, expect, it } from "vitest";
import { rateLimit, resetRateLimits } from "./rate-limit";

describe("rateLimit", () => {
  beforeEach(() => resetRateLimits());
  it("allows up to max then blocks until the window resets", async () => {
    const cfg = { interval: 1000, maxRequests: 2 };
    expect((await rateLimit("ip", cfg, 0)).allowed).toBe(true);
    expect((await rateLimit("ip", cfg, 10)).allowed).toBe(true);
    const blocked = await rateLimit("ip", cfg, 20);
    expect(blocked.allowed).toBe(false);
    expect(blocked.resetIn).toBe(980);
    expect((await rateLimit("other", cfg, 20)).allowed).toBe(true);
    expect((await rateLimit("ip", cfg, 1001)).allowed).toBe(true);
  });
});
