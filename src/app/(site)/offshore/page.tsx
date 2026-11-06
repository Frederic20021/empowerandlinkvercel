import type { Metadata } from "next";
import { offshore } from "@/content/offshore";
import {
  CaseSection,
  FlowSection,
  OffshoreContact,
  OffshoreHero,
  Pains,
  PricePlan,
  ReasonsSection,
  ServiceSection,
} from "@/components/sections/offshore/OffshoreSections";

export const metadata: Metadata = {
  title: offshore.title,
  description: offshore.pitch1Hero.body_joined,
};

export default function OffshorePage() {
  return (
    <>
      <OffshoreHero />
      <Pains />
      <ReasonsSection />
      <ServiceSection />
      <CaseSection />
      <FlowSection />
      <PricePlan />
      <OffshoreContact />
    </>
  );
}
