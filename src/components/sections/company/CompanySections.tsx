import { Reveal } from "@/components/flow/Reveal";
import { WaveMask } from "@/components/flow/WaveMask";
import { Eyebrow, SectionHead } from "@/components/layout/primitives";
import { Rich } from "@/components/sections/inline-text";
import { CtaBand } from "@/components/sections/home/CtaBand";
import { companyAccess, companyCeo, companyCta, companyHero, companyInfo, companyVideo } from "@/content/company";
import { VideoFacade } from "./VideoFacade";

const QUOTE = "資源は有限でも繋がりは無限です。";

export function CompanyHero() {
  return (
    <section className="sec phero" id="hero">
      <div className="wrap">
        <Eyebrow>{companyHero.eyebrow}</Eyebrow>
        <Reveal as="h1">
          <Rich text={companyHero.heading[0]} />
          <br />
          {companyHero.heading[1]}
        </Reveal>
      </div>
    </section>
  );
}

export function CompanyVideo() {
  const v = companyVideo;
  return (
    <section className="sec" id="video">
      <div className="wrap">
        <SectionHead eyebrow={v.eyebrow} sub={v.subheading} center>
          {v.heading}
        </SectionHead>
        <Reveal className="frame">
          <div className="frame-bar">
            <i />
            <i />
            <i />
          </div>
          <div className="ratio">
            <VideoFacade id={v.video.id} title={v.video.title} poster="/images/hero/hero1.jpg" posterAlt="紹介動画のサムネイル（富士山と五重塔）" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function CompanyCeo() {
  const c = companyCeo;
  return (
    <section className="sec tint" id="ceo">
      <div className="wrap">
        <div className="ceo">
          <Reveal className="ceo-side">
            <WaveMask src="/images/hero/CEO.jpg" alt={c.person.photo_alt} sizes="(min-width: 900px) 40vw, 100vw" />
            <p className="ceo-name">
              <span>{c.person.role}</span>
              <b>{c.person.name}</b>
            </p>
          </Reveal>
          <div className="ceo-body">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <Reveal as="h2">{c.heading}</Reveal>
            <Reveal className="prose">
              {c.body.map((t) => {
                const i = t.indexOf(QUOTE);
                return (
                  <p key={t}>
                    {i < 0 ? (
                      t
                    ) : (
                      <>
                        {t.slice(0, i)}
                        <mark className="quote">{QUOTE}</mark>
                        {t.slice(i + QUOTE.length)}
                      </>
                    )}
                  </p>
                );
              })}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CompanyInfo() {
  const i = companyInfo;
  return (
    <section className="sec" id="info">
      <div className="wrap">
        <SectionHead eyebrow={i.eyebrow} sub={i.subheading}>
          {i.heading}
        </SectionHead>
        <dl className="dl">
          {i.items.map((it) => (
            <Reveal className="dl-row" key={it.label}>
              <dt>{it.label}</dt>
              <dd>
                <Rich text={it.value} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function CompanyAccess() {
  const a = companyAccess;
  return (
    <section className="sec tint" id="access">
      <div className="wrap">
        <SectionHead eyebrow={a.eyebrow} sub={a.subheading}>
          {a.heading}
        </SectionHead>
        <div className="access">
          <Reveal className="frame">
            <div className="ratio map">
              <iframe src={a.map.embed_url} title={a.subheading} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </Reveal>
          <div className="acc-list">
            {a.items.map((it) => (
              <Reveal className="acc" key={it.tag}>
                <span className="chip">{it.tag}</span>
                <p>
                  <Rich text={it.body} />
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CompanyCta() {
  return <CtaBand id="cta" eyebrow={companyCta.eyebrow} heading={companyCta.heading} body={companyCta.body} ctas={companyCta.ctas} />;
}

