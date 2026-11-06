"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { offshore } from "@/content/offshore";
import { EMAILJS_CONTACT_TEMPLATE_ID, sendEmail } from "@/lib/emailjs";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";

const form = offshore.contact.form;
type FieldName = (typeof form.fields)[number]["name"];
type Values = Record<FieldName, string>;
type Status = "idle" | "sending" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AUTOCOMPLETE: Partial<Record<FieldName, string>> = {
  user_name: "name",
  company_name: "organization",
  user_email: "email",
  postcode: "postal-code",
  address: "street-address",
  phone_number: "tel",
};
const EMPTY = (): Values => Object.fromEntries(form.fields.map((f) => [f.name, ""])) as Values;

/** Validation: 必須 fields must be filled, the e-mail must look like one. */
export function validateOffshore(values: Values): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  for (const f of form.fields) {
    const v = values[f.name].trim();
    if (f.tag === "必須" && !v) errors[f.name] = "入力してください";
    else if (f.type === "email" && v && !EMAIL_RE.test(v)) errors[f.name] = "メールアドレスの形式をご確認ください";
  }
  return errors;
}

/** Offshore consultation form: sends the contact template with the old form's eight params. */
export function OffshoreContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState("");

  const onChange = (name: FieldName) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const found = validateOffshore(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    if (trap) {
      setStatus("success");
      return;
    }
    setStatus("sending");
    try {
      await sendEmail(
        EMAILJS_CONTACT_TEMPLATE_ID,
        Object.fromEntries(form.fields.map((f) => [f.name, values[f.name].trim()])),
      );
      setStatus("success");
      setValues(EMPTY());
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="fok" role="status">
        <Icon name="checkc" />
        <p>{form.messages.success}</p>
      </div>
    );
  }

  return (
    <form className="cform" noValidate onSubmit={onSubmit} aria-label="オフショア開発のご相談フォーム">
      {form.fields.map((f) => {
        const err = errors[f.name];
        const id = `of-${f.name}`;
        const common = {
          id,
          name: f.name,
          value: values[f.name],
          onChange: onChange(f.name),
          required: f.tag === "必須",
          placeholder: "placeholder" in f ? f.placeholder : undefined,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `${id}-err` : undefined,
        };
        return (
          <label className={cn("fld", err && "bad")} key={f.name} htmlFor={id}>
            <span>
              {f.label}
              <em className={cn("req", f.tag !== "必須" && "opt")}>{f.tag}</em>
            </span>
            {f.type === "textarea" ? (
              <textarea {...common} rows={"rows" in f ? f.rows : 5} />
            ) : (
              <input {...common} type={f.type} autoComplete={AUTOCOMPLETE[f.name] ?? "off"} />
            )}
            {"help" in f ? <small className="help">{f.help}</small> : null}
            <small className="err" id={`${id}-err`} hidden={!err} role={err ? "alert" : undefined}>
              {err}
            </small>
          </label>
        );
      })}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </label>
      </div>
      {status === "error" ? (
        <p className="ferr" role="alert">
          {form.messages.error}
        </p>
      ) : null}
      <button className="btn btn-primary btn-lg" type="submit" disabled={status === "sending"}>
        <span>{status === "sending" ? form.submit.label_submitting : form.submit.label}</span>
        <Icon name="arrow" />
      </button>
    </form>
  );
}
