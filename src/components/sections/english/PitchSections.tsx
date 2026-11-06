import { CountUp } from "@/components/flow/CountUp";
import { Reveal } from "@/components/flow/Reveal";
import { WaveMask } from "@/components/flow/WaveMask";
import { ButtonLink, Eyebrow, SectionHead } from "@/components/layout/primitives";
import { english } from "@/content/english";
import { Faq } from "../shared/Faq";
import { Icon, type IconName } from "../shared/Icon";
import { Photo } from "../shared/Photo";
import { VoiceSlider } from "./VoiceSlider";
import { Hl, Lines, Rich, telHref } from "../shared/text";

/** Laurel wreath drawn behind each hero badge (port of the mockup's laurel()). */
function Laurel() {
  const leaves: { x: string; y: string; rot: string }[] = [];
  for (const side of [-1, 1]) {
    for (let k = 0; k < 7; k++) {
      const a = ((side === -1 ? 200 + k * 20 : 340 - k * 20) * Math.PI) / 180;
      const x = 50 + 40 * Math.cos(a);
      const y = 52 + 40 * Math.sin(a);
      const rot = (a * 180) / Math.PI + (side === -1 ? 90 : -90);
      leaves.push({ x: x.toFixed(1), y: y.toFixed(1), rot: rot.toFixed(0) });
    }
  }
  return (
    <svg className="laurel" viewBox="0 0 100 100" aria-hidden="true">
      {leaves.map((l, i) => (
        <ellipse key={i} cx={l.x} cy={l.y} rx="3.2" ry="6.5" transform={`rotate(${l.rot} ${l.x} ${l.y})`} />
      ))}
    </svg>
  );
}

function splitNum(v: string): [string | null, string] {
  const m = /^(\d+)(.*)$/.exec(v);
  return m ? [m[1], m[2]] : [null, v];
}

