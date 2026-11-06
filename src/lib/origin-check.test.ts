import { describe, expect, it } from "vitest";
import { isCrossSiteApiWrite } from "./origin-check";

const base = { method: "POST", pathname: "/api/admin/login", host: "example.com", origin: null, secFetchSite: null };

describe("isCrossSiteApiWrite", () => {
  it("ignores safe methods and non-API paths", () => {
    expect(isCrossSiteApiWrite({ ...base, method: "GET", secFetchSite: "cross-site" })).toBe(false);
    expect(isCrossSiteApiWrite({ ...base, pathname: "/blog", secFetchSite: "cross-site" })).toBe(false);
  });
  it("blocks cross-site writes", () => {
    expect(isCrossSiteApiWrite({ ...base, secFetchSite: "cross-site" })).toBe(true);
    expect(isCrossSiteApiWrite({ ...base, origin: "https://evil.test" })).toBe(true);
    expect(isCrossSiteApiWrite({ ...base, origin: "null" })).toBe(true);
  });
  it("allows same-origin and header-less requests", () => {
    expect(isCrossSiteApiWrite({ ...base, origin: "https://example.com" })).toBe(false);
    expect(isCrossSiteApiWrite({ ...base })).toBe(false);
    expect(isCrossSiteApiWrite({ ...base, origin: "https://other.test", allowedOrigins: ["https://other.test"] })).toBe(false);
  });
});
