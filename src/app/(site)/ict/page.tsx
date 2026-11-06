import type { Metadata } from "next";
import { ict } from "@/content/ict";
import {
  AiBlock,
  FlowBar,
  IctCta,
  IctHero,
  NotionBlock,
  OffshoreBlock,
} from "@/components/sections/ict/IctSections";

export const metadata: Metadata = {
  title: ict.title,
  description: ict.hero.body.join(""),
};

export default function IctPage() {
  return (
    <>
      <IctHero />
      <FlowBar />
      <NotionBlock />
      <AiBlock />
      <OffshoreBlock />
      <IctCta />
    </>
  );
}
