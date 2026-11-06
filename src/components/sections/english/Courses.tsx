"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/flow/Reveal";
import { english } from "@/content/english";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import { Photo } from "../shared/Photo";
import { RequestFlow } from "../shared/RequestFlow";
import { Rich } from "../shared/text";
import { ENGLISH_FLOW } from "./flow-config";

const ALL = "all";

/** オンライン指導コース一覧: tag filter, Stripe links, and the inline trial-request flow. */
export function Courses() {
  const co = english.courses;
  const lb = co.labels;
  const tags = Array.from(new Set(co.items.flatMap((c) => c.tags)));
  const [filter, setFilter] = useState<string>(ALL);
  const [booking, setBooking] = useState<number | null>(null);

  // "詳細を見る" links in the instructor dialog point at #course-N: make sure that card is visible.
  useEffect(() => {
    const onHash = () => {
      if (!/^#course-\d+$/.test(location.hash)) return;
      setFilter(ALL);
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "center" }));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <section className="sec" id="courses">
      <div className="wrap">
        <Reveal as="header" className="shead">
          <h2>{co.heading}</h2>
        </Reveal>
        <Reveal className="tabs" role="group" aria-label="コースの絞り込み">
          {[ALL, ...tags].map((t) => (
            <button
              key={t}
              type="button"
              className={cn("tab", filter === t && "on")}
              aria-pressed={filter === t}
              onClick={() => setFilter(t)}
            >
              {t === ALL ? "すべて" : t}
            </button>
          ))}
        </Reveal>
        <div className="cgrid">
          {co.items.map((c) => {
            const show = filter === ALL || (c.tags as readonly string[]).includes(filter);
            const original = "originalPrice" in c.pricing ? c.pricing.originalPrice : undefined;
            const open = booking === c.id;
            return (
              <Reveal as="article" className="course card" id={`course-${c.id}`} key={c.id} hidden={!show}>
                <div className="course-ph">
                  <Photo src={c.image} alt={c.title} sizes="(min-width: 900px) 33vw, 100vw" />
                  <span className="paytype">{c.pay_type}</span>
                </div>
                <div className="course-b">
                  <ul className="tags">
                    {c.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <h3>{c.title}</h3>
                  <p className="cd">{c.description}</p>
                  <dl className="cmeta">
                    <div>
                      <dt>{lb.trial_label}</dt>
                      <dd>{c.features.freeTrial}</dd>
                    </div>
                    <div>
                      <dt>{lb.instructor_label}</dt>
                      <dd>{c.instructor}</dd>
                    </div>
                  </dl>
                  <div className="cprice">
                    <span className="dur">
                      <Icon name="clock" />
                      {c.pricing.duration}
                    </span>
                    <span className="price">
                      {original ? <s>{original}</s> : null}
                      {c.pricing.price}
                    </span>
                  </div>
                  <div className="cbtns">
                    {c.features.freeTrial === "あり" ? (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        aria-expanded={open}
                        aria-controls={`trial-${c.id}`}
                        onClick={() => setBooking(open ? null : c.id)}
                      >
                        <span>
                          <Rich text={open ? lb.book_trial_button_reset : lb.book_trial_button} />
                        </span>
                        <Icon name="cal" />
                      </button>
                    ) : null}
                    <a className="btn btn-primary" href={c.stripe_link} target="_blank" rel="noopener noreferrer">
                      <span>{lb.apply_button}</span>
                      <Icon name="ext" />
                    </a>
                  </div>
                  {open ? (
                    <RequestFlow
                      className="inline-book"
                      labels={ENGLISH_FLOW}
                      course={{ name: c.title, price: c.pricing.price, duration: c.pricing.duration }}
                    />
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
