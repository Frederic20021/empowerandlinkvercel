"use client";

import { useState, type FormEvent } from "react";
import { EMAILJS_BOOKING_TEMPLATE_ID, sendEmail } from "@/lib/emailjs";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type RequestField = { readonly label: string; readonly placeholder: string };

/** All visible text of the flow; the pages build it from site.json (booking_flow) with emoji stripped. */
export type RequestFlowLabels = {
  /** Step 1 heading; "{course title}" is replaced with the course name. Omit with `hideHeading`. */
  heading: string;
  hint: string;
  step2Title: string;
  /** "選択日:" (empty for the Japanese page). */
  selectedDateLabel: string;
  step3Title: string;
  summaryLabel: string;
  /** Exactly four: name, email, phone, message (in this order). */
  fields: ReadonlyArray<RequestField>;
  slots: ReadonlyArray<string>;
  submit: string;
  submitting: string;
  missing: string;
  success: string;
  error: string;
  /** Email subject prefix, e.g. "【新規予約申込】". */
  subjectPrefix: string;
};

export type RequestCourse = { name: string; price: string; duration: string };

type Props = {
  labels: RequestFlowLabels;
  course: RequestCourse;
  /** The heading is rendered by the parent (modal title). */
  hideHeading?: boolean;
  className?: string;
};

export const BOOKING_TO_EMAIL = "h.kadoya@empowerandlink.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const fmtShort = (d: Date) => `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
const fmtLong = (d: Date) =>
  d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

type Status = "idle" | "sending" | "ok" | "error";
type Values = { name: string; email: string; phone: string; message: string; website: string };
const EMPTY: Values = { name: "", email: "", phone: "", message: "", website: "" };

/**
 * Trial / consultation request: calendar -> time slot -> customer form -> EmailJS.
 * It only sends an email (no booking backend); the chosen date/time travel as text in `appointment_datetime`.
 */
