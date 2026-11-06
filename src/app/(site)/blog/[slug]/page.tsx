import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/flow/Reveal";
import { PostImage } from "@/components/blog/PostImage";
import { PostMarkdown } from "@/components/blog/PostMarkdown";
import { SITE } from "@/content/site";
import { getAllPosts, getPostBySlug, type BlogPost } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-url";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

function absolute(url: string): string {
  return /^https?:\/\//.test(url) ? url : `${getSiteUrl()}${url}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const images = post.coverImage ? [{ url: absolute(post.coverImage), alt: post.title }] : undefined;
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      locale: "ja_JP",
      siteName: SITE.name,
      title: post.title,
      description: post.excerpt || undefined,
      url: `/blog/${post.slug}`,
      publishedTime: post.date || undefined,
      images,
    },
    twitter: { card: images ? "summary_large_image" : "summary", title: post.title, description: post.excerpt || undefined },
  };
}

function jsonLd(post: BlogPost) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    image: post.coverImage ? [absolute(post.coverImage)] : undefined,
    inLanguage: "ja",
    mainEntityOfPage: `${base}/blog/${post.slug}`,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: `${base}${SITE.logo}` } },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="sec" id="post">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(post)).replace(/</g, "\\u003c") }}
      />
      <div className="wrap narrow post-page">
        <Reveal href="/blog" className="back">
          <ArrowRight className="ic flip" strokeWidth={1.6} aria-hidden="true" />
          一覧に戻る
        </Reveal>
        <Reveal>
          <time dateTime={post.date}>{post.date}</time>
        </Reveal>
        <Reveal as="h1">{post.title}</Reveal>
        {post.coverImage ? (
          <Reveal className="post-cover">
            <div className="blob blobB">
              <PostImage src={post.coverImage} alt={post.title} sizes="(min-width: 900px) 820px, 100vw" priority />
            </div>
          </Reveal>
        ) : null}
        <Reveal className="prose post-body">
          <PostMarkdown source={post.content} />
        </Reveal>
      </div>
    </article>
  );
}
