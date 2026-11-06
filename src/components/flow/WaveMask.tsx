import Image from "next/image";
import { cn } from "@/lib/utils";

type WaveMaskProps = {
  src: string;
  alt: string;
  /** A = organic blob, B = wave-edged banner. */
  variant?: "A" | "B";
  sizes?: string;
  priority?: boolean;
  /** Extra classes on the frame, e.g. to change the aspect ratio ("aspect-[16/8]"). */
  className?: string;
  /** CSS object-position of the photo. */
  objectPosition?: string;
};

/** Photo inside the wave-edged clip-path frame (`.blob .blobA/.blobB`; clip paths come from <BlobDefs/>). */
export function WaveMask({ src, alt, variant = "A", sizes, priority, className, objectPosition }: WaveMaskProps) {
  return (
    <div className={cn("blob", variant === "A" ? "blobA" : "blobB", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(min-width: 900px) 45vw, 100vw"}
        priority={priority}
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  );
}

/** Hidden SVG holding the clipPaths used by WaveMask. Rendered once by the root layout. */
export function BlobDefs() {
  return (
    <svg className="defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="blobA" clipPathUnits="objectBoundingBox">
          <path d="M0.06,0.2 C0.16,0.04 0.38,0.07 0.55,0.03 C0.76,-0.02 0.95,0.08 0.98,0.3 C1,0.48 0.93,0.58 0.97,0.76 C1,0.94 0.82,1.01 0.62,0.97 C0.44,0.94 0.3,1.01 0.15,0.95 C-0.01,0.89 0.04,0.72 0.01,0.55 C-0.01,0.4 -0.02,0.3 0.06,0.2Z" />
        </clipPath>
        <clipPath id="blobB" clipPathUnits="objectBoundingBox">
          <path d="M0,0.12 C0.15,0.02 0.3,0.12 0.5,0.06 C0.7,0 0.85,0.1 1,0.03 L1,0.88 C0.85,0.97 0.7,0.88 0.5,0.95 C0.3,1.02 0.15,0.92 0,0.99Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
