import { useSearchParams } from "react-router-dom";

import { CareCta } from "@/components/common/CareCta";
import LandingPage  from "./LandingPage";
import {
  ContactCards,
  InnerHero,
  MapBand,
  PageShell,
} from "@/components/pages/InnerPages";
import { TabbedAssessmentForm } from "@/components/pages/TabbedAssessmentForm";
import { contactMethods } from "@/data/pages";

export default function ContactPage() {
  const [searchParams] = useSearchParams();

  const activeTab =
    searchParams.get("enquiry") === "research"
      ? "research"
      : "care";

  return (
    <PageShell>
      <InnerHero
        className="inner-hero--domiciliary"
        title="Contact Us"
        description="Join a team where your work makes a real difference. Whether you're passionate about compassionate care or advancing medical research, we have opportunities for you."
        backgroundImage="rumax-office-hero.png"
        showScrollCue
      />

      <ContactCards items={contactMethods} />

     <LandingPage />
      
      <MapBand />


      <CareCta />
    </PageShell>
  );
}