import { Fragment, type ReactNode } from "react";

/** Renders text from the content modules: "\n" becomes <br>, <em>/<strong> markup in the source is kept. */
export function Rich({ text }: { text: string }): ReactNode {
  const out: ReactNode[] = [];
  text.split("\n").forEach((line, li) => {
    if (li > 0) out.push(<br key={`br${li}`} />);
    line.split(/(<em>.*?<\/em>|<strong>.*?<\/strong>)/).forEach((part, pi) => {
      const m = /^<(em|strong)>(.*)<\/\1>$/.exec(part);
      if (m) out.push(m[1] === "em" ? <em key={`${li}-${pi}`}>{m[2]}</em> : <strong key={`${li}-${pi}`}>{m[2]}</strong>);
      else if (part) out.push(<Fragment key={`${li}-${pi}`}>{part}</Fragment>);
    });
  });
  return <>{out}</>;
}

/** Wraps the first occurrence of `sub` in `text` with a span of class `cls` (default highlight underline). */
export function Hl({ text, sub, cls = "hl" }: { text: string; sub: string; cls?: string }) {
  const i = text.indexOf(sub);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className={cls}>{sub}</span>
      {text.slice(i + sub.length)}
    </>
  );
}
