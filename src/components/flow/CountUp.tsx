"use client";

import { useEffect, useRef, useState } from "react";
import { observeOnce, prefersReducedMotion } from "./observe";

type CountUpProps = {
  /** Final number (rendered as-is on the server and without JS). */
  end: number;
  className?: string;
  /** Animation length in ms. */
  duration?: number;
};

/** Counts from 0 to `end` (ease-out cubic) when scrolled into view. Static under prefers-reduced-motion. */
export function CountUp({ end, className, duration = 1600 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(end);

  useEffect(() => {
    const el = ref.current;
    if (!el || end === 0 || Number.isNaN(end) || prefersReducedMotion()) return;
    let raf = 0;
    const stop = observeOnce(el, () => {
      let t0: number | null = null;
      setN(0);
      const step = (t: number) => {
        if (t0 === null) t0 = t;
        const p = Math.min((t - t0) / duration, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setN(p < 1 ? Math.round(end * e) : end);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    return () => {
      stop();
      cancelAnimationFrame(raf);
    };
  }, [end, duration]);

  return (
    <span ref={ref} className={className} data-count={end}>
      {n}
    </span>
  );
}
