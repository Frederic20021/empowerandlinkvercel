import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/flow/Reveal";
import { cn } from "@/lib/utils";

/** `<p class="eyebrow">` with the three-strand glyph. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Reveal as="p" className={cn("eyebrow", className)}>
      <i />
      {children}
    </Reveal>
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: "primary" | "ghost";
  large?: boolean;
  children: ReactNode;
  className?: string;
};

/** `.btn` link with trailing arrow. http(s) opens in a new tab; "#x" and mailto/tel are plain anchors. */
export function ButtonLink({ href, variant = "primary", large, children, className }: ButtonLinkProps) {
  const cls = cn("btn", variant === "ghost" ? "btn-ghost" : "btn-primary", large && "btn-lg", className);
  const inner = (
    <>
      <span>{children}</span>
      <ArrowRight className="ic" strokeWidth={1.6} aria-hidden="true" />
    </>
  );
  if (/^https?:/.test(href))
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  if (/^(#|mailto:|tel:)/.test(href))
    return (
      <a className={cls} href={href}>
        {inner}
      </a>
    );
  return (
    <Link className={cls} href={href}>
      {inner}
    </Link>
  );
}

type CtaRowProps = {
  ctas: ReadonlyArray<{ label: string; href: string; style?: string }>;
  className?: string;
};

/** Row of buttons from site.json `ctas` ({label, href, style: "ghost"|"outline"?}). */
export function CtaRow({ ctas, className }: CtaRowProps) {
  return (
    <Reveal className={cn("cta-row", className)}>
      {ctas.map((c) => (
        <ButtonLink key={c.label} href={c.href} variant={c.style === "ghost" || c.style === "outline" ? "ghost" : "primary"}>
          {c.label}
        </ButtonLink>
      ))}
    </Reveal>
  );
}

type SectionHeadProps = {
  eyebrow?: string;
  /** Heading content (may contain <span className="hl">). Rendered in an h2. */
  children: ReactNode;
  sub?: string;
  center?: boolean;
};

/** `<header class="shead">` with eyebrow, h2 and optional lead. */
export function SectionHead({ eyebrow, children, sub, center }: SectionHeadProps) {
  return (
    <Reveal as="header" className={cn("shead", center && "center")}>
      {eyebrow ? (
        <p className="eyebrow">
          <i />
          {eyebrow}
        </p>
      ) : null}
      <h2>{children}</h2>
      {sub ? <p className="lead">{sub}</p> : null}
    </Reveal>
  );
}
