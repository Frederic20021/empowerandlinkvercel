import { SITE } from "@/content/site";
import { getAllPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-url";

const xml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function GET() {
  const base = getSiteUrl();
  const posts = getAllPosts();
  const items = posts
    .map((p) => {
      const url = `${base}/blog/${p.slug}`;
      const pub = p.date ? `\n      <pubDate>${new Date(`${p.date}T00:00:00+09:00`).toUTCString()}</pubDate>` : "";
      return `    <item>
      <title>${xml(p.title)}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="true">${xml(url)}</guid>${pub}
      <description>${xml(p.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`${SITE.name} お知らせ`)}</title>
    <link>${xml(`${base}/blog`)}</link>
    <description>${xml("エンパワー＆リンクの最新情報をご紹介します。")}</description>
    <language>ja</language>
    <atom:link href="${xml(`${base}/blog/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=3600" },
  });
}
