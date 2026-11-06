import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, BookOpen, Droplet, Globe, Lightbulb, Monitor, Users } from "lucide-react";
import { CountUp } from "@/components/flow/CountUp";
import { Reveal } from "@/components/flow/Reveal";
import { RiverSteps } from "@/components/flow/RiverSteps";
import { Tributaries } from "@/components/flow/Tributaries";
import { CtaRow, SectionHead } from "@/components/layout/primitives";
import { Hl } from "@/components/sections/inline-text";
import { homeBlog, homeCta, homePhilosophy, homeProblems, homeServices, homeStats, homeWhy } from "@/content/home";
import type { BlogPost } from "@/lib/blog";
import { CtaBand } from "./CtaBand";

const SERVICE_ICONS = [Users, Globe, BookOpen, Monitor];
const PHILOSOPHY_ICONS = [Lightbulb, Building2, Globe];

export function HomeStats() {
  return (
    <section className="sec stats" id="stats">
      <div className="wrap">
        <ul className="stat-row">
          {homeStats.items.map((it) => (
            <Reveal as="li" className="stat" key={it.label}>
              <div className="stat-n">
                <CountUp end={Number(it.num)} />
                <sup>{it.sup}</sup>
              </div>
              <p>{it.label}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HomeProblems() {
  const p = homeProblems;
  return (
    <section className="sec tint" id="problems">
      <div className="wrap">
        <div className="split-head">
          <SectionHead eyebrow={p.eyebrow}>
            こんな<span className="hl">お悩み</span>、<br />
            ありませんか？
          </SectionHead>
          <Reveal>
            <p className="lead">{p.body}</p>
            <CtaRow ctas={p.ctas} />
          </Reveal>
        </div>
        <ul className="pebbles">
          {p.items.map((it) => (
            <Reveal as="li" className="pebble" key={it.text}>
              <Droplet className="ic" strokeWidth={1.6} aria-hidden="true" />
              <p>{it.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HomeServices() {
  const s = homeServices;
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <SectionHead eyebrow={s.eyebrow} sub={s.subheading} center>
          <Hl text={s.heading} sub="企業と人材をつなぐ" />
        </SectionHead>
        <Tributaries count={s.items.length}>
          {s.items.map((it, i) => {
            const Icon = SERVICE_ICONS[i];
            return (
              <Reveal as="article" className="svc" data-i={i} key={it.title}>
                <Link className="svc-in" href={it.cta.href}>
                  <span className="svc-n">{it.num}</span>
                  <span className="svc-ic">
                    <Icon className="ic" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3>{it.title}</h3>
                  <p>{it.body}</p>
                  <ul className="tags">
                    {it.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <span className="go">
                    {it.cta.label.replace(" →", "")}
                    <ArrowRight className="ic" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </Tributaries>
      </div>
    </section>
  );
}

export function HomePhilosophy() {
  const p = homePhilosophy;
  return (
    <section className="sec tint" id="philosophy">
      <div className="wrap">
        <SectionHead eyebrow={p.eyebrow} sub={p.subheading} center>
          {p.heading}
        </SectionHead>
        <div className="stops">
          <svg className="stops-svg" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
            <path className="p0" d="M0,40 C150,0 250,80 400,40 S650,0 800,40 S950,70 1000,40" />
            <path className="p1" d="M0,40 C150,10 250,70 400,40 S650,10 800,40 S950,60 1000,40" />
            <path className="p2" d="M0,40 C150,20 250,60 400,40 S650,20 800,40 S950,50 1000,40" />
          </svg>
          <ol>
            {p.items.map((it, i) => {
              const Icon = PHILOSOPHY_ICONS[i];
              return (
                <Reveal as="li" className="stop" key={it.title}>
                  <span className="node">
                    <Icon className="ic" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3>{it.title}</h3>
                  <p>{it.body}</p>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function HomeWhy() {
  const w = homeWhy;
  return (
    <section className="sec" id="why">
      <div className="wrap">
        <SectionHead eyebrow={w.eyebrow} sub={w.subheading} center>
          <Hl text={w.heading} sub="4つの理由" />
        </SectionHead>
        <RiverSteps
          items={w.items.map((it) => ({
            node: it.num,
            children: (
              <>
                <h3>{it.title}</h3>
                <p>{it.body}</p>
              </>
            ),
          }))}
        />
      </div>
    </section>
  );
}

function PostCover({ src, title }: { src: string; title: string }) {
  if (src.startsWith("/images/")) {
    return <Image src={src} alt={title} fill sizes="(min-width: 900px) 33vw, 100vw" />;
  }
  if (src.startsWith("https://raw.githubusercontent.com/")) {
    // eslint-disable-next-line @next/next/no-img-element -- remote GitHub raw image, not in the optimizer allowlist
    return <img src={src} alt={title} loading="lazy" decoding="async" />;
  }
  return null;
}

export function HomeNews({ posts }: { posts: BlogPost[] }) {
  const b = homeBlog;
  return (
    <section className="sec tint" id="blog">
      <div className="wrap">
        <div className="split-head">
          <SectionHead eyebrow={b.eyebrow} sub={b.subheading}>
            <Hl text={b.heading} sub="お知らせ" />
          </SectionHead>
          <CtaRow ctas={b.ctas.map((c) => ({ ...c, href: c.href.replace(/\/$/, "") }))} />
        </div>
        <div className="posts">
          {posts.map((post) => (
            <Reveal as="article" className="post" key={post.slug}>
              <Link href={`/blog/${post.slug}`}>
                <div className="post-img relative">
                  <PostCover src={post.coverImage} title={post.title} />
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
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCta() {
  return <CtaBand id="cta" eyebrow={homeCta.eyebrow} heading={homeCta.heading} body={homeCta.body} ctas={homeCta.ctas} />;
}
