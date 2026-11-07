// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { siteHeight } from "./FlowCurrent";

function mountSite(bottom: number) {
  const site = document.createElement("div");
  site.id = "site";
  site.getBoundingClientRect = () => ({ bottom, top: 0, left: 0, right: 0, width: 0, height: bottom, x: 0, y: 0, toJSON: () => ({}) });
  document.body.appendChild(site);
  return site;
}

describe("siteHeight", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    window.scrollTo = () => {};
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  it("measures the content block, not the document (which includes the river itself)", () => {
    mountSite(2129.4);
    // Simulate a leftover river from a longer page making the document tall.
    Object.defineProperty(document.body, "scrollHeight", { value: 7881, configurable: true });
    expect(siteHeight()).toBe(2130);
  });

  it("adds the scroll offset so the height is in page coordinates", () => {
    mountSite(900);
    Object.defineProperty(window, "scrollY", { value: 600, configurable: true });
    expect(siteHeight()).toBe(1500);
  });

  it("falls back to the body height when #site is missing", () => {
    Object.defineProperty(document.body, "scrollHeight", { value: 1234, configurable: true });
    expect(siteHeight()).toBe(1234);
  });
});
