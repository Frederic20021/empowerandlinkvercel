import type { Metadata } from "next";
import {
  CompanyAccess,
  CompanyCeo,
  CompanyCta,
  CompanyHero,
  CompanyInfo,
  CompanyVideo,
} from "@/components/sections/company/CompanySections";
import { companyHero, companyMeta } from "@/content/company";

export const metadata: Metadata = {
  title: companyMeta.title,
  description: `${companyHero.heading[0].replace(/<\/?em>/g, "")}${companyHero.heading[1]}`,
};

export default function CompanyPage() {
  return (
    <>
      <CompanyHero />
      <CompanyVideo />
      <CompanyCeo />
      <CompanyInfo />
      <CompanyAccess />
      <CompanyCta />
    </>
  );
}
