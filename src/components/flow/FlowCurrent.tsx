"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { COL, lengthAtY, riverGeometry, type RiverGeometry } from "./river-path";
import { prefersReducedMotion } from "./observe";

/**
 * Page-level river: three strands drawn down the page gutters as you scroll, with a red dot riding
 * the middle strand. Mirrors a-current/main.js (buildRiver / paintRiver). Sections are the direct
 * children of `.site main` (`.sec` / `article`).
 */
export function FlowCurrent() {
  const pathname = usePathname();
  const [geom, setGeom] = useState<RiverGeometry | null>(null);
  const strandRefs = useRef<Array<SVGPathElement | null>>([]);
  const dotRef = useRef<SVGGElement>(null);
  const lensRef = useRef<number[]>([]);
  const reduceRef = useRef(false);
  const rebuildTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const paint = useCallback(() => {
    const strands = strandRefs.current;
    const mid = strands[1];
    const lens = lensRef.current;
    if (!mid || !lens[1] || !dotRef.current) return;
    const y = window.scrollY + window.innerHeight * 0.55;
    const Lm = lengthAtY((l) => mid.getPointAtLength(l), lens[1], y);
    const fr = Lm / lens[1];
    strands.forEach((p, i) => {
      if (p) p.style.strokeDashoffset = String(reduceRef.current ? 0 : lens[i] * (1 - fr));
    });
    const pt = mid.getPointAtLength(Lm);
    dotRef.current.setAttribute("transform", `translate(${pt.x},${pt.y})`);
  }, []);

  const rebuild = useCallback(() => {
    const de = document.documentElement;
    const W = de.clientWidth;
    const H = Math.max(de.scrollHeight, document.body.scrollHeight);
    const secs = Array.from(document.querySelectorAll(".site main > .sec, .site main > article"));
    const tops = secs.map((s) => s.getBoundingClientRect().top + window.scrollY);
    setGeom(riverGeometry(W, H, tops));
  }, []);

  const schedule = useCallback(() => {
    clearTimeout(rebuildTimer.current);
    rebuildTimer.current = setTimeout(rebuild, 150);
  }, [rebuild]);

  // Measure strand lengths once the new paths are in the DOM, then paint.
  useLayoutEffect(() => {
    if (!geom) return;
    lensRef.current = strandRefs.current.map((p) => {
      if (!p) return 0;
      const l = p.getTotalLength();
      p.style.strokeDasharray = String(l);
      return l;
    });
    paint();
  }, [geom, paint]);

  useEffect(() => {
    reduceRef.current = prefersReducedMotion();
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        paint();
      });
    };
    const onLoad = () => {
      rebuild();
      setTimeout(rebuild, 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", onLoad);
    // image loads anywhere (capture phase) change the page height
    document.addEventListener("load", schedule, true);
    if (document.fonts?.ready) document.fonts.ready.then(schedule);
    let ro: ResizeObserver | undefined;
    if ("ResizeObserver" in window) {
      let lastH = 0;
      ro = new ResizeObserver(() => {
        const h = document.body.scrollHeight;
        if (Math.abs(h - lastH) > 4) {
          lastH = h;
          schedule();
        }
      });
      ro.observe(document.body);
    }
    const first = requestAnimationFrame(rebuild);
    if (document.readyState === "complete") setTimeout(rebuild, 600);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", onLoad);
      document.removeEventListener("load", schedule, true);
      ro?.disconnect();
      cancelAnimationFrame(first);
      clearTimeout(rebuildTimer.current);
    };
  }, [paint, rebuild, schedule]);

  // Client-side navigation swaps the page content: rebuild once it has rendered.
  useEffect(() => {
    schedule();
    const t = setTimeout(rebuild, 700);
    return () => clearTimeout(t);
  }, [pathname, rebuild, schedule]);

  if (!geom) return null;
  return (
    <div className="river" aria-hidden="true" style={{ height: geom.H }}>
      <svg width={geom.W} height={geom.H} viewBox={`0 0 ${geom.W} ${geom.H}`}>
        {geom.paths.map((d, s) => (
          <g key={s}>
            <path d={d} className="track-l base" stroke={COL[s]} strokeWidth={geom.widths[s]} />
            <path
              d={d}
              className="track-l"
              stroke={COL[s]}
              strokeWidth={geom.widths[s]}
              opacity={0.6}
              ref={(el) => {
                strandRefs.current[s] = el;
              }}
            />
          </g>
        ))}
        <g className="dotg" ref={dotRef}>
          <circle r={7} className="dot-halo" />
          <circle r={5.5} className="dot" />
        </g>
      </svg>
    </div>
  );
}
