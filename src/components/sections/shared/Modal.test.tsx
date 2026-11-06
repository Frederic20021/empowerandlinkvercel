// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Modal } from "./Modal";

afterEach(cleanup);

describe("Modal", () => {
  it("is a labelled modal dialog, focuses the close button and locks scroll", () => {
    const { unmount } = render(
      <Modal title="見出し" onClose={() => {}}>
        <button type="button">中身</button>
      </Modal>,
    );
    const dlg = screen.getByRole("dialog", { name: "見出し" });
    expect(dlg.getAttribute("aria-modal")).toBe("true");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "閉じる" }));
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes on Escape, on the close button and on the backdrop", () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal title="t" onClose={onClose}>
        <p>x</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
    expect(onClose).toHaveBeenCalledTimes(2);
    fireEvent.click(document.querySelector(".modal-back")!);
    expect(onClose).toHaveBeenCalledTimes(3);
    expect(container.innerHTML).toBe("");
  });

  it("keeps Tab focus inside the dialog", () => {
    render(
      <Modal title="t" onClose={() => {}}>
        <button type="button">最後</button>
      </Modal>,
    );
    const close = screen.getByRole("button", { name: "閉じる" });
    const last = screen.getByRole("button", { name: "最後" });
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(close);
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("returns focus to the opener on unmount", () => {
    const opener = document.createElement("button");
    document.body.appendChild(opener);
    opener.focus();
    const { unmount } = render(
      <Modal title="t" onClose={() => {}}>
        <p>x</p>
      </Modal>,
    );
    unmount();
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });
});
