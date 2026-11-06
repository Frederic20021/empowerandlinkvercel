import { english } from "@/content/english";
import type { RequestFlowLabels } from "../shared/RequestFlow";
import { stripEmoji } from "../shared/text";

const f = english.courses.booking_flow;

/** Trial-request flow labels for /english, from site.json courses.booking_flow (emoji removed as in the mockup). */
export const ENGLISH_FLOW: RequestFlowLabels = {
  heading: stripEmoji(f.step1.title),
  hint: f.step1.hint,
  step2Title: stripEmoji(f.step2.title),
  selectedDateLabel: f.step2.selected_date_label,
  step3Title: stripEmoji(f.step3.title),
  summaryLabel: f.step3.summary_label,
  fields: f.step3.fields,
  slots: f.step2.slots,
  submit: f.step3.submit,
  submitting: f.step3.submitting,
  missing: f.alerts.missing,
  success: stripEmoji(f.alerts.accepted),
  // Not in site.json: wording of the old site's failure alert (without the developer-facing EmailJS hint).
  error: "申し訳ございません。送信中にエラーが発生いたしました。お急ぎの場合は直接お電話にてご連絡ください。",
  subjectPrefix: "【新規予約申込】",
};
