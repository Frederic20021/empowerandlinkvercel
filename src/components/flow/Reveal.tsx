"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type HTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { observeOnce } from "./observe";

type RevealProps = HTMLAttributes<HTMLElement> & {
  /** Element to render (default div). */
  as?: ElementType;
  /** When set, renders a next/link `<Link>` (internal link card) instead of `as`. */
  href?: string;
};

/**
 * Fade-up on scroll (`.rv` → `.rv.in`). Content is always visible without JS or with
 * prefers-reduced-motion (handled in CSS). Children may be Server Components.
 */
export function Reveal({ as, href, className, style, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<{ on: boolean; delay: number }>({ on: false, delay: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, (delay) => setState({ on: true, delay }));
  }, []);

  const Tag: ElementType = href !== undefined ? Link : (as ?? "div");
  const merged = state.on ? ({ ...style, "--d": `${state.delay}s` } as CSSProperties) : style;
  return (
    <Tag ref={ref} {...(href !== undefined ? { href } : {})} className={cn("rv", state.on && "in", className)} style={merged} {...rest}>
      {children}
    </Tag>
  );
}
