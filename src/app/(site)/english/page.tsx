import type { Metadata } from "next";
import { english } from "@/content/english";
import { Courses } from "@/components/sections/english/Courses";
import { Instructors } from "@/components/sections/english/Instructors";
import {
  CtaBand,
  EnglishContact,
  EnglishHero,
  FaqSection,
  PitchCta,
  Reason,
  Reasons4,
  Solution,
  VoiceSection,
  Worries,
} from "@/components/sections/english/PitchSections";

export const metadata: Metadata = {
  title: english.title,
  description: english.pitchHero.body,
};

export default function EnglishPage() {
  return (
    <>
      <EnglishHero />
      <PitchCta />
      <Worries />
      <Solution />
      <CtaBand />
      <Reason />
      <Reasons4 />
      <Instructors />
      <Courses />
      <VoiceSection />
      <FaqSection />
      <EnglishContact />
    </>
  );
}
