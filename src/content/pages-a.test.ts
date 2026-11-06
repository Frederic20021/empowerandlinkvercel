import { describe, expect, it } from "vitest";
import * as company from "./company";
import * as contact from "./contact";
import * as home from "./home";
import * as recruitment from "./recruitment";

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

const EMOJI = /[\u{1F000}-\u{1FFFF}⌀-⏿☀-➿]/u;

function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => allStrings(v, out));
  return out;
}

describe.each([
  ["home", home],
  ["company", company],
  ["contact", contact],
  ["recruitment", recruitment],
])("%s content module", (name, mod) => {
  it("has no empty fields", () => {
    assertNoEmpty(mod, name);
  });
  it("contains no emoji", () => {
    expect(allStrings(mod).filter((s) => EMOJI.test(s))).toEqual([]);
  });
});

describe("home content", () => {
  it("keeps the required copy", () => {
    expect(home.homeHero.heading[1]).toBe("活力ある社会を創造する");
    expect(home.homeStats.items).toHaveLength(4);
    expect(home.homeProblems.items).toHaveLength(6);
    expect(home.homeServices.items.map((i) => i.cta.href)).toEqual(["/recruitment", "/english", "/japanese", "/ict"]);
    expect(home.homePhilosophy.items).toHaveLength(3);
    expect(home.homeWhy.heading).toBe("選ばれる4つの理由");
    expect(home.homeWhy.items).toHaveLength(4);
    expect(home.homeCta.ctas[0].href).toBe("/contact");
  });
  it("uses numeric stat values", () => {
    for (const s of home.homeStats.items) expect(Number.isNaN(Number(s.num))).toBe(false);
  });
});

describe("company content", () => {
  it("has the CEO message, profile and access info", () => {
    expect(company.companyCeo.person.name).toBe("角谷 寛人");
    expect(company.companyCeo.body.join("")).toContain("資源は有限でも繋がりは無限です。");
    expect(company.companyInfo.items.map((i) => i.label)).toEqual([
      "会社名", "代表取締役", "所在地", "電話番号", "資本金", "設立", "事業内容", "取引銀行",
    ]);
    expect(company.companyVideo.video.id).toBe("TvR8DCBHiVM");
    expect(company.companyAccess.map.embed_url).toMatch(/^https:\/\/www\.google\.com\/maps\/embed/);
    expect(company.companyAccess.items).toHaveLength(3);
  });
});

describe("contact content", () => {
  it("defines the six EmailJS fields in order with required flags", () => {
    expect(contact.contactForm.fields.map((f) => [f.name, f.required])).toEqual([
      ["user_name", true],
      ["company_name", false],
      ["user_email", true],
      ["phone_number", false],
      ["subject", true],
      ["message", true],
    ]);
    expect(contact.contactForm.messages.error).toBe("送信に失敗しました。もう一度お試しください。");
    expect(contact.contactForm.messages.success).toBe("メッセージが送信されました！");
  });
});

describe("recruitment content", () => {
  it("has six process steps, two visas, two countries", () => {
    expect(recruitment.recruitmentProcess.items.map((i) => i.num)).toEqual(["01", "02", "03", "04", "05", "06"]);
    expect(recruitment.recruitmentVisas.items).toHaveLength(2);
    expect(recruitment.recruitmentCountries.items.map((c) => c.name)).toEqual(["スリランカ", "ミャンマー"]);
    expect(recruitment.recruitmentServices.items.map((s) => s.title_letter)).toEqual(["A", "B", "C"]);
    expect(recruitment.recruitmentProcess.body).toContain("成功報酬型");
    expect(recruitment.recruitmentCta.ctas.map((c) => c.href)).toEqual(["/contact", "#process"]);
  });
});
