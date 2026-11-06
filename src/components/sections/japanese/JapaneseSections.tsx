import { Reveal } from "@/components/flow/Reveal";
import { WaveMask } from "@/components/flow/WaveMask";
import { ButtonLink, CtaRow, Eyebrow, SectionHead } from "@/components/layout/primitives";
import { english } from "@/content/english";
import { japanese } from "@/content/japanese";
import { CtaBand } from "../shared/CtaBand";
import { Icon } from "../shared/Icon";
import { Photo } from "../shared/Photo";
import { ProfCard } from "../shared/ProfCard";
import { Hl, imgSrc, Rich } from "../shared/text";
import { ConsultButton } from "./ConsultButton";

export function JapaneseHero() {
  const h = japanese.hero;
  return (
    <section className="sec hero" id="hero">
      <div className="wrap hero-grid">
        <div className="hero-t">
          <Eyebrow>{h.eyebrow}</Eyebrow>
          <Reveal as="h1">
            <Hl text={h.heading[0]} marks={["日本語"]} />
            <br />
            {h.heading[1]}
          </Reveal>
          <Reveal as="p" className="lead">
            {h.body}
          </Reveal>
          <Reveal as="ul" className="pills">
            {h.pills.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </Reveal>
          <CtaRow ctas={h.ctas} />
        </div>
        <Reveal className="hero-v">
          <WaveMask src={imgSrc(h.images[0])} alt={h.image_alt} priority />
          <ul className="facts">
            {h.items.map((i) => (
              <li key={i.label}>
                <small>{i.label}</small>
                <b>{i.value}</b>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function Challenges() {
  const c = japanese.challenges;
  return (
    <section className="sec tint" id="challenges">
      <div className="wrap">
        <div className="chal">
          <Reveal className="chal-img">
            <WaveMask src={imgSrc(c.images[0])} alt={c.image_alt} sizes="(min-width: 900px) 40vw, 100vw" />
          </Reveal>
          <div>
            <Reveal as="header" className="shead">
              <h2>
                <Hl text={c.heading} marks={["困って"]} />
              </h2>
            </Reveal>
            <ul className="chal-l">
              {c.items.map((t) => (
                <Reveal as="li" key={t}>
                  <Icon name="check" />
                  <p>{t}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Recommended() {
  const r = japanese.recommended;
  return (
    <section className="sec" id="recommended">
      <div className="wrap">
        <SectionHead sub={r.subheading} center>
          {r.heading}
        </SectionHead>
        <ul className="reco">
          {r.items.map((t) => (
            <Reveal as="li" key={t}>
              <Icon name="checkc" />
              {t}
            </Reveal>
          ))}
        </ul>
        <Reveal className="slimcta">
          <h3>{r.cta_heading}</h3>
          {r.ctas.map((x) => (
            <ButtonLink key={x.label} href={x.href}>
              {x.label}
            </ButtonLink>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Professors() {
  const pf = japanese.professors;
  return (
    <section className="sec tint" id="professors">
      <div className="wrap">
        <Reveal as="header" className="shead">
          <h2>{pf.heading}</h2>
        </Reveal>
        <div className="profs two">
          {pf.items.map((p) => (
            <ProfCard key={p.id} person={p} suffix={pf.labels.name_suffix} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function JapaneseServices() {
  const sv = japanese.services;
  const lb = sv.labels;
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <Reveal as="header" className="shead">
          <h2>{sv.heading}</h2>
        </Reveal>
        <div className="jgrid">
          {sv.items.map((c) => (
            <Reveal as="article" className="card jsv" key={c.id}>
              <div className="jsv-ph">
                <Photo src={c.image} alt={c.title} sizes="(min-width: 900px) 50vw, 100vw" />
                <span className="paytype">{c.pay_type}</span>
              </div>
              <div className="jsv-b">
                <ul className="tags">
                  {c.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <h3>{c.title}</h3>
                <p className="cd">{c.description}</p>
                <dl className="langs">
                  <dt>{lb.languages}</dt>
                  <dd>{c.features.language}</dd>
                </dl>
                <ul className="imp">
                  {c.features.important.map((x) => (
                    <li key={x}>
                      <Icon name="check" />
                      {x.trim()}
                    </li>
                  ))}
                </ul>
                <p className="vp">
                  {lb.duration_prefix} {c.duration} &nbsp;·&nbsp; {english.courses.labels.instructor_label} {c.instructor}
                </p>
                <div className="prices">
                  <small>{lb.price}</small>
                  <ul>
                    {c.pricing.map((p) => (
                      <li key={p.type}>
                        <span>{p.type}</span>
                        <b>{p.price}</b>
                      </li>
                    ))}
                  </ul>
                </div>
                <ConsultButton
                  label={lb.book_button}
                  course={{ title: c.title, duration: c.duration, prices: c.pricing.map((p) => p.price) }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function JapaneseCta() {
  const ct = japanese.cta;
  return (
    <CtaBand
      id="cta"
      heading={ct.heading}
      body={
        <p>
          <Rich text={ct.body} />
        </p>
      }
      ctas={[ct.ctas[0], { ...ct.ctas[1], style: "ghost" }]}
      note={ct.notes}
    />
  );
}
