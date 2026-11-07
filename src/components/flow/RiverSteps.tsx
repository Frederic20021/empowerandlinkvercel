"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { COL, lengthAtY, stepsPaths, type Pt } from "./river-path";
import { Reveal } from "./Reveal";
import { prefersReducedMotion } from "./observe";

type Step = {
  /** Content of the numbered node (e.g. "01" or an icon). */
  node: ReactNode;
  /** Card content (use `.slabel`, h3, p). */
  children: ReactNode;
};

type RiverStepsProps = {
  items: Step[];
  className?: string;
};

type Local = { w: number; h: number; paths: string[]; ny: number[] };

const STROKE = [2.6, 2.2, 1.8];

/** Position of `el` inside `root` from layout offsets (offsetLeft/Top), unaffected by CSS transforms. */
export function offsetWithin(el: HTMLElement, root: HTMLElement): { x: number; y: number } {
  let x = 0;
  let y = 0;
  let cur: HTMLElement | null = el;
  while (cur && cur !== root) {
    x += cur.offsetLeft;
    y += cur.offsetTop;
    const parent = cur.offsetParent as HTMLElement | null;
    // If root is not an offsetParent in the chain, fall back to subtracting its own offsets.
    if (parent && !root.contains(parent) && parent !== root) {
      x -= root.offsetLeft;
      y -= root.offsetTop;
      break;
    }
    cur = parent;
  }
  return { x, y };
}

/**
 * Numbered stations along a wavy three-strand river that draws itself and lights each node as you
 * scroll (`.steps` / `.station` / `.scard`). Cards alternate left/right from 900px.
 * The svg is always the first child, as in the mockup, so the odd/even card sides match.
 */
export function RiverSteps({ items, className }: RiverStepsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const strandRefs = useRef<Array<SVGPathElement | null>>([]);
  const lensRef = useRef<number[]>([]);
  const [local, setLocal] = useState<Local | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const paint = useCallback(() => {
    const root = rootRef.current;
    const lens = lensRef.current;
    const strands = strandRefs.current;
    if (!root || !local || !strands[1] || !lens[1]) return;
    const reduce = prefersReducedMotion();
    const top = root.getBoundingClientRect().top;
    // Scroll trigger line, capped at the last node so the drawing stops there.
    const y = Math.min(window.innerHeight * 0.62 - top, local.ny[local.ny.length - 1]);
    const mid = strands[1];
    const Lm = reduce ? lens[1] : lengthAtY((l) => mid.getPointAtLength(l), lens[1], Math.max(0, y));
    const fr = Lm / lens[1];
    strands.forEach((p, i) => {
      if (p) p.style.strokeDashoffset = String(lens[i] * (1 - Math.min(1, fr)));
    });
    root.querySelectorAll<HTMLElement>(".station").forEach((st, i) => {
      if (reduce || local.ny[i] <= y) st.setAttribute("data-on", "");
      else st.removeAttribute("data-on");
    });
  }, [local]);

  const rebuild = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const cr = root.getBoundingClientRect();
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(".node"));
    if (!nodes.length) return;
    // The stations slide up into place (reveal: translateY), so a measurement taken mid-slide would put
    // the river below the nodes. Take y from layout offsets, which ignore transforms; x from the box
    // (the reveal never moves things sideways, and the node itself is centred with translateX).
    const centers: Pt[] = nodes.map((n) => {
      const r = n.getBoundingClientRect();
      return [r.left - cr.left + r.width / 2, offsetWithin(n, root).y + n.offsetHeight / 2];
    });
    setLocal({
      w: cr.width,
      h: cr.height,
      paths: stepsPaths(centers, cr.width < 760),
      ny: centers.map((c) => c[1]),
    });
  }, []);

  const schedule = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(rebuild, 150);
  }, [rebuild]);

  useLayoutEffect(() => {
    if (!local) return;
    lensRef.current = strandRefs.current.map((p) => {
      if (!p) return 0;
      const l = p.getTotalLength();
      p.style.strokeDasharray = String(l);
      return l;
    });
    paint();
  }, [local, paint]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        paint();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [paint]);

  useEffect(() => {
    rebuild();
    const t = setTimeout(rebuild, 600);
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    document.addEventListener("load", schedule, true);
    if (document.fonts?.ready) document.fonts.ready.then(schedule);
    let ro: ResizeObserver | undefined;
    if (rootRef.current && "ResizeObserver" in window) {
      ro = new ResizeObserver(schedule);
      ro.observe(rootRef.current);
    }
    return () => {
      clearTimeout(t);
      clearTimeout(timer.current);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      document.removeEventListener("load", schedule, true);
      ro?.disconnect();
    };
  }, [rebuild, schedule]);

  return (
    <div className={cn("steps", className)} ref={rootRef} role="list">
      <svg
        className="steps-river"
        aria-hidden="true"
        viewBox={local ? `0 0 ${local.w} ${local.h}` : undefined}
      >
        {local &&
          local.paths.map((d, s) => (
            <g key={s}>
              <path d={d} className="base" stroke={COL[s]} strokeWidth={2} />
              <path
                d={d}
                stroke={COL[s]}
                strokeWidth={STROKE[s]}
                opacity={0.95}
                ref={(el) => {
                  strandRefs.current[s] = el;
                }}
              />
            </g>
          ))}
      </svg>
      {items.map((it, i) => (
        <Reveal key={i} className="station" role="listitem">
          <span className="node">{it.node}</span>
          <div className="scard">{it.children}</div>
        </Reveal>
      ))}
    </div>
  );
}
