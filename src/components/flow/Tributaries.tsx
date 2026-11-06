"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { observeOnce } from "./observe";

type TributariesProps = {
  /** The cards (e.g. `<article class="svc rv">`), laid out in `.svc-grid`. */
  children: ReactNode;
  /** Number of cards/streams (default 4). Desktop grid gets this many columns. */
  count?: number;
  className?: string;
};

/** N cards whose streams (SVG, from 1000px) draw down and join into one trunk when scrolled into view. */
export function Tributaries({ children, count = 4, className }: TributariesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => setOn(true));
  }, []);

  const xs = Array.from({ length: count }, (_, i) => Math.round(((i + 0.5) / count) * 1000));
  return (
    <div ref={ref} className={cn("tribs", on && "in", className)} style={{ "--cols": count } as React.CSSProperties}>
      <div className="svc-grid">{children}</div>
      <svg className="tribs-svg" viewBox="0 0 1000 150" preserveAspectRatio="none" aria-hidden="true">
        {xs.map((x, k) => (
          <path key={k} className={`trib t${k % 4}`} d={`M${x},0 C${x},70 500,60 500,140`} />
        ))}
        <path className="trunk" d="M500,140 L500,150" />
      </svg>
    </div>
  );
}
