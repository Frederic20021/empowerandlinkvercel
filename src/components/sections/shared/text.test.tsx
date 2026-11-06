// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Hl, Rich, imgSrc, stripEmoji, telHref } from "./text";

afterEach(cleanup);

describe("text helpers", () => {
  it("strips the old emoji labels", () => {
    expect(stripEmoji("📅 STEP 1: 日程を選択して下さい")).toBe("STEP 1: 日程を選択して下さい");
    expect(stripEmoji("✅ 予約情報を受け付けました！\n\n次")).toBe("予約情報を受け付けました！\n\n次");
  });
  it("maps content image paths and phone numbers", () => {
    expect(imgSrc("assets/hero/CEO.jpg")).toBe("/images/hero/CEO.jpg");
    expect(telHref("070-6616-0410")).toBe("tel:+817066160410");
  });
  it("Rich renders newlines as <br>, drops tabs and keeps <strong>", () => {
    const { container } = render(<p><Rich text={"a\n\tb <strong>c</strong>"} /></p>);
    expect(container.querySelectorAll("br")).toHaveLength(1);
    expect(container.querySelector("strong")?.textContent).toBe("c");
    expect(container.textContent).toBe("ab c");
  });
  it("Hl wraps the first occurrence of each mark only", () => {
    const { container } = render(<p><Hl text="abcabc" marks={["b", { text: "c", as: "strong" }]} /></p>);
    expect(container.querySelectorAll("span.hl")).toHaveLength(1);
    expect(container.querySelectorAll("strong")).toHaveLength(1);
    expect(container.textContent).toBe("abcabc");
  });
});
