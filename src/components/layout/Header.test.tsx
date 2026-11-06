// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MOBILE_NAV, NAV } from "@/content/site";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

import { Header } from "./Header";

beforeEach(() => {
  pathname = "/";
});
afterEach(cleanup);

describe("Header", () => {
  it("renders every desktop and mobile nav label", () => {
    render(<Header />);
    for (const n of NAV) expect(screen.getAllByText(n.label).length).toBeGreaterThan(0);
    for (const n of MOBILE_NAV) expect(screen.getAllByText(n.label).length).toBeGreaterThan(0);
  });

  it("marks 会社概要 active on /company only", () => {
    pathname = "/company";
    render(<Header />);
    const main = screen.getByRole("navigation", { name: "メイン" });
    const links = Array.from(main.querySelectorAll("a"));
    const active = links.filter((a) => a.classList.contains("is-active"));
    expect(active.map((a) => a.textContent)).toEqual(["会社概要"]);
    expect(active[0].getAttribute("aria-current")).toBe("page");
  });

  it("marks 提供サービス active on a service page", () => {
    pathname = "/english";
    render(<Header />);
    const main = screen.getByRole("navigation", { name: "メイン" });
    const active = Array.from(main.querySelectorAll("a.is-active")).map((a) => a.textContent);
    expect(active).toEqual(["提供サービス"]);
  });

  it("marks the CTA active on /contact and nothing on home", () => {
    pathname = "/contact";
    const { unmount } = render(<Header />);
    expect(screen.getByRole("navigation", { name: "メイン" }).querySelector(".nav-cta.is-active")).not.toBeNull();
    unmount();
    pathname = "/";
    render(<Header />);
    expect(screen.getByRole("navigation", { name: "メイン" }).querySelector(".is-active")).toBeNull();
  });

  it("toggles the mobile menu", () => {
    render(<Header />);
    const burger = screen.getByRole("button", { name: "メニュー" });
    const mnav = screen.getByRole("navigation", { name: "モバイル" });
    expect(mnav.classList.contains("open")).toBe(false);
    fireEvent.click(burger);
    expect(mnav.classList.contains("open")).toBe(true);
    expect(burger.getAttribute("aria-expanded")).toBe("true");
  });

  it("shows the 英語版は準備中です toast when EN is pressed", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getByRole("status").textContent).toBe("英語版は準備中です");
  });
});
