import type { Metadata } from "next";
import { japanese } from "@/content/japanese";
import {
  Challenges,
  JapaneseCta,
  JapaneseHero,
  JapaneseServices,
  Professors,
  Recommended,
} from "@/components/sections/japanese/JapaneseSections";

export const metadata: Metadata = {
  title: japanese.title,
  description: japanese.hero.body,
};

export default function JapanesePage() {
  return (
    <>
      <JapaneseHero />
      <Challenges />
      <Recommended />
      <Professors />
      <JapaneseServices />
      <JapaneseCta />
    </>
  );
}
