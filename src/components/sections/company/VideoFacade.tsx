"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";
import "./video-facade.css";

type VideoFacadeProps = {
  /** YouTube video id. */
  id: string;
  title: string;
  /** Local poster image (remote thumbnails are blocked by the CSP). */
  poster: string;
  posterAlt: string;
};

/** Click-to-load YouTube player: nothing from youtube is requested until the visitor presses play. */
export function VideoFacade({ id, title, poster, posterAlt }: VideoFacadeProps) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }
  return (
    <button type="button" className="vfacade" onClick={() => setPlaying(true)} aria-label={`${title} を再生`}>
      <Image src={poster} alt={posterAlt} fill sizes="(min-width: 900px) 900px, 100vw" />
      <span className="vplay" aria-hidden="true">
        <Play strokeWidth={0} fill="currentColor" />
      </span>
    </button>
  );
}
