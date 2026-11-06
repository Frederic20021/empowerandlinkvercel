import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { resolveBlogImage } from "./images";
import "./blog.css";

/** A standalone image line must be its own paragraph so it can become a <figure>. */
export function isolateImages(md: string): string {
  return md.replace(/^[ \t]*(!\[[^\]]*\]\([^)\n]*\))[ \t]*$/gm, "\n$1\n");
}

/** Lines that start with a middle dot are bullet items in these posts (the old site showed them as a list). */
export function bulletizeMiddleDots(md: string): string {
  return md.replace(/^・[ \t　]*(.*)$/gm, "- $1");
}

export function prepareMarkdown(md: string): string {
  return isolateImages(bulletizeMiddleDots(md));
}

const components: Components = {
  // Raw HTML is never rendered (react-markdown escapes it); only images/links below are customised.
  p({ node, children }) {
    const kids = (node?.children ?? []).filter((c) => !(c.type === "text" && !c.value.trim()));
    if (kids.length === 1 && kids[0].type === "element" && kids[0].tagName === "img") {
      const src = kids[0].properties?.src;
      return resolveBlogImage(typeof src === "string" ? src : null) ? <figure>{children}</figure> : null;
    }
    return <p>{children}</p>;
  },
  img({ src, alt }) {
    const img = resolveBlogImage(typeof src === "string" ? src : null);
    if (!img) return null;
    const text = alt || "記事内の画像";
    if (img.kind === "local") {
      return <Image src={img.src} alt={text} width={1200} height={800} sizes="(min-width: 900px) 820px, 100vw" />;
    }
    // eslint-disable-next-line @next/next/no-img-element -- raw.githubusercontent.com is not an optimizer host
    return <img src={img.src} alt={text} loading="lazy" decoding="async" />;
  },
  a({ href, children }) {
    if (href && /^https?:\/\//i.test(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return <a href={href}>{children}</a>;
  },
};

/** Post body → HTML styled by `.prose.post-body`. */
export function PostMarkdown({ source }: { source: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {prepareMarkdown(source)}
    </ReactMarkdown>
  );
}
