// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Faq } from "./Faq";

afterEach(cleanup);

const items = [
  { q: "質問1", a: "回答1" },
  { q: "質問2", a: "契約期間の<strong>50%</strong>です" },
];

describe("Faq", () => {
  it("starts collapsed and toggles each question independently", () => {
    render(<Faq items={items} />);
    const [b1, b2] = screen.getAllByRole("button");
    expect(b1.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(b1);
    expect(b1.getAttribute("aria-expanded")).toBe("true");
    expect(b1.closest(".qa")?.classList.contains("open")).toBe(true);
    expect(b2.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(b2);
    expect(b1.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(b1);
    expect(b1.getAttribute("aria-expanded")).toBe("false");
    expect(b2.getAttribute("aria-expanded")).toBe("true");
  });

  it("links buttons to answer regions and renders <strong> as an element", () => {
    const { container } = render(<Faq items={items} />);
    const b = screen.getAllByRole("button")[1];
    const region = document.getElementById(b.getAttribute("aria-controls")!)!;
    expect(region.getAttribute("role")).toBe("region");
    expect(region.getAttribute("aria-labelledby")).toBe(b.id);
    expect(container.querySelector("strong")?.textContent).toBe("50%");
    expect(container.textContent).not.toContain("<strong>");
  });
});
