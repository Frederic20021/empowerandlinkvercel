import Image from "next/image";
import "./shared.css";
import { imgSrc } from "./text";

/** Photo that fills its (positioned) frame; `src` is a content path ("assets/...") or a "/images/..." URL. */
export function Photo({
  src,
  alt,
  sizes = "(min-width: 900px) 33vw, 100vw",
  priority,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image src={src.startsWith("/") ? src : imgSrc(src)} alt={alt} fill sizes={sizes} priority={priority} />
  );
}
