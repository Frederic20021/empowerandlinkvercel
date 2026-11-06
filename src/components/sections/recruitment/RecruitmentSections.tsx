import { ArrowRight, Check, Droplet, FileText, GraduationCap, Link2, MessageSquare, Users } from "lucide-react";
import { CountUp } from "@/components/flow/CountUp";
import { Reveal } from "@/components/flow/Reveal";
import { RiverSteps } from "@/components/flow/RiverSteps";
import { CtaRow, Eyebrow, SectionHead } from "@/components/layout/primitives";
import { CtaBand } from "@/components/sections/home/CtaBand";
import { Hl } from "@/components/sections/inline-text";
import {
  recruitmentCountries,
  recruitmentCta,
  recruitmentHero,
  recruitmentProblems,
  recruitmentProcess,
  recruitmentServices,
  recruitmentStats,
  recruitmentVisas,
} from "@/content/recruitment";

const PANEL_ICONS = [Users, FileText, GraduationCap, MessageSquare, Link2];

function Tags({ items }: { items: readonly string[] }) {
  return (
    <ul className="tags">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

function Checks({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <Reveal as="ul" className={className ? `checks ${className}` : "checks"}>
      {items.map((c) => (
        <li key={c}>
          <Check className="ic" strokeWidth={1.6} aria-hidden="true" />
          {c}
        </li>
      ))}
    </Reveal>
  );
}

export function RecruitmentHero() {
  const h = recruitmentHero;
  const pn = h.panel;
  return (
    <section className="sec hero" id="hero">
      <div className="wrap hero-grid">
        <div className="hero-t">
          <Eyebrow>{h.eyebrow}</Eyebrow>
          <Reveal as="h1">
            {h.heading[0]}
            <br />
            <em>{h.heading[1]}</em>
          </Reveal>
          <Reveal as="p" className="lead">
            {h.body}
          </Reveal>
          <CtaRow ctas={h.ctas} />
          <Checks items={h.checks} className="chips-c" />
        </div>
        <Reveal as="aside" className="panel">
          <h2>{pn.title}</h2>
          <ul>
            {pn.items.map((it, i) => {
              const Icon = PANEL_ICONS[i];
              return (
                <li key={it.text}>
                  <Icon className="ic" strokeWidth={1.6} aria-hidden="true" />
                  <span>{it.text}</span>
                </li>
              );
            })}
          </ul>
          <a className="panel-cta" href={pn.cta.href}>
            <b>{pn.cta.label}</b>
            <small>{pn.cta.sublabel}</small>
            <ArrowRight className="ic" strokeWidth={1.6} aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function RecruitmentProblems() {
  const p = recruitmentProblems;
  return (
    <section className="sec tint" id="problems">
      <div className="wrap">
        <div className="split-head">
          <SectionHead eyebrow={p.eyebrow}>
            <Hl text={p.heading} sub="こんなお悩み" />
          </SectionHead>
          <Reveal>
            <p className="lead">{p.body}</p>
            <CtaRow ctas={p.ctas} />
          </Reveal>
        </div>
        <ul className="pebbles">
          {p.items.map((it) => (
            <Reveal as="li" className="pebble" key={it.text}>
              <Droplet className="ic" strokeWidth={1.6} aria-hidden="true" />
              <p>{it.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function RecruitmentServices() {
  const s = recruitmentServices;
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <SectionHead eyebrow={s.eyebrow} sub={s.subheading} center>
          <Hl text={s.heading} sub="定着まで" />
        </SectionHead>
        <div className="grid3">
          {s.items.map((it) => (
            <Reveal as="article" className="card" key={it.title}>
              <span className="letter">{it.title_letter}</span>
              <h3>{it.title}</h3>
              <p>{it.description}</p>
              <Tags items={it.tags} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RecruitmentStats() {
  return (
    <section className="sec stats" id="stats">
      <div className="wrap">
        <ul className="stat-row">
          {recruitmentStats.items.map((it) => (
            <Reveal as="li" className="stat" key={it.label}>
              <div className="stat-n">
                <CountUp end={Number(it.num)} />
                <sup>{it.unit}</sup>
              </div>
              <p>{it.label}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function RecruitmentVisas() {
  const v = recruitmentVisas;
  return (
    <section className="sec tint" id="visas">
      <div className="wrap">
        <SectionHead eyebrow={v.eyebrow} sub={v.subheading} center>
          <Hl text={v.heading} sub="採用支援" />
        </SectionHead>
        <div className="grid2">
          {v.items.map((it) => (
            <Reveal as="article" className="card visa" key={it.title}>
              <p className="kick">{it.subtitle}</p>
              <h3>{it.title}</h3>
              <p>{it.description}</p>
              <ul className="checks">
                {it.checks.map((c) => (
                  <li key={c}>
                    <Check className="ic" strokeWidth={1.6} aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RecruitmentProcess() {
  const p = recruitmentProcess;
  const [before, after] = p.body.split("成功報酬型");
  return (
    <section className="sec" id="process">
      <div className="wrap">
        <SectionHead eyebrow={p.eyebrow} sub={p.subheading} center>
          <Hl text={p.heading} sub="6つのステップ" />
        </SectionHead>
        <RiverSteps
          items={p.items.map((it) => ({
            node: it.num,
            children: (
              <>
                <h3>{it.title}</h3>
                <p>{it.desc}</p>
              </>
            ),
          }))}
        />
        <Reveal as="p" className="note">
          {before}
          <strong>成功報酬型</strong>
          {after}
        </Reveal>
      </div>
    </section>
  );
}

export function RecruitmentCountries() {
  const c = recruitmentCountries;
  return (
    <section className="sec tint" id="countries">
      <div className="wrap">
        <SectionHead eyebrow={c.eyebrow} sub={c.subheading} center>
          <Hl text={c.heading} sub="ミャンマーを中心に" />
        </SectionHead>
        <div className="grid2">
          {c.items.map((it) => (
            <Reveal as="article" className="card country" key={it.name}>
              <h3>{it.name}</h3>
              <p className="meta">{it.meta}</p>
              <ol className="pts">
                {it.points.map((pt) => (
                  <li key={pt.num}>
                    <b>{pt.num}</b>
                    <div>
                      <h4>{pt.title}</h4>
                      <p>{pt.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RecruitmentCta() {
  const c = recruitmentCta;
  return <CtaBand id="cta-new" eyebrow={c.eyebrow} heading={c.heading} body={c.body} ctas={c.ctas} note={c.notes} />;
}
