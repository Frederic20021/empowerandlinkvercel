import Image from "next/image";
import { resolveBlogImage } from "./images";

type Props = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
};

/** Cover-style image that fills its (relatively positioned) parent. Renders nothing for disallowed sources. */
export function PostImage({ src, alt, sizes, priority }: Props) {
  const img = resolveBlogImage(src);
  if (!img) return null;
  if (img.kind === "local") return <Image src={img.src} alt={alt} fill sizes={sizes} priority={priority} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- raw.githubusercontent.com is not an optimizer host
    <img src={img.src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" style={{ position: "absolute", inset: 0 }} />
  );
}
