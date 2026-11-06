import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAppUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
}

const YT_ID_RE =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})|^(?=.*[A-Z0-9])([A-Za-z0-9_-]{11})$/;

/** Extract 11-char YouTube video ID from a watch/share/shorts/embed URL or bare ID. */
export function getYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const match = trimmed.match(YT_ID_RE);
  return match ? (match[1] ?? match[2]) : null;
}

/** Build hqdefault thumbnail URL from a YouTube URL or bare ID. Returns null if ID not found. */
export function getYouTubeThumbnailUrl(input: string): string | null {
  const id = getYouTubeVideoId(input);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/** Converts a YouTube watch/share/shorts URL (or bare ID) to an embed URL. Returns null if not recognised. */
export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/** Slugify a string for use in file paths: "My Title!" → "my-title" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Format cents to a readable price string, e.g. 2499 → "$24.99" */
export function formatPrice(cents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Default display timezone for the app. Server components on Vercel run in UTC,
 * so without an explicit `timeZone` every timestamp would render in UTC. The
 * audience is Japan-based, so we default to Asia/Tokyo for consistent times
 * across server- and client-rendered components.
 */
export const DEFAULT_TIME_ZONE = 'Asia/Tokyo';

/**
 * Format a date consistently regardless of where it renders (server vs client).
 * Pass the user's `profile.timezone` when available; otherwise it falls back to
 * Asia/Tokyo. Accepts a Date, ISO string, or epoch ms.
 */
export function formatDate(
  value: string | number | Date,
  opts?: { withTime?: boolean; timeZone?: string | null },
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const timeZone = opts?.timeZone || DEFAULT_TIME_ZONE;
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone,
  });

  if (!opts?.withTime) return dateStr;

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  });
  return `${dateStr} · ${timeStr}`;
}
