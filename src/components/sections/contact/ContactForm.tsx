"use client";

import { ArrowRight, CircleCheck } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { contactForm } from "@/content/contact";
import { EMAILJS_CONTACT_TEMPLATE_ID, sendEmail } from "@/lib/emailjs";

type FieldName = (typeof contactForm.fields)[number]["name"];
type Values = Record<FieldName, string>;
type Status = "idle" | "sending" | "success" | "error";

const EMPTY_MESSAGE = "入力してください";
const EMAIL_MESSAGE = "メールアドレスの形式をご確認ください";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AUTOCOMPLETE: Partial<Record<FieldName, string>> = {
  user_name: "name",
  company_name: "organization",
  user_email: "email",
  phone_number: "tel",
};

const initial = (): Values =>
  Object.fromEntries(contactForm.fields.map((f) => [f.name, ""])) as Values;

export function validate(values: Values): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  for (const f of contactForm.fields) {
    const v = values[f.name].trim();
    if (f.required && !v) errors[f.name] = EMPTY_MESSAGE;
    else if (f.type === "email" && v && !EMAIL_RE.test(v)) errors[f.name] = EMAIL_MESSAGE;
  }
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState("");

  const onChange = (name: FieldName) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    // Honeypot: bots fill the hidden field. Pretend success, send nothing.
    if (trap) {
      setStatus("success");
      return;
    }
    setStatus("sending");
    try {
      await sendEmail(EMAILJS_CONTACT_TEMPLATE_ID, {
        user_name: values.user_name.trim(),
        company_name: values.company_name.trim(),
        user_email: values.user_email.trim(),
        phone_number: values.phone_number.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      setStatus("success");
      setValues(initial());
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="fok" role="status">
        <CircleCheck className="ic" strokeWidth={1.6} aria-hidden="true" />
        <p>{contactForm.messages.success}</p>
      </div>
    );
  }

  return (
    <form className="cform" noValidate onSubmit={onSubmit} aria-label="お問い合わせフォーム">
      {contactForm.fields.map((f) => {
        const err = errors[f.name];
        const common = {
          id: `cf-${f.name}`,
          name: f.name,
          value: values[f.name],
          onChange: onChange(f.name),
          required: f.required,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `cf-${f.name}-err` : undefined,
        };
        return (
          <label className={err ? "fld bad" : "fld"} key={f.name} htmlFor={common.id}>
            <span>{f.label}</span>
            {f.type === "textarea" ? (
              <textarea {...common} rows={"rows" in f ? f.rows : 5} />
            ) : (
              <input {...common} type={f.type} autoComplete={AUTOCOMPLETE[f.name] ?? "off"} />
            )}
            <small className="err" id={`cf-${f.name}-err`} hidden={!err} role={err ? "alert" : undefined}>
              {err}
            </small>
          </label>
        );
      })}
      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </label>
      </div>
      {status === "error" ? (
        <p className="ferr" role="alert">
          {contactForm.messages.error}
        </p>
      ) : null}
      <button className="btn btn-primary btn-lg" type="submit" disabled={status === "sending"}>
        <span>{status === "sending" ? contactForm.submit.label_submitting : contactForm.submit.label}</span>
        <ArrowRight className="ic" strokeWidth={1.6} aria-hidden="true" />
      </button>
    </form>
  );
}
