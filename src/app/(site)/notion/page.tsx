import type { Metadata } from "next";
import { notion } from "@/content/notion";
import {
  Contract,
  Factors,
  Industry,
  NotionCta,
  NotionFaq,
  NotionHero,
  Plan,
  Problems,
  Process,
  Reasons,
} from "@/components/sections/notion/NotionSections";

export const metadata: Metadata = {
  title: notion.title,
  description: notion.hero.body.join(""),
};

export default function NotionPage() {
  return (
    <>
      <NotionHero />
      <Problems />
      <Reasons />
      <Plan />
      <Factors />
      <Industry />
      <Contract />
      <Process />
      <NotionFaq />
      <NotionCta />
    </>
  );
}
