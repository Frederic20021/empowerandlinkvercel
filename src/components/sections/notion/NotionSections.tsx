import { Reveal } from "@/components/flow/Reveal";
import { RiverSteps } from "@/components/flow/RiverSteps";
import { CtaRow, Eyebrow, SectionHead } from "@/components/layout/primitives";
import { notion } from "@/content/notion";
import { cn } from "@/lib/utils";
import { CtaBand } from "../shared/CtaBand";
import { Faq } from "../shared/Faq";
import { Icon, type IconName } from "../shared/Icon";
import { Hl, Lines, Rich, stripEmoji } from "../shared/text";

function Table({ headers, rows }: { headers: ReadonlyArray<string>; rows: ReadonlyArray<ReadonlyArray<string>> }) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            {headers.map((h) => (
              <th scope="col" key={h}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function NotionHero() {
  const h = notion.hero;
  return (
    <section className="sec phero" id="hero">
      <div className="wrap">
        <Eyebrow>{h.eyebrow}</Eyebrow>
        <Reveal as="h1">
          {h.heading[0]}
          <br />
          <em>{h.heading[1]}</em>
        </Reveal>
        <Reveal as="p" className="lead">
          {h.body[0]}
          <br />
          {h.body[1]}
        </Reveal>
        <CtaRow ctas={h.ctas} />
        <Reveal as="p" className="note">
          {h.notes}
        </Reveal>
      </div>
    </section>
  );
}

const PROBLEM_ICONS: IconName[] = ["folder", "eye", "gear"];

export function Problems() {
  const p = notion.problems;
  return (
    <section className="sec tint" id="problems">
      <div className="wrap">
        <SectionHead eyebrow={p.eyebrow} sub={p.subheading} center>
          <Hl text={p.heading} marks={["課題"]} />
        </SectionHead>
        <div className="grid3">
          {p.items.map((x, i) => (
            <Reveal as="article" className="card" key={x.title}>
              <Icon name={PROBLEM_ICONS[i]} />
              <h3>
                <Rich text={x.title} />
              </h3>
              <p>{x.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const REASON_ICONS: IconName[] = ["folder", "eye", "target", "robot", "book", "sprout"];

export function Reasons() {
  const r = notion.reasons;
  return (
    <section className="sec" id="reasons">
      <div className="wrap">
        <SectionHead eyebrow={r.eyebrow} sub={r.subheading} center>
          {r.heading[0]}
          <br />
          <Hl text={r.heading[1]} marks={["選ばれる理由"]} />
        </SectionHead>
        <div className="grid3">
          {r.items.map((x, i) => (
            <Reveal as="article" className="card rn" key={x.num}>
              <span className="rn-n">{x.num}</span>
              <Icon name={REASON_ICONS[i]} />
              <h3>{x.title}</h3>
              <p>{x.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Plan() {
  const p = notion.plan;
  return (
    <section className="sec tint" id="plan">
      <div className="wrap">
        <div className="plan">
          <Reveal className="plan-p">
            <p className="eyebrow">
              <i />
              {p.eyebrow}
            </p>
            <h2>{p.heading}</h2>
            <div className="price">
              <span className="cur">{p.price.currency}</span>
              <span className="amt">{p.price.amount}</span>
              <span className="unit">{p.price.unit}</span>
            </div>
            <p>
              <Rich text={p.body.replace("基本料金内", "<strong>基本料金内</strong>")} />
            </p>
          </Reveal>
          <Reveal className="card plan-l">
            <h3>{stripEmoji(p.list_title)}</h3>
            <ul className="checks">
              {p.items.map((i) => (
                <li key={i}>
                  <Icon name="check" />
                  {i}
                </li>
              ))}
            </ul>
            <p className="note">{p.notes}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const FACTOR_ICONS: IconName[] = ["users", "layers", "box", "plug", "robot", "dumbbell"];

export function Factors() {
  const f = notion.factors;
  return (
    <section className="sec" id="factors">
      <div className="wrap">
        <SectionHead eyebrow={f.eyebrow} sub={f.body}>
          {f.heading}
        </SectionHead>
        <div className="grid2">
          {f.items.map((x, i) => (
            <Reveal as="article" className="card factor" key={x.point}>
              <div className="fh">
                <span className="pt">{x.point}</span>
                <Icon name={FACTOR_ICONS[i]} />
                <h3>{x.title}</h3>
              </div>
              <p className="ana">{stripEmoji(x.analogy)}</p>
              <p>{x.desc}</p>
              <Table headers={x.table_headers} rows={x.table_rows} />
              {"footnote" in x ? <p className="foot">{x.footnote}</p> : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Industry() {
  const ind = notion.industry;
  return (
    <section className="sec tint" id="industry">
      <div className="wrap">
        <SectionHead eyebrow={ind.eyebrow} sub={ind.body}>
          <Lines lines={ind.heading} />
        </SectionHead>
        <Table
          headers={ind.table.headers}
          rows={ind.table.rows.map((r) => [r.industry, r.dbCount, r.price, r.themes])}
        />
        <div className="grid3 exg">
          {ind.items.map((e) => (
            <Reveal as="article" className="card ex" key={e.title}>
              <h3>{e.title}</h3>
              <p className="pain">{e.pain}</p>
              <p className="dbn">{e.dbNote}</p>
              <ul className="exr">
                {e.rows.map((r) => (
                  <li key={r.label}>
                    <span>{r.label}</span>
                    <b>{r.val}</b>
                  </li>
                ))}
              </ul>
              <p className="total">
                <span>{ind.labels.total}</span>
                <b>{e.total}</b>
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contract() {
  const c = notion.contract;
  return (
    <section className="sec" id="contract">
      <div className="wrap">
        <SectionHead eyebrow={c.eyebrow}>
          <Lines lines={c.heading} />
        </SectionHead>
        <div className="grid3">
          {c.items.map((t) => (
            <Reveal as="article" className={cn("card term", t.recommended && "is-rec")} key={t.term}>
              {t.recommended ? <span className="rec">{c.labels.recommended_badge}</span> : null}
              <h3>{t.term}</h3>
              <p className="dbn">{t.dbNote}</p>
              <p className="add">
                <b>{t.add}</b>
                <small>{t.addSub}</small>
              </p>
              <p>{t.reason}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process() {
  const p = notion.process;
  return (
    <section className="sec tint" id="process">
      <div className="wrap">
        <SectionHead eyebrow={p.eyebrow} center>
          {p.heading}
        </SectionHead>
        <RiverSteps
          items={p.items.map((it) => ({
            node: it.label.replace(/\D/g, ""),
            children: (
              <>
                <p className="slabel">{it.label}</p>
                <h3>{it.title}</h3>
                <p>{it.desc}</p>
              </>
            ),
          }))}
        />
      </div>
    </section>
  );
}

export function NotionFaq() {
  const f = notion.faq;
  return (
    <section className="sec" id="faq">
      <div className="wrap">
        <div className="narrow">
          <SectionHead eyebrow={f.eyebrow}>{f.heading}</SectionHead>
          <Faq items={f.items} />
        </div>
      </div>
    </section>
  );
}

export function NotionCta() {
  const c = notion.cta;
  return (
    <CtaBand
      id="cta"
      eyebrow={c.eyebrow}
      heading={<Lines lines={c.heading} />}
      body={
        <p>
          <Rich text={c.body.replace("無料・60分", "<strong>無料・60分</strong>")} />
        </p>
      }
      middle={
        <Reveal as="p" className="person">
          <b>{c.contact_person.name}</b>
          <span>{c.contact_person.role}</span>
        </Reveal>
      }
      ctas={c.ctas}
    />
  );
}
