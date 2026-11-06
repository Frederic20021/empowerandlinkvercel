import { describe, expect, it } from "vitest";
import * as englishMod from "./english";
import * as ictMod from "./ict";
import * as japaneseMod from "./japanese";
import * as notionMod from "./notion";
import * as offshoreMod from "./offshore";
import * as smartMod from "./smart-mensetsu";

/** Every string in the tree is non-empty; arrays are non-empty. */
function assertNoEmpty(value: unknown, path: string) {
  if (typeof value === "string") {
    expect(value.trim(), path).not.toBe("");
  } else if (Array.isArray(value)) {
    expect(value.length, `${path} is empty`).toBeGreaterThan(0);
    value.forEach((v, i) => assertNoEmpty(v, `${path}[${i}]`));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) assertNoEmpty(v, `${path}.${k}`);
  }
}

function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => allStrings(v, out));
  return out;
}

function hrefsOf(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => hrefsOf(v, out));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (k === "href" && typeof v === "string") out.push(v);
      else hrefsOf(v, out);
    }
  }
  return out;
}

const modules = [
  ["english", englishMod.english],
  ["japanese", japaneseMod.japanese],
  ["ict", ictMod.ict],
  ["notion", notionMod.notion],
  ["offshore", offshoreMod.offshore],
  ["smart-mensetsu", smartMod.smartMensetsuEmbed],
] as const;

describe.each(modules)("%s content module", (name, mod) => {
  it("has no empty fields", () => {
    assertNoEmpty(mod, name);
  });
  it("has a page title", () => {
    expect(mod.title.length).toBeGreaterThan(0);
  });
  it("links only to real routes, anchors, tel: or https URLs", () => {
    const hrefs = hrefsOf(mod);
    const ok = /^(\/(contact|notion|offshore|smart-mensetsu|english|japanese|ict|company|recruitment)?|#[\w-]+|tel:\+\d+|https:\/\/[\w./#?=&%-]+)$/;
    for (const h of hrefs) expect(h, h).toMatch(ok);
    expect(allStrings(mod)).not.toContain("/smartmensetsu");
  });
});

describe("english", () => {
  const e = englishMod.english;
  it("keeps the verbatim course catalogue", () => {
    expect(e.courses.items).toHaveLength(8);
    expect(e.courses.items[0].title).toBe("【英文法】大人の英文法学び直し!コース");
    expect(e.courses.items[0].pricing.price).toBe("¥25,000");
    for (const c of e.courses.items) expect(c.stripe_link).toMatch(/^https:\/\/buy\.stripe\.com\//);
    const withOriginal = e.courses.items.filter((c) => "originalPrice" in c.pricing);
    expect(withOriginal).toHaveLength(1);
  });
  it("has three instructors, four testimonials, four FAQs and 12 time slots", () => {
    expect(e.profintro.items).toHaveLength(3);
    expect(e.voice.items).toHaveLength(4);
    expect(e.faq.items).toHaveLength(4);
    expect(e.courses.booking_flow.step2.slots).toHaveLength(12);
  });
  it("every course instructor appears in the instructor list", () => {
    const names = e.profintro.items.map((p) => p.name.toLowerCase().replace(/\s+/g, ""));
    for (const c of e.courses.items) expect(names).toContain(c.instructor.toLowerCase().replace(/\s+/g, ""));
  });
});

describe("japanese", () => {
  it("has two instructors and priced services", () => {
    const j = japaneseMod.japanese;
    expect(j.professors.items).toHaveLength(2);
    expect(j.services.items.length).toBeGreaterThan(0);
    for (const s of j.services.items) expect(s.pricing.length).toBeGreaterThan(0);
    expect(j.cta.ctas[1].href).toBe("tel:+817066160410");
  });
});

describe("ict", () => {
  it("renders the AI interview chips from the overlay texts", () => {
    const o = ictMod.ict.aiInterview.illustration.overlay_texts;
    expect(o.top_right_bubble.title).toBe("AI面接中");
    expect(o.bottom_right_card).toMatchObject({ score: "85", grade: "A評価", label: "総合スコア" });
    expect(o.bottom_left_pill.text).toBe("24時間対応中");
  });
  it("points the AI interview CTA at /smart-mensetsu and the flow bar at the three sections", () => {
    expect(ictMod.ict.aiInterview.ctas[0].href).toBe("/smart-mensetsu");
    expect(ictMod.ict.flowbar.items.map((i) => i.href)).toEqual(["#notion", "#ai-interview", "#offshore"]);
  });
});

describe("notion", () => {
  const n = notionMod.notion;
  it("has six pricing factors with a table each", () => {
    expect(n.factors.items).toHaveLength(6);
    for (const f of n.factors.items) {
      expect(f.table_rows.length).toBeGreaterThan(0);
      for (const r of f.table_rows) expect(r.length).toBe(f.table_headers.length);
    }
  });
  it("marks exactly one contract term as recommended", () => {
    expect(n.contract.items.filter((t) => t.recommended)).toHaveLength(1);
  });
  it("has numbered process steps and FAQ", () => {
    for (const s of n.process.items) expect(s.label).toMatch(/\d/);
    expect(n.faq.items.length).toBeGreaterThan(0);
  });
});

describe("offshore", () => {
  const o = offshoreMod.offshore;
  it("contact form keeps the eight EmailJS param names", () => {
    expect(o.contact.form.fields.map((f) => f.name)).toEqual([
      "user_name",
      "company_name",
      "user_email",
      "postcode",
      "address",
      "phone_number",
      "subject",
      "message",
    ]);
  });
  it("has five price plans and three case studies", () => {
    expect(o.pricePlan.items).toHaveLength(5);
    expect(o.pitch5Case.items).toHaveLength(3);
  });
});

describe("smart-mensetsu", () => {
  it("embeds smart-mensetsu.com and reuses the ICT AI interview hero copy", () => {
    expect(smartMod.smartMensetsuEmbed.embed.url).toBe("https://smart-mensetsu.com/#");
    expect(smartMod.smartMensetsuHero.heading).toEqual(ictMod.ict.aiInterview.heading);
    expect(smartMod.smartMensetsuEmbed.ctas[0].label).toBe("無料デモを申し込む");
  });
});
