import { describe, expect, it } from "vitest";
import {
  curve,
  lengthAtY,
  riverCuts,
  riverGeometry,
  sectionBreaks,
  stepsPaths,
  stepsPoints,
  type Pt,
} from "./river-path";

describe("curve", () => {
  it("builds a cubic bezier chain with vertical tangents", () => {
    const pts: Pt[] = [
      [10, 0],
      [10, 100],
      [50, 200],
    ];
    expect(curve(pts, 0, 0.5)).toBe("M10,0 C10,50 10,50 10,100 C10,150 50,150 50,200");
  });

  it("shifts every x by the offset", () => {
    expect(curve([[10, 0], [20, 100]], 5, 0.5)).toBe("M15,0 C15,50 25,50 25,100");
  });
});

describe("lengthAtY", () => {
  it("finds the length where a vertical line reaches y", () => {
    const pointAt = (len: number) => ({ y: len });
    expect(lengthAtY(pointAt, 1000, 400)).toBeCloseTo(400, 1);
    expect(lengthAtY(pointAt, 1000, 0)).toBeLessThan(0.1);
    expect(lengthAtY(pointAt, 1000, 5000)).toBeCloseTo(1000, 1);
  });
});

describe("sectionBreaks / riverCuts", () => {
  it("dedupes tops closer than 60px and appends the page height", () => {
    expect(sectionBreaks([0, 30, 500, 520, 1500], 3000)).toEqual([0, 500, 1500, 3000]);
  });

  it("splits long spans into ~1000px cuts", () => {
    const cuts = riverCuts([0, 500, 3500]);
    expect(cuts).toHaveLength(1 + 3);
    expect(cuts[0]).toEqual([0, 500]);
    expect(cuts[3][1]).toBe(3500);
  });
});

describe("riverGeometry", () => {
  const tops = [0, 900, 1900];

  it("returns three strands and covers the full page height", () => {
    const g = riverGeometry(1440, 2800, tops);
    expect(g.paths).toHaveLength(3);
    expect(g.widths).toEqual([3, 2.4, 1.8]);
    expect(g.paths[1].startsWith("M")).toBe(true);
    expect(g.paths[1].endsWith(",2800")).toBe(true);
  });

  it("keeps the strands out of the 1120px content column on desktop", () => {
    const g = riverGeometry(1440, 2800, tops);
    const xs = (g.paths[1].match(/-?\d+(\.\d+)?(?=,)/g) ?? []).map(Number);
    const inside = xs.filter((x) => x > (1440 - 1120) / 2 + 20 && x < 1440 - (1440 - 1120) / 2 - 20);
    expect(inside).toHaveLength(0);
  });

  it("uses thinner strands and smaller spread on mobile", () => {
    const g = riverGeometry(390, 2800, tops);
    expect(g.widths).toEqual([2.2, 1.8, 1.4]);
    // strand offsets are (s-1)*4 on mobile: left/right strands start 8px apart
    const start = (d: string) => Number(d.slice(1).split(",")[0]);
    expect(start(g.paths[2]) - start(g.paths[0])).toBe(8);
  });
});

describe("stepsPoints / stepsPaths", () => {
  const centers: Pt[] = [
    [30, 100],
    [30, 300],
    [30, 500],
  ];

  it("adds a lead-in above the first node and ends exactly at the last node", () => {
    const pts = stepsPoints(centers, false);
    expect(pts[0]).toEqual([30, 74]);
    expect(pts[pts.length - 1]).toEqual([30, 500]);
  });

  it("never extends below the last node", () => {
    for (const mobile of [false, true]) {
      const ys = stepsPoints(centers, mobile).map((p) => p[1]);
      expect(Math.max(...ys)).toBe(500);
    }
  });

  it("meanders between nodes with the desktop/mobile amplitude, alternating sides", () => {
    const d = stepsPoints(centers, false);
    expect(d[2]).toEqual([30 + 38, 200]);
    expect(d[4]).toEqual([30 - 38, 400]);
    expect(stepsPoints(centers, true)[2]).toEqual([30 + 8, 200]);
  });

  it("returns three strand paths", () => {
    expect(stepsPaths(centers, false)).toHaveLength(3);
  });
});
