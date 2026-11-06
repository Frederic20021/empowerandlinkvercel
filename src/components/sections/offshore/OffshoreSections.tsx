import { Reveal } from "@/components/flow/Reveal";
import { RiverSteps } from "@/components/flow/RiverSteps";
import { WaveMask } from "@/components/flow/WaveMask";
import { ButtonLink, SectionHead } from "@/components/layout/primitives";
import { offshore } from "@/content/offshore";
import { Icon, type IconName } from "../shared/Icon";
import { Photo } from "../shared/Photo";
import { Hl, Lines, Rich } from "../shared/text";
import { OffshoreContactForm } from "./OffshoreContactForm";

const O = offshore;

export function OffshoreHero() {
  const h = O.pitch1Hero;
  return (
    <section className="sec hero ohero" id="pitch-1-hero">
      <span className="decor" aria-hidden="true">
        {h.decor_text}
      </span>
      <div className="wrap hero-grid">
        <div className="hero-t">
          <Reveal as="h1">
            <span className="ul">{h.heading[0]}</span>
            <br />
            <span className="ul">
              <Hl text={h.heading[1]} marks={[{ text: "企業", as: "u" }, { text: "成長", as: "u" }]} />
            </span>
            <br />
            <span className="ul">
              <Hl text={h.heading[2]} marks={[{ text: "。", as: "b", cls: "blue" }]} />
            </span>
          </Reveal>
          <Reveal as="p" className="lead">
            {h.body_joined}
          </Reveal>
        </div>
        <Reveal className="hero-v">
          <WaveMask src="/images/services/service4.jpg" alt="ヘッドセットで働くエンジニア" priority />
        </Reveal>
      </div>
      <div className="wrap o2">
        <div className="o2-t">
          <Reveal as="h2">
            {h.heading2[0]}
            <br />
            {h.heading2[1]}
          </Reveal>
          <Reveal as="p" className="lead">
            <Hl
              text={h.body2}
              marks={[
                { text: "エンパワー＆リンク", cls: "blue" },
                { text: "高い技術力", as: "strong" },
                { text: "低コスト", as: "strong" },
                { text: "最適なチームを編成", as: "strong" },
              ]}
            />
          </Reveal>
        </div>
        <Reveal className="o2-ph">
          {[
            ["p1", "/images/services/service3.jpg", "ミーティング"],
            ["p2", "/images/recruitment/gijinkoku.jpg", "オフィスでの作業"],
            ["p3", "/images/services/service1.jpg", "打ち合わせ"],
            ["p4", "/images/services/service2.jpg", "握手"],
          ].map(([c, src, alt]) => (
            <div className={`para ${c}`} key={c}>
              <Photo src={src} alt={alt} sizes="(min-width: 900px) 20vw, 45vw" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

const PAIN_ICONS: IconName[] = ["chat", "chart", "cloud"];
const SOL_PHOTOS = ["/images/services/service4.jpg", "/images/recruitment/Hero.jpg", "/images/recruitment/mission.jpg"];
const SOL_MARKS = [
  ["日本語対応", "いつでも問い合わせ可", "資料、開発工程"],
  ["上位約6%のみを", "技術・品質トレーニング", "長期稼働できる"],
  ["週次", "進捗をリアルタイム共有"],
];

export function Pains() {
  const p = O.pitch2Pains;
  const [pre, post] = p.heading[1].split("悩み");
  return (
    <section className="sec tint" id="pitch-2-pains">
      <div className="wrap">
        <Reveal as="p" className="aboutbtn">
          <ButtonLink href={p.before_html.href} variant="ghost">
            {p.before_html.label}
          </ButtonLink>
        </Reveal>
        <Reveal as="header" className="shead center">
          <p className="eyebrow">
            <i />
            {p.eyebrow}
          </p>
          <h2>
            {p.heading[0]}
            <br />
            <span className="sm">{pre}</span>
            <span className="hl big">悩み</span>
            {post}
          </h2>
        </Reveal>
        <div className="grid3">
          {p.items.map((x, i) => (
            <Reveal as="article" className="card pain" key={x.body}>
              <Icon name={PAIN_ICONS[i]} />
              <h3>
                <Lines lines={x.title} />
              </h3>
              <p>{x.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal as="p" className="pill-r">
          <Icon name="down" />
          {p.pill}
        </Reveal>
        <div className="sols">
          {p.solutions.map((so, i) => (
            <Reveal as="article" className="sol" key={so.title}>
              <div className="sol-ph">
                <Photo src={SOL_PHOTOS[i]} alt={so.title} sizes="(min-width: 800px) 40vw, 100vw" />
              </div>
              <div className="sol-b">
                <p className="kick">{so.kicker}</p>
                <h3>{so.title}</h3>
                <ul>
                  {so.bullets.map((b) => (
                    <li key={b}>
                      <Icon name="check" />
                      <Hl text={b} marks={SOL_MARKS[i].map((text) => ({ text, as: "mark" as const }))} />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal as="p" className="foot-p">
          {p.footer}
        </Reveal>
      </div>
    </section>
  );
}

const REASON_ICONS: IconName[] = ["chat", "cap", "chart", "code", "globe", "handshake"];

export function ReasonsSection() {
  const p = O.pitch3Reasons;
  return (
    <section className="sec bluewave" id="pitch-3-reasons">
      <div className="wrap">
        <Reveal as="p" className="aboutbtn">
          <ButtonLink href={p.before_html.href} variant="ghost">
            {p.before_html.label}
          </ButtonLink>
        </Reveal>
        <Reveal as="header" className="shead center">
          <p className="eyebrow">
            <i />
            {p.eyebrow}
          </p>
          <h2>{p.heading}</h2>
          <p className="lead">
            <Lines lines={p.subheading} />
          </p>
        </Reveal>
        <div className="grid3">
          {p.items.map((x, i) => (
            <Reveal as="article" className="card rn" key={x.point}>
              <span className="rn-n">{x.point}</span>
              <Icon name={REASON_ICONS[i]} />
              <h3>{x.title}</h3>
              <p>{x.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const SERVICE_ICONS: IconName[] = ["monitor", "cloud", "robot", "layers", "server", "users"];

export function ServiceSection() {
  const p = O.pitch4Service;
  return (
    <section className="sec" id="pitch-4-service">
      <div className="wrap">
        <SectionHead eyebrow={p.eyebrow} sub={p.body} center>
          <Lines lines={p.heading} />
        </SectionHead>
        <div className="grid3">
          {p.items.map((x, i) => (
            <Reveal as="article" className="card svx" key={x.num}>
              <span className="svx-ic">
                <Icon name={SERVICE_ICONS[i]} />
                <b>{x.num}</b>
              </span>
              <h3>
                <Lines lines={x.title} />
              </h3>
              <p>{x.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const CASE_PHOTOS = ["/images/recruitment/gijinkoku.jpg", "/images/services/service4.jpg", "/images/recruitment/mission.jpg"];

export function CaseSection() {
  const p = O.pitch5Case;
  return (
    <section className="sec tint" id="pitch-5-case">
      <div className="wrap">
        <SectionHead eyebrow={p.eyebrow} center>
          {p.heading}
        </SectionHead>
        <div className="grid3">
          {p.items.map((x, i) => (
            <Reveal as="article" className="card case" key={x.industry}>
              <div className="case-ph">
                <Photo src={CASE_PHOTOS[i]} alt={x.industry} sizes="(min-width: 900px) 33vw, 100vw" />
              </div>
              <h3>{x.industry}</h3>
              <p>{x.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FlowSection() {
  const p = O.pitch6Flow;
  return (
    <section className="sec" id="pitch-6-flow">
      <div className="wrap">
        <SectionHead eyebrow={p.eyebrow} sub={p.subheading} center>
          {p.heading}
        </SectionHead>
        <RiverSteps
          items={p.items.map((it) => ({
            node: it.step,
            children: (
              <>
                <p className="slabel">{it.label}</p>
                <h3>
                  <Lines lines={it.title} />
                </h3>
                <p>{it.body}</p>
              </>
            ),
          }))}
        />
      </div>
    </section>
  );
}

export function PricePlan() {
  const p = O.pricePlan;
  return (
    <section className="sec tint" id="price-plan">
      <div className="wrap">
        <SectionHead eyebrow={p.eyebrow} sub={p.body} center>
          {p.heading}
        </SectionHead>
        <Reveal as="p" className="rec-t">
          {p.subheading}
        </Reveal>
        <div className="grid3 pgrid">
          {p.items.map((x) => (
            <Reveal as="article" className="card plancard" key={x.title}>
              <Icon name="gear" />
              <h3>
                <Rich text={x.title} />
              </h3>
              <p className="amt">{x.price}</p>
              <ul className="checks">
                {x.features.map((f) => (
                  <li key={f}>
                    <Icon name="check" />
                    {f}
                  </li>
                ))}
              </ul>
              <span className="btn btn-ghost" role="note">
                <span>{p.labels.card_button}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OffshoreContact() {
  const c = O.contact;
  return (
    <section className="sec" id="contact">
      <div className="wrap">
        <div className="formbox">
          <Reveal className="cintro">
            {c.body.map((b) => (
              <p key={b}>{b}</p>
            ))}
          </Reveal>
          <OffshoreContactForm />
        </div>
      </div>
    </section>
  );
}

