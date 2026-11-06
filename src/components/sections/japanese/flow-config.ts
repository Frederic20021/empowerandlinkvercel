import { english } from "@/content/english";
import { japanese } from "@/content/japanese";
import type { RequestFlowLabels } from "../shared/RequestFlow";
import { stripEmoji } from "../shared/text";

const f = japanese.services.booking_flow;
const en = english.courses.booking_flow;

/** Consultation-request flow labels for /japanese, from site.json services.booking_flow (emoji removed as in the mockup). */
export const JAPANESE_FLOW: RequestFlowLabels = {
  heading: stripEmoji(f.step1),
  hint: f.hint,
  step2Title: stripEmoji(f.step2),
  selectedDateLabel: "",
  step3Title: stripEmoji(f.step3),
  summaryLabel: f.summary_labels[0],
  fields: f.fields,
  // Time slots and the missing-fields message are shared with the English page (the Japanese page defines none of its own).
  slots: en.step2.slots,
  submit: f.submit,
  submitting: f.submitting,
  missing: en.alerts.missing,
  success: stripEmoji(f.success_alert),
  // Not in site.json: wording of the old site's failure alert (without the developer-facing EmailJS hint).
  error: "申し訳ございません。送信中にエラーが発生いたしました。お急ぎの場合はお電話にてご連絡ください。",
  subjectPrefix: "【新規相談予約】",
};
