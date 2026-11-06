// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

// Calls are recorded in a plain array and the outcome comes from `outcome`, so a rejected
// promise is only ever observed by the component under test.
const calls: unknown[][] = [];
let outcome: "ok" | "fail" = "ok";
const sendEmail = {
  mockReset() {
    calls.length = 0;
    outcome = "ok";
  },
};
vi.mock("@/lib/emailjs", () => ({
  EMAILJS_CONTACT_TEMPLATE_ID: "tpl_contact",
  sendEmail: async (...args: unknown[]) => {
    calls.push(args);
    if (outcome === "fail") throw new Error("boom");
  },
}));

import { ContactForm } from "./ContactForm";

beforeEach(() => sendEmail.mockReset());
afterEach(cleanup);

function fill(label: RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}
function fillRequired() {
  fill(/お名前/, "山田 太郎");
  fill(/メールアドレス/, "taro@example.com");
  fill(/題名/, "ご相談");
  fill(/メッセージ本文/, "よろしくお願いします。");
}

describe("ContactForm", () => {
  it("shows validation errors and does not send when required fields are empty", () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: /送信/ }));
    expect(screen.getAllByText("入力してください")).toHaveLength(4);
    expect(calls).toHaveLength(0);
  });

  it("rejects a malformed email", () => {
    render(<ContactForm />);
    fillRequired();
    fill(/メールアドレス/, "not-an-email");
    fireEvent.click(screen.getByRole("button", { name: /送信/ }));
    expect(screen.getByText("メールアドレスの形式をご確認ください")).toBeTruthy();
    expect(calls).toHaveLength(0);
  });

  it("sends the template params and shows the success state", async () => {
    render(<ContactForm />);
    fillRequired();
    fill(/会社名/, "株式会社テスト");
    fill(/電話番号/, "090-0000-0000");
    fireEvent.click(screen.getByRole("button", { name: /送信/ }));
    await waitFor(() => expect(screen.getByText("メッセージが送信されました！")).toBeTruthy());
    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual(["tpl_contact", {
      user_name: "山田 太郎",
      company_name: "株式会社テスト",
      user_email: "taro@example.com",
      phone_number: "090-0000-0000",
      subject: "ご相談",
      message: "よろしくお願いします。",
    }]);
  });

  it("shows the Japanese error message when sending fails and keeps the form", async () => {
    outcome = "fail";
    render(<ContactForm />);
    fillRequired();
    fireEvent.click(screen.getByRole("button", { name: /送信/ }));
    await waitFor(() => expect(screen.getByText("送信に失敗しました。もう一度お試しください。")).toBeTruthy());
    expect((screen.getByLabelText(/お名前/) as HTMLInputElement).value).toBe("山田 太郎");
  });

  it("does not send when the honeypot is filled", async () => {
    render(<ContactForm />);
    fillRequired();
    fireEvent.change(document.querySelector('input[name="website"]')!, { target: { value: "spam" } });
    fireEvent.click(screen.getByRole("button", { name: /送信/ }));
    await waitFor(() => expect(screen.getByText("メッセージが送信されました！")).toBeTruthy());
    expect(calls).toHaveLength(0);
  });
});
