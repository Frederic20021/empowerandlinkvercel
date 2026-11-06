// EmailJS public identifiers, carried over from the previous site (app/constants/emailjs.js).
// These are public browser keys by design; no secret is stored here.
export const EMAILJS_SERVICE_ID = "service_mvj6kjl";
/** Trial / booking request emails (English and Japanese lesson pages). */
export const EMAILJS_BOOKING_TEMPLATE_ID = "template_8l3j228";
/** Contact page form. */
export const EMAILJS_CONTACT_TEMPLATE_ID = "template_ihn0p5u";
export const EMAILJS_PUBLIC_KEY = "6QoeQf_j3aOl01Tut";

export type EmailParams = Record<string, string>;

/** Sends one EmailJS template. Loaded lazily so the SDK only ships with the forms. */
export async function sendEmail(templateId: string, params: EmailParams): Promise<void> {
  const emailjs = (await import("@emailjs/browser")).default;
  await emailjs.send(EMAILJS_SERVICE_ID, templateId, params, { publicKey: EMAILJS_PUBLIC_KEY });
}
