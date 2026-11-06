import { Fragment, type ReactNode } from "react";

/** Strips the emoji the old site put in labels (the mockup renders these without emoji). */
export function stripEmoji(s: string): string {
  return s.replace(/[\u{1F000}-\u{1FFFF}⌀-⏿☀-➿️‍⭐⬆]/gu, "").trim();
}

/** Content image path ("assets/hero/CEO.jpg") -> public URL. */
export function imgSrc(p: string): string {
  return `/images/${p.replace(/^assets\//, "")}`;
}

/** Phone number "070-6616-0410" -> "tel:+817066160410". */
export function telHref(phone: string): string {
  return `tel:+81${phone.replace(/\D/g, "").replace(/^0/, "")}`;
}

const TAG = /<(strong|em)>([\s\S]*?)<\/\1>/g;

/** Text with "\n" -> <br>, tabs dropped, and inline <strong>/<em> kept (the only tags used in site.json). */
export function Rich({ text }: { text: string }): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  const lines = (s: string) =>
    s
      .replace(/\t/g, "")
      .split("\n")
      .map((line, i) => (
        <Fragment key={`${k}-${i}`}>
          {i > 0 ? <br /> : null}
          {line}
        </Fragment>
      ));
  for (const m of text.matchAll(TAG)) {
    const at = m.index ?? 0;
    if (at > last) out.push(<Fragment key={k++}>{lines(text.slice(last, at))}</Fragment>);
    const Tag = m[1] as "strong" | "em";
    out.push(<Tag key={k++}>{lines(m[2])}</Tag>);
    last = at + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={k++}>{lines(text.slice(last))}</Fragment>);
  return <>{out}</>;
}

/** Several lines joined with <br>. */
export function Lines({ lines }: { lines: ReadonlyArray<string> }) {
  return (
    <>
      {lines.map((l, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          <Rich text={l} />
        </Fragment>
      ))}
    </>
  );
}

export type MarkSpec = { text: string; as?: "span" | "strong" | "u" | "mark" | "b"; cls?: string };

/**
 * Wraps the first occurrence of each mark in an element (the mockup's `hl()`):
 * a plain string becomes `<span class={cls}>`; a spec can pick another tag/class.
 */
export function Hl({ text, marks, cls = "hl" }: { text: string; marks: ReadonlyArray<string | MarkSpec>; cls?: string }) {
  const specs: MarkSpec[] = marks.map((m) => (typeof m === "string" ? { text: m, cls } : m));
  const found = specs
    .map((m) => ({ m, at: text.indexOf(m.text) }))
    .filter((x) => x.at >= 0)
    .sort((a, b) => a.at - b.at);
  const out: ReactNode[] = [];
  let pos = 0;
  found.forEach(({ m, at }, i) => {
    if (at < pos) return;
    if (at > pos) out.push(<Rich key={`t${i}`} text={text.slice(pos, at)} />);
    const Tag = m.as ?? "span";
    out.push(
      <Tag key={`h${i}`} className={m.cls}>
        <Rich text={m.text} />
      </Tag>,
    );
    pos = at + m.text.length;
  });
  if (pos < text.length) out.push(<Rich key="end" text={text.slice(pos)} />);
  return <>{out}</>;
}
