import Image from "next/image";
import { Reveal } from "@/components/flow/Reveal";
import { CtaRow, Eyebrow } from "@/components/layout/primitives";

type CtaBandProps = {
  id: string;
  eyebrow?: string;
  heading: string | readonly string[];
  body?: readonly string[];
  ctas: ReadonlyArray<{ label: string; href: string; style?: string }>;
  /** Small note under the buttons (e.g. recruitment). */
  note?: string;
};

/** Navy CTA band (`.sec.ctab`) shared by home, company and recruitment. */
export function CtaBand({ id, eyebrow, heading, body, ctas, note }: CtaBandProps) {
  const lines = typeof heading === "string" ? [heading] : heading;
  return (
    <section className="sec ctab" id={id}>
      <div className="ctab-in wrap">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Reveal as="h2">
          {lines.map((l, i) => (
            <span key={l}>
              {i > 0 ? <br /> : null}
              {l}
            </span>
          ))}
        </Reveal>
        {body ? (
          <Reveal className="ctab-body">
            {body.map((b) => (
              <p key={b}>{b}</p>
            ))}
          </Reveal>
        ) : null}
        <CtaRow ctas={ctas} />
        {note ? (
          <Reveal as="p" className="cnote">
            {note}
          </Reveal>
        ) : null}
        <Image className="ctab-mark" src="/images/logo-mark.png" alt="" width={497} height={338} aria-hidden="true" />
      </div>
      <div className="ctab-flow" aria-hidden="true" />
    </section>
  );
}
