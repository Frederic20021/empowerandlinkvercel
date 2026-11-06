import type { Metadata } from "next";
import { Eyebrow } from "@/components/layout/primitives";
import { Reveal } from "@/components/flow/Reveal";
import { PostCard } from "@/components/blog/PostCard";
import { getAllPosts } from "@/lib/blog";

const TITLE = "お知らせ";
const LEAD = "エンパワー＆リンクの最新情報をご紹介します。";

export const metadata: Metadata = {
  title: TITLE,
  description: LEAD,
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  return (
    <>
      <section className="sec phero" id="hero">
        <div className="wrap">
          <Eyebrow>Blog / News</Eyebrow>
          <Reveal as="h1">{TITLE}</Reveal>
          <Reveal as="p" className="lead">
            {LEAD}
          </Reveal>
        </div>
      </section>
      <section className="sec" id="list">
        <div className="wrap">
          <div className="posts big">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
