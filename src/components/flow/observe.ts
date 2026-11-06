// One shared IntersectionObserver for reveal / count-up / tributaries, with the mockup's stagger:
// elements that enter within the same ~120ms burst get --d delays of 0, .08, .16 ... (max .4s).

type Entry = { cb: (delay: number) => void };

const targets = new Map<Element, Entry>();
let io: IntersectionObserver | null = null;
let batch = 0;
let batchTimer: ReturnType<typeof setTimeout> | undefined;

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const t = targets.get(e.target);
          if (!t) return;
          io?.unobserve(e.target);
          targets.delete(e.target);
          const delay = Math.min(batch++, 5) * 0.08;
          clearTimeout(batchTimer);
          batchTimer = setTimeout(() => {
            batch = 0;
          }, 120);
          t.cb(delay);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );
  }
  return io;
}

/** Calls `cb(delaySeconds)` once when `el` scrolls into view (immediately if IntersectionObserver is missing). */
export function observeOnce(el: Element, cb: (delay: number) => void): () => void {
  const o = getObserver();
  if (!o) {
    cb(0);
    return () => {};
  }
  targets.set(el, { cb });
  o.observe(el);
  return () => {
    targets.delete(el);
    o.unobserve(el);
  };
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
