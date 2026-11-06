import type { Metadata } from "next";
import { ArrowRight, BookOpen, Globe, Monitor, Users } from "lucide-react";
import { Reveal } from "@/components/flow/Reveal";
import { WaveMask } from "@/components/flow/WaveMask";
import { CtaRow, Eyebrow } from "@/components/layout/primitives";
import {
  HomeCta,
  HomeNews,
  HomePhilosophy,
  HomeProblems,
  HomeServices,
  HomeStats,
  HomeWhy,
} from "@/components/sections/home/HomeSections";
import { homeHero } from "@/content/home";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: { absolute: "ホーム / エンパワー＆リンク株式会社" },
  description: homeHero.body,
};

const ICONS = [Users, Globe, BookOpen, Monitor];

export default function HomePage() {
  const h = homeHero;
  const posts = getAllPosts().slice(0, 6);
  return (
    <>
      <section className="sec hero" id="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-t">
              <Eyebrow>{h.eyebrow}</Eyebrow>
              <Reveal as="h1">
                {h.heading[0]}
                <br />
                <em>{h.heading[1]}</em>
              </Reveal>
              <Reveal as="p" className="lead">
                {h.body}
              </Reveal>
              <CtaRow ctas={h.ctas} />
            </div>
            <Reveal className="hero-v">
              <WaveMask src="/images/hero/hero1.jpg" alt="富士山と五重塔" priority />
            </Reveal>
          </div>
          <Reveal as="ul" className="pills">
            {h.pills.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </Reveal>
          <div className="hcards">
            {h.items.map((it, i) => {
              const Icon = ICONS[i];
              return (
                <Reveal href={it.href} className="hcard" key={it.href}>
                  <Icon className="ic" strokeWidth={1.6} aria-hidden="true" />
                  <h3>{it.title}</h3>
                  <p>{it.body}</p>
                  <span className="go">
                    <ArrowRight className="ic" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <HomeStats />
      <HomeProblems />
      <HomeServices />
      <HomePhilosophy />
      <HomeWhy />
      <HomeNews posts={posts} />
      <HomeCta />
    </>
  );
}
