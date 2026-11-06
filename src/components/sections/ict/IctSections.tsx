import Image from "next/image";
import type { ReactNode } from "react";
import { CountUp } from "@/components/flow/CountUp";
import { Reveal } from "@/components/flow/Reveal";
import { CtaRow, Eyebrow } from "@/components/layout/primitives";
import { ict } from "@/content/ict";
import { cn } from "@/lib/utils";
import { BrowserFrame } from "../shared/BrowserFrame";
import { CtaBand } from "../shared/CtaBand";
import { Icon } from "../shared/Icon";
import { Lines, Rich } from "../shared/text";

export function IctHero() {
  const h = ict.hero;
  return (
    <section className="sec phero" id="hero">
      <div className="wrap">
        <Eyebrow>{h.eyebrow}</Eyebrow>
        <Reveal as="h1">
          {h.heading[0]}
          <br />
          <em>{h.heading[1]}</em>
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

export function FlowBar() {
  return (
    <section className="sec flowbar" id="flowbar">
      <div className="wrap">
        <ol>
          {ict.flowbar.items.map((i) => (
            <Reveal as="li" key={i.num}>
              <a href={i.href}>
                <b>{i.num}</b>
                <span>
                  <strong>{i.label}</strong>
                  <small>{i.sub}</small>
                </span>
                <Icon name="down" />
              </a>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

type Block = {
  readonly id: string;
  readonly number: string;
  readonly eyebrow: string;
  readonly heading: ReadonlyArray<string>;
  readonly body: ReadonlyArray<string>;
  readonly items: ReadonlyArray<string>;
  readonly ctas: ReadonlyArray<{ readonly label: string; readonly href: string }>;
};

function IctBlock({ s, mock, flip }: { s: Block; mock: ReactNode; flip?: boolean }) {
  return (
    <section className={cn("sec ictsec", flip && "flip")} id={s.id}>
      <div className="wrap ictgrid">
        <div className="ict-t">
          <Reveal as="span" className="bignum">
            {s.number}
          </Reveal>
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <Reveal as="h2">
            <Lines lines={s.heading} />
          </Reveal>
          <Reveal>
            {s.body.map((b) => (
              <p className="lead" key={b}>
                {b}
              </p>
            ))}
          </Reveal>
          <Reveal as="ul" className="checks two">
            {s.items.map((i) => (
              <li key={i}>
                <Icon name="check" />
                {i}
              </li>
            ))}
          </Reveal>
          <CtaRow ctas={s.ctas} />
        </div>
        <div className="ict-v">{mock}</div>
      </div>
    </section>
  );
}

function NotionMock() {
  const t = ict.notion.illustration.texts;
  return (
    <BrowserFrame url={t.url_bar} bodyClassName="nm">
      <aside>
        <b />
        <b />
        <b />
        <b />
        <b />
      </aside>
      <div className="nm-m">
        <h4>{t.page_title}</h4>
        <table>
          <thead>
            <tr>
              {t.table_headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r, i) => (
              <tr key={r["案件名"]}>
                <td>{r["案件名"]}</td>
                <td>
                  <span className={`pill s${i}`}>{r["ステータス"]}</span>
                </td>
                <td>{r["担当"]}</td>
                <td>{r["期限"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="aibadge">
          <b>{t.ai_badge.title}</b>
          <span>{t.ai_badge.text}</span>
        </div>
      </div>
      <span className="wm" aria-hidden="true">
        {t.watermark}
      </span>
    </BrowserFrame>
  );
}

function AiMock() {
  const o = ict.aiInterview.illustration.overlay_texts;
  return (
    <Reveal className="aiv">
      <div className="aiv-card">
        <Image
          className="avatar"
          src="/images/ict/ai-interviewer-portrait.jpg"
          alt={ict.aiInterview.image_alt}
          width={524}
          height={730}
          sizes="(min-width: 900px) 480px, 90vw"
        />
        <div className="chip-f c1">
          <Icon name="chat" />
          <div>
            <b>{o.top_right_bubble.title}</b>
            <span>{o.top_right_bubble.text}</span>
          </div>
        </div>
        <div className="chip-f c2">
          <div className="ring" style={{ "--p": o.bottom_right_card.score } as React.CSSProperties}>
            <b>
              <CountUp end={Number(o.bottom_right_card.score)} />
            </b>
          </div>
          <div>
            <small>{o.bottom_right_card.label}</small>
            <b>{o.bottom_right_card.grade}</b>
          </div>
        </div>
        <div className="chip-f c3">
          <i className="live" />
          {o.bottom_left_pill.text}
        </div>
        <div className="chip-f c4" aria-hidden="true">
          <Icon name="chart" />
        </div>
        <div className="chip-f c5" aria-hidden="true">
          <Icon name="star" />
        </div>
      </div>
    </Reveal>
  );
}

const NODE_POS = [
  [250, 80],
  [320, 210],
  [130, 250],
  [60, 120],
] as const;

function GlobeMock() {
  const t = ict.offshore.illustration.texts;
  return (
    <Reveal className="gv">
      <span className="wm" aria-hidden="true">
        {t.watermark}
      </span>
      <svg viewBox="0 0 380 340" role="img" aria-label={t.nodes.join("・")}>
        <circle cx="190" cy="170" r="120" className="g" />
        <ellipse cx="190" cy="170" rx="120" ry="44" className="g" />
        <ellipse cx="190" cy="170" rx="50" ry="120" className="g" />
        {t.nodes.map((n, i) => {
          const [x, y] = NODE_POS[i];
          return (
            <g key={n}>
              <line x1="190" y1="170" x2={x} y2={y} className="ln" />
              <circle cx={x} cy={y} r="7" className="nd" />
              <text x={x} y={y - 14} textAnchor="middle">
                {n}
              </text>
            </g>
          );
        })}
        <circle cx="190" cy="170" r="22" className="hub" />
        <text x="190" y="175" textAnchor="middle" className="hubt">
          {t.hub}
        </text>
      </svg>
      <ul>
        {t.stats.map((s) => (
          <li key={s.label}>
            <small>{s.label}</small>
            <b>
              {s.value}
              <i>{s.suffix}</i>
            </b>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function NotionBlock() {
  return <IctBlock s={ict.notion} mock={<NotionMock />} />;
}
export function AiBlock() {
  return <IctBlock s={ict.aiInterview} mock={<AiMock />} flip />;
}
export function OffshoreBlock() {
  return <IctBlock s={ict.offshore} mock={<GlobeMock />} />;
}

export function IctCta() {
  const c = ict.cta;
  return (
    <CtaBand
      id="cta"
      heading={<Lines lines={c.heading} />}
      body={c.body.map((b) => (
        <p key={b}>
          <Rich text={b} />
        </p>
      ))}
      ctas={c.ctas}
    />
  );
}
