import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/flow/Reveal";
import type { BlogPost } from "@/lib/blog";
import { PostImage } from "./PostImage";
import "./blog.css";

/** `<article class="post rv">` card used by the blog index (and available to the home news strip). */
export function PostCard({ post }: { post: Pick<BlogPost, "slug" | "title" | "date" | "excerpt" | "coverImage"> }) {
  return (
    <Reveal as="article" className="post">
      <Link href={`/blog/${post.slug}`}>
        <div className="post-img">
          <PostImage src={post.coverImage} alt={post.title} sizes="(min-width: 1100px) 360px, (min-width: 700px) 50vw, 100vw" />
        </div>
        <div className="post-b">
          <time dateTime={post.date}>{post.date}</time>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <span className="more">
            続きを読む
            <ArrowRight className="ic" strokeWidth={1.6} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
