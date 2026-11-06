import type { Metadata } from "next";
import {
  RecruitmentCountries,
  RecruitmentCta,
  RecruitmentHero,
  RecruitmentProblems,
  RecruitmentProcess,
  RecruitmentServices,
  RecruitmentStats,
  RecruitmentVisas,
} from "@/components/sections/recruitment/RecruitmentSections";
import { recruitmentHero, recruitmentMeta } from "@/content/recruitment";

export const metadata: Metadata = {
  title: recruitmentMeta.title,
  description: recruitmentHero.body,
};

export default function RecruitmentPage() {
  return (
    <>
      <RecruitmentHero />
      <RecruitmentProblems />
      <RecruitmentServices />
      <RecruitmentStats />
      <RecruitmentVisas />
      <RecruitmentProcess />
      <RecruitmentCountries />
      <RecruitmentCta />
    </>
  );
}
