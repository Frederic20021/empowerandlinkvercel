import type { Metadata } from "next";
import { smartMensetsuEmbed, smartMensetsuHero } from "@/content/smart-mensetsu";
import { SmartEmbed, SmartHero } from "@/components/sections/smart-mensetsu/SmartMensetsuSections";

export const metadata: Metadata = {
  title: smartMensetsuEmbed.title,
  description: smartMensetsuHero.body.join(""),
};

export default function SmartMensetsuPage() {
  return (
    <>
      <SmartHero />
      <SmartEmbed />
    </>
  );
}
