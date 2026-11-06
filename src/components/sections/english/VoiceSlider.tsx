"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/flow/Reveal";
import { prefersReducedMotion } from "@/components/flow/observe";
import { english } from "@/content/english";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import { imgSrc, Rich } from "../shared/text";

/** お客様の声: scroll-snap track with prev/next buttons and dots. */
export function VoiceSlider() {
  const vo = english.voice;
  const trackRef = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(0);
  const n = vo.items.length;

  const go = useCallback(
    (i: number) => {
      const tr = trackRef.current;
      if (!tr) return;
      const idx = (i + n) % n;
      const sl = tr.children[idx] as HTMLElement | undefined;
      if (!sl) return;
      tr.scrollTo({
        left: sl.offsetLeft - tr.offsetLeft - (tr.clientWidth - sl.clientWidth) / 2,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      setCur(idx);
    },
    [n],
  );

  useEffect(() => {
    const tr = trackRef.current;
    if (!tr) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const c = tr.scrollLeft + tr.clientWidth / 2;
        let best = 0;
        let bd = Infinity;
        Array.from(tr.children).forEach((el, i) => {
          const sl = el as HTMLElement;
          const d = Math.abs(sl.offsetLeft - tr.offsetLeft + sl.clientWidth / 2 - c);
          if (d < bd) {
            bd = d;
            best = i;
          }
        });
        setCur(best);
      }, 80);
    };
    tr.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      tr.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Reveal className="slider" role="region" aria-roledescription="carousel" aria-label={vo.heading}>
      <div className="track" ref={trackRef} tabIndex={0}>
        {vo.items.map((t, i) => (
          <article className="slide" key={t.id} role="group" aria-label={`${i + 1} / ${n}`}>
            <div className="vc">
              <div className="vh">
                <Image src={imgSrc(t.avatar)} alt="" width={54} height={54} />
                <div>
                  <b>{t.name}</b>
                  <span>{t.title}</span>
                </div>
                <div className="rate">
                  <small>{vo.labels.overall_rating}</small>
                  <span className="stars" aria-label={`${t.rating}`}>
                    {Array.from({ length: t.rating }, (_, k) => (
                      <Icon name="star" className="on" key={k} />
                    ))}
                  </span>
                  <b>{t.rating}</b>
                </div>
              </div>
              <h3>{t.headline}</h3>
              <p>
                <Rich text={t.content} />
              </p>
              <p className="vp">
                {vo.labels.instructor_label} {t.responsibleProf}
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className="sl-ctl">
        <button type="button" className="sl-b" aria-label="前へ" onClick={() => go(cur - 1)}>
          <Icon name="arrow" className="flip" />
        </button>
        <div className="dots">
          {vo.items.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className={cn(i === cur && "on")}
              aria-label={`${i + 1} / ${n}`}
              aria-current={i === cur}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button type="button" className="sl-b" aria-label="次へ" onClick={() => go(cur + 1)}>
          <Icon name="arrow" />
        </button>
      </div>
    </Reveal>
  );
}
