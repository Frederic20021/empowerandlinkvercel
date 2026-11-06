import { Noto_Sans_JP, Shippori_Mincho_B1 } from "next/font/google";

// Display: Shippori Mincho B1. 700 is added to the spec'd 600/800 because the
// design's h2-h4 use font-weight 700.
export const shippori = Shippori_Mincho_B1({
  variable: "--font-shippori",
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

// Body: Noto Sans JP (Japanese glyph slices are served via unicode-range).
export const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const fontClassName = `${shippori.variable} ${notoSansJP.variable}`;
