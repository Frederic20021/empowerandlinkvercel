// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

const sendEmail = vi.fn();
vi.mock("@/lib/emailjs", () => ({
  EMAILJS_BOOKING_TEMPLATE_ID: "template_booking",
  sendEmail: (...args: unknown[]) => sendEmail(...args),
}));

import { ENGLISH_FLOW } from "../english/flow-config";
import { JAPANESE_FLOW } from "../japanese/flow-config";
import { RequestFlow } from "./RequestFlow";

const course = { name: "【英文法】大人の英文法学び直し!コース", price: "¥25,000", duration: "60分 x4回" };

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 10, 6, 9, 0, 0));
  sendEmail.mockReset();
  sendEmail.mockResolvedValue(undefined);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const pickDay = (d: number) => fireEvent.click(screen.getByRole("button", { name: `2026年11月${d}日` }));
const fill = (label: string, value: string) => fireEvent.change(screen.getByLabelText(new RegExp(label)), { target: { value } });

describe("RequestFlow", () => {
  it("shows the calendar first, with past days disabled and no slots yet", () => {
    render(<RequestFlow labels={ENGLISH_FLOW} course={course} />);
    expect(screen.getByText("STEP 1: 日程を選択して下さい")).toBeTruthy();
    expect((screen.getByRole("button", { name: "2026年11月5日" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "2026年11月6日" }) as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByRole("button", { name: "前の月" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.queryByText("09:00")).toBeNull();
  });

  it("reveals the 12 slots after a date, then the form after a slot", () => {
    render(<RequestFlow labels={ENGLISH_FLOW} course={course} />);
    pickDay(15);
    expect(screen.getAllByRole("button", { name: /^\d\d:00$/ })).toHaveLength(12);
    expect(screen.queryByRole("textbox", { name: /お名前/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "10:00" }));
    expect(screen.getByText(/予約内容/)).toBeTruthy();
    expect(screen.getByText(`${course.name} / 2026年11月15日 10:00`)).toBeTruthy();
    expect(screen.getByLabelText(/お名前/)).toBeTruthy();
  });

  it("validates name and e-mail without sending", () => {
    render(<RequestFlow labels={ENGLISH_FLOW} course={course} />);
    pickDay(15);
    fireEvent.click(screen.getByRole("button", { name: "10:00" }));
    fireEvent.click(screen.getByRole("button", { name: /予約リクエストを送信/ }));
    expect(screen.getByRole("alert").textContent).toBe("お名前とメールアドレスは必須項目です。");
    fill("お名前", "田中太郎");
    fill("メールアドレス", "not-an-email");
    fireEvent.click(screen.getByRole("button", { name: /予約リクエストを送信/ }));
    expect(screen.getByRole("alert").textContent).toBe("お名前とメールアドレスは必須項目です。");
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("sends the booking template with the old param names and shows the in-page success", async () => {
    render(<RequestFlow labels={ENGLISH_FLOW} course={course} />);
    pickDay(15);
    fireEvent.click(screen.getByRole("button", { name: "10:00" }));
    fill("お名前", "田中太郎");
    fill("メールアドレス", "taro@example.com");
    fireEvent.click(screen.getByRole("button", { name: /予約リクエストを送信/ }));
    await waitFor(() => expect(sendEmail).toHaveBeenCalledTimes(1));
    const [templateId, params] = sendEmail.mock.calls[0];
    expect(templateId).toBe("template_booking");
    expect(Object.keys(params).sort()).toEqual(
      [
        "appointment_datetime",
        "course_duration",
        "course_name",
        "course_price",
        "customer_message",
        "customer_phone",
        "from_email",
        "from_name",
        "subject",
        "timestamp",
        "to_email",
      ].sort(),
    );
    expect(params).toMatchObject({
      to_email: "h.kadoya@empowerandlink.com",
      from_name: "田中太郎",
      from_email: "taro@example.com",
      customer_phone: "未記入",
      customer_message: "特になし",
      course_name: course.name,
      course_price: "¥25,000",
      course_duration: "60分 x4回",
      subject: `【新規予約申込】${course.name} - 田中太郎様`,
    });
    expect(params.appointment_datetime).toContain("2026年11月15日");
    expect(params.appointment_datetime).toContain("10:00");
    expect((await screen.findByRole("status")).textContent).toContain("予約情報を受け付けました！");
  });

  it("keeps the form and shows an in-page error when sending fails", async () => {
    sendEmail.mockRejectedValue(new Error("boom"));
    render(<RequestFlow labels={JAPANESE_FLOW} course={{ name: "日本語能力試験対策コース", price: "¥20,000~, ¥60,000~", duration: "月４回" }} />);
    pickDay(20);
    fireEvent.click(screen.getByRole("button", { name: "13:00" }));
    fill("お名前", "Test");
    fill("メールアドレス", "a@b.co");
    fireEvent.click(screen.getByRole("button", { name: /予約リクエストを送信/ }));
    expect((await screen.findByRole("alert")).textContent).toContain("送信中にエラーが発生");
    expect(screen.getByLabelText(/お名前/)).toBeTruthy();
    expect(sendEmail.mock.calls[0][1].subject).toBe("【新規相談予約】日本語能力試験対策コース - Test様");
  });

  it("does not send when the honeypot is filled", async () => {
    const { container } = render(<RequestFlow labels={ENGLISH_FLOW} course={course} />);
    pickDay(15);
    fireEvent.click(screen.getByRole("button", { name: "10:00" }));
    fill("お名前", "Bot");
    fill("メールアドレス", "bot@example.com");
    fireEvent.change(container.querySelector('input[name="website"]')!, { target: { value: "spam" } });
    fireEvent.click(screen.getByRole("button", { name: /予約リクエストを送信/ }));
    await screen.findByRole("status");
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("replaces {course title} in the Japanese heading", () => {
    render(<RequestFlow labels={JAPANESE_FLOW} course={{ name: "テストコース", price: "", duration: "" }} />);
    expect(screen.getByText("日程を選択して下さい（テストコース）")).toBeTruthy();
  });
});
