import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Directives that can't break any page: enforced now.
const cspEnforced = [
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
];

// Full allowlist, report-only until the reports are clean.
// Inline scripts stay allowed: Next.js injects them and nonces would make every page dynamic.
const cspReportOnly = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://api.emailjs.com https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://raw.githubusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.emailjs.com https://va.vercel-scripts.com",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://smart-mensetsu.com",
  "worker-src 'self' blob:",
  ...cspEnforced.filter((d) => d !== "upgrade-insecure-requests"),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Lets several local builds run side by side (e.g. NEXT_DIST_DIR=.next-a). Defaults to .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: {
    globalNotFound: true,
  },
  async redirects() {
    // The old site served the Smart Mensetsu page at /smartMensetsu.
    return [
      { source: "/smartMensetsu", destination: "/smart-mensetsu", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "Content-Security-Policy", value: cspEnforced.join("; ") },
          { key: "Content-Security-Policy-Report-Only", value: cspReportOnly.join("; ") },
        ],
      },
    ];
  },
};

export default nextConfig;