export function RequestFlow({ labels, course, hideHeading, className }: Props) {
  const [today] = useState(() => startOfDay(new Date()));
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [sel, setSel] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [v, setV] = useState<Values>(EMPTY);
  const [bad, setBad] = useState<ReadonlySet<"name" | "email">>(new Set());
  const [showMissing, setShowMissing] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const [fName, fEmail, fPhone, fMessage] = labels.fields;
  const y = view.getFullYear();
  const mo = view.getMonth();
  const lead = new Date(y, mo, 1).getDay();
  const days = new Date(y, mo + 1, 0).getDate();
  const atCurrentMonth = y === today.getFullYear() && mo === today.getMonth();

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    setV((prev) => ({ ...prev, [k]: e.target.value }));
    if (k === "name" || k === "email") {
      setBad((prev) => {
        if (!prev.has(k)) return prev;
        const next = new Set(prev);
        next.delete(k);
        return next;
      });
    }
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending" || !sel || !slot) return;
    const nextBad = new Set<"name" | "email">();
    if (!v.name.trim()) nextBad.add("name");
    if (!v.email.trim() || !EMAIL_RE.test(v.email.trim())) nextBad.add("email");
    setBad(nextBad);
    setShowMissing(nextBad.size > 0);
    if (nextBad.size > 0) return;
    // Honeypot: bots fill the hidden field; pretend success without sending.
    if (v.website) {
      setStatus("ok");
      return;
    }
    setStatus("sending");
    const name = v.name.trim();
    try {
      await sendEmail(EMAILJS_BOOKING_TEMPLATE_ID, {
        to_email: BOOKING_TO_EMAIL,
        from_name: name,
        from_email: v.email.trim(),
        customer_phone: v.phone.trim() || "未記入",
        customer_message: v.message.trim() || "特になし",
        course_name: course.name,
        course_price: course.price,
        course_duration: course.duration,
        appointment_datetime: `${fmtLong(sel)} ${slot}`,
        subject: `${labels.subjectPrefix}${course.name} - ${name}様`,
        timestamp: new Date().toISOString(),
      });
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  const heading = labels.heading.replace("{course title}", course.name);
  const summary = `${course.name}${sel ? ` / ${fmtShort(sel)}` : ""}${slot ? ` ${slot}` : ""}`;

  if (status === "ok") {
    return (
      <div className={cn("bk-ok", className)} role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <Icon name="checkc" />
        {labels.success
          .split("\n")
          .filter((l) => l.trim())
          .map((l) => (
            <p key={l}>{l}</p>
          ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {hideHeading ? null : <h3 className="bk-h">{heading}</h3>}
      <div className="bk-s1">
        <p className="hint">{labels.hint}</p>
        <div className="cal">
          <div className="cal-h">
            <button
              type="button"
              aria-label="前の月"
              disabled={atCurrentMonth}
              onClick={() => setView(new Date(y, mo - 1, 1))}
            >
              &#8249;
            </button>
            <span aria-live="polite">
              {y}年{mo + 1}月
            </span>
            <button type="button" aria-label="次の月" onClick={() => setView(new Date(y, mo + 1, 1))}>
              &#8250;
            </button>
          </div>
          <div className="cal-g">
            {WEEK.map((w) => (
              <b key={w}>{w}</b>
            ))}
            {Array.from({ length: lead }, (_, i) => (
              <span key={`e${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const d = i + 1;
              const dt = new Date(y, mo, d);
              const on = !!sel && sel.getTime() === dt.getTime();
              return (
                <button
                  key={d}
                  type="button"
                  disabled={dt < today}
                  className={on ? "sel" : undefined}
                  aria-pressed={on}
                  aria-label={`${y}年${mo + 1}月${d}日`}
                  onClick={() => setSel(dt)}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {sel ? (
        <div className="bk-s2">
          <h3>{labels.step2Title}</h3>
          <p className="sel">
            {labels.selectedDateLabel} <b>{fmtShort(sel)}</b>
          </p>
          <div className="slots">
            {labels.slots.map((s) => (
              <button
                key={s}
                type="button"
                className={cn("slot", slot === s && "sel")}
                aria-pressed={slot === s}
                onClick={() => setSlot(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {sel && slot ? (
        <form className="bk-s3" noValidate onSubmit={onSubmit}>
          <h3>{labels.step3Title}</h3>
          <p className="summ">
            <b>{labels.summaryLabel}</b> <span>{summary}</span>
          </p>
          <label className={cn("fld", bad.has("name") && "bad")}>
            <span>{fName.label}</span>
            <input
              type="text"
              name="from_name"
              autoComplete="name"
              placeholder={fName.placeholder}
              value={v.name}
              onChange={set("name")}
              aria-invalid={bad.has("name")}
              required
            />
          </label>
          <label className={cn("fld", bad.has("email") && "bad")}>
            <span>{fEmail.label}</span>
            <input
              type="email"
              name="from_email"
              autoComplete="email"
              placeholder={fEmail.placeholder}
              value={v.email}
              onChange={set("email")}
              aria-invalid={bad.has("email")}
              required
            />
          </label>
          <label className="fld">
            <span>{fPhone.label}</span>
            <input
              type="tel"
              name="customer_phone"
              autoComplete="tel"
              placeholder={fPhone.placeholder}
              value={v.phone}
              onChange={set("phone")}
            />
          </label>
          <label className="fld">
            <span>{fMessage.label}</span>
            <textarea
              name="customer_message"
              rows={3}
              placeholder={fMessage.placeholder}
              value={v.message}
              onChange={set("message")}
            />
          </label>
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
            <label>
              website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} />
            </label>
          </div>
          {showMissing ? (
            <p className="ferr" role="alert">
              {labels.missing}
            </p>
          ) : null}
          {status === "error" ? (
            <p className="ferr" role="alert">
              {labels.error}
            </p>
          ) : null}
          <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
            <span>{status === "sending" ? labels.submitting : labels.submit}</span>
            <Icon name="arrow" />
          </button>
        </form>
      ) : null}
    </div>
  );
}
