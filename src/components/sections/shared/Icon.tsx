import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

// Inline line icons from the candidate A mockup (build.py ICONS), 24x24, 1.6 stroke.
const PATHS = {
  users: "<circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6\"/><circle cx=\"17.5\" cy=\"9\" r=\"2.5\"/><path d=\"M17 14.2c2.6 0 4.5 1.8 4.5 4.8\"/>",
  globe: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18\"/>",
  book: "<path d=\"M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1z\"/><path d=\"M12 6v13\"/>",
  monitor: "<rect x=\"3\" y=\"4\" width=\"18\" height=\"12\" rx=\"2\"/><path d=\"M8 20h8M12 16v4\"/>",
  check: "<path d=\"M5 12.5l4.5 4.5L19 7.5\"/>",
  checkc: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M8 12.5l3 3 5-6\"/>",
  arrow: "<path d=\"M5 12h14M13 6l6 6-6 6\"/>",
  down: "<path d=\"M12 4v15M6 13l6 6 6-6\"/>",
  phone: "<path d=\"M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z\"/>",
  mail: "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M3.5 7l8.5 6 8.5-6\"/>",
  clock: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>",
  drop: "<path d=\"M12 3s6 6.2 6 10.5a6 6 0 01-12 0C6 9.2 12 3 12 3z\"/>",
  cal: "<rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15\" rx=\"2\"/><path d=\"M3.5 10h17M8 3v4M16 3v4\"/>",
  phone2: "<rect x=\"7\" y=\"2.5\" width=\"10\" height=\"19\" rx=\"2.5\"/><path d=\"M11 18.5h2\"/>",
  trend: "<path d=\"M3 17l6-6 4 4 8-8M15 7h6v6\"/>",
  stopwatch: "<circle cx=\"12\" cy=\"13.5\" r=\"7.5\"/><path d=\"M12 9.5v4l2.5 2M9.5 3h5\"/>",
  cap: "<path d=\"M2 9l10-5 10 5-10 5z\"/><path d=\"M6 11.5V16c3 2.5 9 2.5 12 0v-4.5\"/>",
  doc: "<path d=\"M6 3h8l4 4v14H6z\"/><path d=\"M14 3v4h4M9 12h6M9 16h6\"/>",
  building: "<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"1\"/><path d=\"M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2\"/>",
  chat: "<path d=\"M4 5h16v11H10l-4 4v-4H4z\"/>",
  star: "<path d=\"M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z\"/>",
  gear: "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1\"/>",
  cloud: "<path d=\"M7 18a4.5 4.5 0 01-.6-9A6 6 0 0118 9.5 4.3 4.3 0 0117.5 18z\"/>",
  robot: "<rect x=\"4\" y=\"8\" width=\"16\" height=\"11\" rx=\"3\"/><path d=\"M12 8V4M9 13h.01M15 13h.01M9 16.5h6\"/>",
  layers: "<path d=\"M12 3l9 5-9 5-9-5z\"/><path d=\"M3 13l9 5 9-5\"/>",
  link: "<path d=\"M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3A4 4 0 0011 18.7l1-1\"/>",
  bulb: "<path d=\"M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.7.6 1 1.3 1 2.1h5c0-.8.3-1.5 1-2.1A6 6 0 0012 3z\"/>",
  chart: "<path d=\"M4 20V4M4 20h16\"/><path d=\"M8 16v-4M12 16V8M16 16v-6\"/>",
  server: "<rect x=\"3.5\" y=\"4\" width=\"17\" height=\"6\" rx=\"1.5\"/><rect x=\"3.5\" y=\"14\" width=\"17\" height=\"6\" rx=\"1.5\"/><path d=\"M7 7h.01M7 17h.01\"/>",
  code: "<path d=\"M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16\"/>",
  pen: "<path d=\"M4 20l1-4L16 5a2.1 2.1 0 013 3L8 19z\"/>",
  person: "<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7\"/>",
  folder: "<path d=\"M3 6h6l2 2h10v11H3z\"/>",
  eye: "<path d=\"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>",
  target: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"4.5\"/><circle cx=\"12\" cy=\"12\" r=\".6\"/>",
  sprout: "<path d=\"M12 21v-9M12 12c0-4 3-6 7-6 0 4-3 6-7 6zM12 15c0-3-2-5-6-5 0 3 2 5 6 5z\"/>",
  plug: "<path d=\"M9 3v5M15 3v5M6 8h12v3a6 6 0 01-12 0zM12 17v4\"/>",
  dumbbell: "<path d=\"M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12\"/>",
  box: "<path d=\"M3 8l9-5 9 5v8l-9 5-9-5z\"/><path d=\"M3 8l9 5 9-5M12 13v8\"/>",
  rocket: "<path d=\"M5 19c0-3 1-5 3-7l5 5c-2 2-4 3-8 2zM14 13c4-1 6-5 6-9-4 0-8 2-9 6M9 15l-3 3\"/>",
  handshake: "<path d=\"M3 11l4-4 4 2 3-2 5 4v4l-5 4-3-2-3 1-5-3z\"/>",
  x: "<path d=\"M6 6l12 12M18 6L6 18\"/>",
  menu: "<path d=\"M4 7h16M4 12h16M4 17h16\"/>",
  ext: "<path d=\"M14 4h6v6M20 4l-9 9M18 14v5H5V6h5\"/>",
  tag: "<path d=\"M3 12V3h9l9 9-9 9z\"/><circle cx=\"7.5\" cy=\"7.5\" r=\"1\"/>",
} as const;

export type IconName = keyof typeof PATHS;

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & { name: IconName };

/** Decorative icon (aria-hidden). The `.ic` class sizes it; pass `className` for modifiers (e.g. "on", "flip"). */
export function Icon({ name, className, ...rest }: IconProps) {
  return (
    <svg
      className={cn("ic", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: PATHS[name] }}
      {...rest}
    />
  );
}
