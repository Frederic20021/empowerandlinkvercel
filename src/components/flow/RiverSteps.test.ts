// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { offsetWithin } from "./RiverSteps";

function box(offsetTop: number, offsetLeft: number, parent: HTMLElement | null) {
  const el = document.createElement("div");
  Object.defineProperty(el, "offsetTop", { value: offsetTop });
  Object.defineProperty(el, "offsetLeft", { value: offsetLeft });
  Object.defineProperty(el, "offsetParent", { value: parent });
  return el;
}

describe("offsetWithin", () => {
  it("sums layout offsets up to the container, ignoring transforms", () => {
    const root = box(4000, 0, document.body);
    root.append(document.createElement("span"));
    const station = box(300, 0, root);
    const node = box(22, 610, station);
    station.style.transform = "translateY(26px)"; // mid-reveal: must not shift the result
    root.appendChild(station);
    station.appendChild(node);
    expect(offsetWithin(node, root)).toEqual({ x: 610, y: 322 });
  });
});
