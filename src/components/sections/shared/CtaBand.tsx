import type { ReactNode } from "react";
import Image from "next/image";
import { Reveal } from "@/components/flow/Reveal";
import { CtaRow, Eyebrow } from "@/components/layout/primitives";

type Props = {
  id: string;
  eyebrow?: string;
  heading: ReactNode;
  /** Content of `.ctab-body` (paragraphs). */
  body: ReactNode;
  /** Rendered between the body and the buttons (e.g. the Notion contact person). */
  middle?: ReactNode;
  ctas: ReadonlyArray<{ label: string; href: string; style?: string }>;
  note?: string;
};

/** Navy CTA band (`.sec.ctab`) with a free-form heading/body, for the service pages. */
export function CtaBand({ id, eyebrow, heading, body, middle, ctas, note }: Props) {
  return (
    <section className="sec ctab" id={id}>
      <div className="ctab-in wrap">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Reveal as="h2">{heading}</Reveal>
        <Reveal className="ctab-body">{body}</Reveal>
        {middle}
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
