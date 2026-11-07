// Pure geometry for the "river" (three-strand flow line). No DOM access here so it can be unit tested.
// Ported from web-redesign/a-current/main.js.

export type Pt = [number, number];

/** Strand colours (navy, mid, light) and bezier tension per strand. */
export const COL = ["#173993", "#427BC0", "#93BFE6"] as const;
export const TEN = [0.5, 0.4, 0.45] as const;

/** SVG path through `pts`, shifted horizontally by `off`, with vertical-tangent beziers (tension `t`). */
export function curve(pts: Pt[], off: number, t: number): string {
  let d = "M" + (pts[0][0] + off) + "," + pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const dy = (b[1] - a[1]) * t;
    d +=
      " C" + (a[0] + off) + "," + (a[1] + dy) +
      " " + (b[0] + off) + "," + (b[1] - dy) +
      " " + (b[0] + off) + "," + b[1];
  }
  return d;
}

/** Length along a (vertically monotone) path at which it reaches `y`, by bisection. */
export function lengthAtY(pointAt: (len: number) => { y: number }, len: number, y: number): number {
  let lo = 0;
  let hi = len;
  for (let i = 0; i < 16; i++) {
    const m = (lo + hi) / 2;
    if (pointAt(m).y < y) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

/** Section boundaries: first top, then every top more than 60px below the previous, then the page height. */
export function sectionBreaks(tops: number[], H: number): number[] {
  const ys = [tops[0] || 0];
  tops.forEach((t) => {
    if (t > ys[ys.length - 1] + 60) ys.push(t);
  });
  ys.push(H);
  return ys;
}

/** Split each section span into ~1000px cuts; the river swaps sides at every cut. */
export function riverCuts(ys: number[]): Array<[number, number]> {
  const cuts: Array<[number, number]> = [];
  for (let i = 0; i < ys.length - 1; i++) {
    const a = ys[i];
    const b = ys[i + 1];
    const n = Math.max(1, Math.round((b - a) / 1000));
    for (let k = 0; k < n; k++) cuts.push([a + ((b - a) * k) / n, a + ((b - a) * (k + 1)) / n]);
  }
  return cuts;
}

export type RiverGeometry = {
  W: number;
  H: number;
  paths: string[];
  widths: number[];
};

/**
 * Page river: hugs the left/right gutters (never the 1120px content column) and alternates sides
 * per cut, so it passes beside the hero text rather than through it.
 */
export function riverGeometry(W: number, H: number, tops: number[]): RiverGeometry {
  const ys = sectionBreaks(tops, H);
  const cuts = riverCuts(ys);
  const g = (W - 1120) / 2 - 36;
  const xl = g > 70 ? g * 0.3 : Math.max(8, W * 0.012);
  const xr = W - xl;
  const spread = W > 900 ? 9 : 4;
  const pts: Pt[] = [[xl, 0]];
  cuts.forEach((c, i) => {
    const x = i % 2 === 0 ? xl : xr;
    const pad = Math.min(48, (c[1] - c[0]) * 0.25);
    pts.push([x, c[0] + pad]);
    pts.push([x, c[1] - pad]);
  });
  pts.push([pts[pts.length - 1][0], H]);
  const widths = W > 900 ? [3, 2.4, 1.8] : [2.2, 1.8, 1.4];
  const paths = [0, 1, 2].map((s) => curve(pts, (s - 1) * spread, TEN[s]));
  return { W, H, paths, widths };
}

/**
 * Local river through numbered stations: control points from node centres (relative to the container).
 * It starts with a short lead-in above the first node and ends exactly at the last node's centre, so
 * the drawn line finishes at the final station instead of trailing past it.
 */
export function stepsPoints(centers: Pt[], mobile: boolean): Pt[] {
  const amp = mobile ? 8 : 38;
  const pts: Pt[] = [];
  centers.forEach(([x, y], i) => {
    if (i === 0) pts.push([x, y - 26]);
    pts.push([x, y]);
    if (i < centers.length - 1) pts.push([x + (i % 2 ? -amp : amp), (y + centers[i + 1][1]) / 2]);
  });
  return pts;
}

/** The three strand paths for a steps river. */
export function stepsPaths(centers: Pt[], mobile: boolean): string[] {
  const pts = stepsPoints(centers, mobile);
  return [0, 1, 2].map((s) => curve(pts, (s - 1) * 3.5, 0.5));
}
