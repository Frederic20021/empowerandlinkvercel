"use client";

import { useState } from "react";
import { Reveal } from "@/components/flow/Reveal";
import { english } from "@/content/english";
import { Modal } from "../shared/Modal";
import { ProfCard } from "../shared/ProfCard";
import { Rich } from "../shared/text";

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");

/** 講師紹介: instructor cards; a card opens a dialog listing that instructor's courses. */
export function Instructors() {
  const pi = english.profintro;
  const [open, setOpen] = useState<number | null>(null);
  const p = open === null ? null : pi.items[open];
  const rows = p ? english.courses.items.filter((c) => norm(c.instructor) === norm(p.name)) : [];
  const ml = pi.modal.labels;
  return (
    <section className="sec tint" id="profIntro">
      <div className="wrap">
        <Reveal as="header" className="shead">
          <h2>{pi.heading}</h2>
        </Reveal>
        <div className="profs">
          {pi.items.map((person, i) => (
            <ProfCard
              key={person.id}
              person={person}
              suffix={pi.labels.name_suffix}
              chip={pi.labels.profile_tab}
              onOpen={() => setOpen(i)}
            />
          ))}
        </div>
      </div>
      {p ? (
        <Modal title={pi.modal.title_template.replace("{name}", p.name)} onClose={() => setOpen(null)}>
          {rows.length ? (
            <ul className="mlist">
              {rows.map((c) => (
                <li key={c.id}>
                  <div>
                    <h4>{c.title}</h4>
                    <p>
                      <small>{ml.type}</small> {c.pay_type} &nbsp; <small>{ml.time}</small> {c.pricing.duration} &nbsp;{" "}
                      <small>{ml.price}</small> {c.pricing.price}
                    </p>
                  </div>
                  <a className="btn btn-ghost" href={`#course-${c.id}`} onClick={() => setOpen(null)}>
                    <span>{pi.modal.detail_button}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <Rich text={pi.modal.empty} />
            </p>
          )}
        </Modal>
      ) : null}
    </section>
  );
}