export function EnglishHero() {
  const h = english.pitchHero;
  return (
    <section className="sec hero ehero" id="pitch-hero">
      <div className="wrap hero-grid">
        <div className="hero-t">
          <Reveal as="p" className="script">
            {h.eyebrow}
          </Reveal>
          <Reveal as="p" className="tagline">
            <Lines lines={h.tagline} />
          </Reveal>
          <Reveal as="p" className="bubble">
            {h.bubble}
          </Reveal>
          <Reveal as="h1">
            <Lines lines={h.heading} />
          </Reveal>
          <ul className="badges">
            {h.badges.map((b) => {
              const [n, rest] = splitNum(b.value);
              const caption = "caption" in b ? b.caption : undefined;
              return (
                <Reveal as="li" className="badge" key={b.label}>
                  <Laurel />
                  <div>
                    {caption ? <span className="cap">{caption}</span> : null}
                    <small>{b.label}</small>
                    <b>
                      {n ? <CountUp end={Number(n)} className="num" /> : b.value}
                      {rest}
                    </b>
                    <i>{b.suffix}</i>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
        <Reveal className="hero-v">
          <WaveMask src="/images/hero/english-hero1.jpg" alt="握手を交わすビジネスパーソン" priority />
        </Reveal>
      </div>
      <div className="wrap ehero-b">
        <Reveal as="h2" className="headline">
          <Lines lines={h.headline} />
        </Reveal>
        <Reveal as="p" className="lead">
          <Hl text={h.body} marks={["実務経験・留学経験のある講師と", "マンツーマンで学べる英語学習サービスです！"]} />
        </Reveal>
      </div>
    </section>
  );
}

export function PitchCta() {
  const c = english.pitchCta;
  return (
    <section className="sec slim" id="pitch-cta">
      <div className="wrap">
        <Reveal className="slimcta">
          <h2>{c.heading}</h2>
          {c.ctas.map((x) => (
            <ButtonLink key={x.label} href={x.href}>
              {x.label}
            </ButtonLink>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Worries() {
  const w = english.pitchWorries;
  // "こんな悩みを抱える" / "ビジネス英語を学びたい人のためのプログラムです"
  const cut = w.heading.indexOf("抱える") + "抱える".length;
  const first = w.heading.slice(0, cut);
  const second = w.heading.slice(cut);
  const [pre, after] = first.split("悩み");
  return (
    <section className="sec tint" id="pitch-worries">
      <div className="wrap">
        <Reveal as="header" className="shead center">
          <h2>
            <span className="sm">{pre}</span>
            <span className="hl big">悩み</span>
            {after}
            <br />
            <Hl text={second} marks={["ビジネス英語を学びたい人"]} cls="blue" />
          </h2>
        </Reveal>
        <div className="worry">
          <ul className="wcards">
            {w.items.map((t) => (
              <Reveal as="li" className="wcard" key={t}>
                <Icon name="checkc" />
                <p>{t}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="wfig">
            <WaveMask src="/images/japanese/struggle.jpg" alt="悩む学習者" sizes="(min-width: 900px) 30vw, 80vw" />
            <p className="thought">{w.thought_bubble}</p>
          </Reveal>
        </div>
        <Reveal as="p" className="trans">
          <span>{w.transition.arrow_label}</span>
          <Icon name="down" />
        </Reveal>
      </div>
    </section>
  );
}

const FEAT_ICONS: IconName[] = ["users", "phone2", "trend", "stopwatch", "cal"];

export function Solution() {
  const s = english.pitchSolution;
  return (
    <section className="sec" id="pitch-solution">
      <div className="wrap">
        <Reveal as="header" className="shead center">
          <p className="eyebrow center">
            <i />
            {s.eyebrow}
          </p>
          <div className="bubs">
            <span>{s.bubbles[0]}</span>
            <span>{s.bubbles[1]}</span>
          </div>
          <h2>{s.heading}</h2>
        </Reveal>
        <ul className="feats">
          {s.features.map((f, i) => (
            <Reveal as="li" className="feat" key={i}>
              <span className="fc">
                <Icon name={FEAT_ICONS[i]} />
              </span>
              <p>
                <Lines lines={f.lines} />
              </p>
            </Reveal>
          ))}
        </ul>
        <div className="outs-w">
          <ul className="outs">
            {s.outcomes.map((o) => (
              <Reveal as="li" className="out" key={o}>
                <Icon name="check" />
                <p>{o}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="outfig">
            <WaveMask src="/images/japanese/study.jpg" alt="学習する男性のイラスト" sizes="340px" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  const b = english.pitchCtaBand;
  const [lead, tail] = b.heading;
  // “パッと英語が出てくる実力” + をあなたのものに
  const cut = tail.indexOf("”") + 1;
  return (
    <section className="sec slim" id="pitch-cta-band">
      <div className="wrap">
        <Reveal className="cream">
          <p className="b1">{lead}</p>
          <p className="b2">
            <span className="lab">{tail.slice(0, cut)}</span>
            {tail.slice(cut)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const ORBIT_ICONS: IconName[] = ["checkc", "cap", "doc", "building"];

export function Reason() {
  const r = english.pitchReason;
  return (
    <section className="sec tint" id="pitch-reason">
      <div className="wrap">
        <div className="reason">
          <div className="reason-t">
            <Reveal as="h2">
              <Lines lines={r.heading} />
            </Reveal>
            <Reveal as="p" className="lead">
              <Hl text={r.body} marks={["実務経験・留学経験のある講師によるマンツーマン指導", "短期間でも"]} />
            </Reveal>
          </div>
          <Reveal className="orbit">
            <svg viewBox="0 0 400 400" aria-hidden="true">
              <ellipse cx="200" cy="200" rx="170" ry="120" />
              <ellipse cx="200" cy="200" rx="130" ry="170" />
            </svg>
            <div className="orbit-c">
              <Icon name="monitor" />
              <b>{r.diagram.center_label}</b>
            </div>
            {r.diagram.bubbles.map((b, i) => (
              <div className={`bub b${i}`} key={i}>
                <Icon name={ORBIT_ICONS[i]} />
                <p>
                  <Lines lines={b.lines} />
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const POINT_MARKS = ["無料体験", "マンツーマン", "実力派講師がサポート", "日本語での質問"];
const POINT_PHOTOS = [1, 2, 3, 4].map((n) => `/images/services/service${n}.jpg`);

export function Reasons4() {
  const rs = english.pitchReasons4;
  return (
    <section className="sec" id="pitch-reasons-4">
      <div className="wrap">
        <div className="grid4">
          {rs.items.map((it, i) => {
            const bang = it.title.indexOf("！") + 1;
            return (
              <Reveal as="article" className="card pt" key={it.point}>
                <div className="pt-ph">
                  <Photo src={POINT_PHOTOS[i]} alt={it.title} sizes="(min-width: 900px) 25vw, 100vw" />
                  <span className="pt-n">
                    <small>POINT</small>
                    {it.point}
                  </span>
                </div>
                <h3>
                  {i === 0 ? (
                    <>
                      <Hl text={it.title.slice(0, bang)} marks={[POINT_MARKS[i]]} />
                      <br />
                      <Rich text={it.title.slice(bang)} />
                    </>
                  ) : (
                    <Hl text={it.title} marks={[POINT_MARKS[i]]} />
                  )}
                </h3>
                <p>{it.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function EnglishContact() {
  const ct = english.contact;
  const [web, tel] = ct.items;
  return (
    <section className="sec econtact" id="contact">
      <div className="wrap">
        <SectionHead eyebrow={ct.eyebrow} center>
          {ct.heading}
        </SectionHead>
        <div className="grid2">
          <Reveal as="article" className="card ccard">
            <span className="cc-ic">
              <Icon name="monitor" />
            </span>
            <h3>{web.heading}</h3>
            <ButtonLink href={web.cta.href}>{web.cta.label.replace(" >", "")}</ButtonLink>
          </Reveal>
          <Reveal as="article" className="card ccard">
            <span className="cc-ic">
              <Icon name="phone" />
            </span>
            <h3>{tel.heading}</h3>
            <p className="tel">
              <small>{tel.phone_label}</small>
              <a href={telHref(tel.phone)}>{tel.phone}</a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function VoiceSection() {
  const vo = english.voice;
  return (
    <section className="sec tint" id="voice">
      <div className="wrap">
        <Reveal as="header" className="shead">
          <Eyebrow>{vo.eyebrow}</Eyebrow>
          <h2>{vo.heading}</h2>
        </Reveal>
        <VoiceSlider />
      </div>
    </section>
  );
}

export function FaqSection() {
  const fq = english.faq;
  return (
    <section className="sec" id="faq">
      <div className="wrap">
        <div className="narrow">
          <Reveal as="header" className="shead">
            <h2>{fq.heading}</h2>
          </Reveal>
          <Faq items={fq.items} />
        </div>
      </div>
    </section>
  );
}
