"use client";

import { useId, useState } from "react";
import { Reveal } from "@/components/flow/Reveal";
import { cn } from "@/lib/utils";
import { Rich } from "./text";

type FaqItem = { readonly q: string; readonly a: string };

/** Accordion (`.faq .qa`): one button per question, several can be open, answers stay in the DOM. */
export function Faq({ items }: { items: ReadonlyArray<FaqItem> }) {
  const sid = useId();
  const [open, setOpen] = useState<ReadonlySet<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  return (
    <div className="faq">
      {items.map((it, i) => {
        const on = open.has(i);
        return (
          <Reveal key={i} className={cn("qa", on && "open")}>
            <h3>
              <button
                type="button"
                className="qa-q"
                aria-expanded={on}
                aria-controls={`${sid}-a${i}`}
                id={`${sid}-q${i}`}
                onClick={() => toggle(i)}
              >
                <span className="qa-m">Q</span>
                <span className="qa-t">{it.q}</span>
                <span className="qa-i" aria-hidden="true" />
              </button>
            </h3>
            <div className="qa-a" id={`${sid}-a${i}`} role="region" aria-labelledby={`${sid}-q${i}`}>
              <div>
                <p>
                  <span className="qa-m a">A</span>
                  <span>
                    <Rich text={it.a} />
                  </span>
                </p>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
