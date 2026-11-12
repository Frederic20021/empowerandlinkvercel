import { Reveal } from "@/components/flow/Reveal";
import { ButtonLink, Eyebrow } from "@/components/layout/primitives";
import { smartMensetsuEmbed, smartMensetsuHero } from "@/content/smart-mensetsu";
import { BrowserFrame } from "../shared/BrowserFrame";
import { Lines } from "../shared/text";

export function SmartHero() {
  const h = smartMensetsuHero;
  return (
    <section className="sec phero" id="hero">
      <div className="wrap">
        <Eyebrow>{h.eyebrow}</Eyebrow>
        <Reveal as="h1">
          <Lines lines={h.heading} />
        </Reveal>
        <Reveal>
          {h.body.map((b) => (
            <p className="lead" key={b}>
              {b}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function SmartEmbed() {
  const e = smartMensetsuEmbed.embed;
  const url = e.url.replace(/^https:\/\//, "").replace(/[/#]+$/, "");
  return (
    <section className="sec" id="embed">
      <div className="wrap wide">
        <BrowserFrame url={url} big>
          <iframe src={e.url} title={e.title} loading="lazy" />
        </BrowserFrame>
        <Reveal className="cta-row center">
          {smartMensetsuEmbed.ctas.map((c) => (
            <ButtonLink key={c.label} href={c.href}>
              {c.label}
            </ButtonLink>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

