import React from 'react';
import { useState, useEffect } from "react";
import Hero from "@/components/website/home/Hero";
import LogoSection from "@/components/website/home/LogoSection";
import ImageTextSection from "@/components/website/home/ImageTextSection";
import GridSection from "@/components/website/home/GridSection";
import FormSection from "@/components/website/home/FormSection";
import TrustSection from "@/components/website/home/TrustSection";
import RichTextSection from "@/components/website/home/RichTextSection";
import { ServiceSwitchModal } from "@/components/ServiceSwitchModal";
function Home() {
  // Data for sections
  const section1Items = [
    "Investigational Medicinal Product Administration",
    "Sample Collection & Processing",
    "Clinical Assessments",
    "Adverse Events Assessments",
    "Collection of Study Data",
  ];

  const section2Items = [
    "Surge Capacity",
    "Day-to-Day Study Coordination",
    "Protocol Aligned Scheduling",
    "Clinical Procedure Delivery",
    "NHS & Multi-Site Integration",
  ];
  const [isSwitched, setIsSwitched] = useState(false);
 useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsSwitched(params.get("switched") === "true");
  }, []);
  return (
    <div className="test">
        {!isSwitched && (
        <ServiceSwitchModal message="You are currently on our Clinical Trials and Site Support Services. If you would like
            to switch to Care Support Services, please
            switch here." switchHref="https://rumax-second-frontend.vercel.app/?switched=true" />
      )}
      <Hero />
      <LogoSection />
      
      {/* Section 1 - Image on Right */}
      <ImageTextSection
        title="Bringing The Trial To The Patient: Decentralised & Hybrid Home Visits"
        subtitle="Remove logistical barriers and create a truly patient-centric trial experience"
        items={section1Items}
        buttonText="Explore Home Nursing Capabilities"
        imageSrc="right-doc.png"
        imageAlt="Doctor with patient"
        reverse={true}
      />
      
      {/* Section 2 - Image on Left */}
      <ImageTextSection
        title="Agile Operational Capacity for Overburdened Research Sites"
        subtitle="We embed qualified clinical research professionals into NHS, academic and commercial research sites"
        items={section2Items}
        buttonText="Get Site Support Today"
        imageSrc="doc-left.png"
        imageAlt="Doctor"
        bgClass="bg-hvs"
        reverse={false}
      />
      
      <GridSection />
      <FormSection />
      <TrustSection />
      <RichTextSection />
    </div>
  );
}

export default Home;
