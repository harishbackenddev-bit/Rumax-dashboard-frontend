// pages/InvestigatorTrialSupport.tsx
import React from "react";

import Hero from "@/components/website/services/investigator/Hero";
import LogoSection from "@/components/website/services/investigator/LogoSection";
import GridSection from "@/components/website/services/investigator/GridSection";
import ImageTextSection from "@/components/website/services/investigator/ImageTextSection";
import FAQSection from "@/components/website/services/investigator/FAQSection";
import SupportSection from "@/components/website/services/clinical/SupportSection";

// Import images
// (Update paths as needed)
import ecaImg from "/images/eca.png";
import cqcLogoImg from "/images/cqc-logo.png";
import nhsImg from "/images/nhs.png";
import icoImg from "/images/ico.png";
import isoImg from "/images/iso.png";
import cyberEssentialImg from "/images/cyber-essential.png";

function Investigator() {
  // Logo data
  const logos = [
    { src: ecaImg, alt: "ECA" },
    { src: cqcLogoImg, alt: "CQC" },
    { src: nhsImg, alt: "NHS" },
    { src: icoImg, alt: "ICO" },
    { src: isoImg, alt: "ISO" },
    { src: cyberEssentialImg, alt: "Cyber Essential" },
  ];

  // Items for "Reasons To Choose" section
  const reasonItems = [
    {
      icon: "/images/icon1.png",
      title: "Expert Research Staff",
      description:
        "We are CQC-registered, ISO 9001:2015-certified, ICH GCP E6 (R3)-compliant, NHS DSPT Standards Met, and ICO-registered for data protection. This ensures the highest standards of quality, safety, and regulatory compliance across all our services.",
    },
    {
      icon: "/images/icon2.png",
      title: "Flexible Trial Location Support",
      description:
        "Our nurses are experienced Registered Nurses with specialist clinical trial training, therapeutic area expertise, and up-to-date GCP certification. They act as a reliable extension of your site team.",
    },
    {
      icon: "/images/icon3.png",
      title: "Reduced Trial Location Workload",
      description:
        "We bring study visits directly to patients' homes, reducing the travel burden, increasing comfort, and making participation easier, especially for elderly, disabled, or remote patients.",
    },
    {
      icon: "/images/icon4.png",
      title: "Flexible and Agile Workforce",
      description:
        "By offering home-based visits, we expand the recruitment pool and significantly improve patient retention and protocol compliance, helping trials meet enrolment timelines.",
    },
    {
      icon: "/images/icon5.png",
      title: "Better Participant Retention",
      description:
        "Real-time data collection, accurate source documentation, and seamless integration with investigator sites and EDC systems ensure reliable, audit-ready data that meets sponsor and regulatory expectations.",
    },
    {
      icon: "/images/icon6.png",
      title: "24/7 Operational Support",
      description:
        "We provide flexible, reliable service across the UK, including major cities, regional, and rural areas, with quick scheduling and 24/7 support for patients and sites.",
    },
    {
      icon: "/images/icon7.png",
      title: "Regulatory and Data Protection Compliance",
      description:
        "Our ISO-certified processes, strong site coordination, and home-visit model reduce site burden while delivering better patient outcomes, often at a lower overall cost than traditional site-only models.",
    },
  ];

  // Items for "How It Works" section
  const howItWorksItems = [
    {
      icon: "/images/num1.png",
      title: "Project Assessment",
      description: "Initial consultation to understand trial requirements",
    },
    {
      icon: "/images/num2.png",
      title: "Feasibility Study",
      description: "Evaluate resource needs and geographic coverage",
    },
    {
      icon: "/images/num3.png",
      title: "Service Proposal",
      description: "Detailed proposal with timelines and costs",
    },
    {
      icon: "/images/num4.png",
      title: "Contracting",
      description: "Legal agreements and quality assurance setup",
    },
    {
      icon: "/images/num5.png",
      title: "Training & Setup",
      description: "Protocol training and system integration",
    },
  ];

  return (
    <div className="investigator-trial-page">
      <Hero />

      <LogoSection logos={logos} />

      <GridSection
        title="Our Mobile Research Nurse Capabilities"
        description="We provide highly trained mobile research nurses who act as a seamless extension of your investigator site team. Here are seven key capabilities we deliver to support your clinical trials:"
      />

      {/* Section 1: Image on Right */}
      <ImageTextSection
        title="How Our Site Support Nurses Ensure Regulatory Compliance"
        subtitle="Our site support nurses are fully trained to maintain the highest regulatory standards. They ensure:"
        imageSrc="/images/rt-img.png"
        imageAlt="Doctor with patient"
        imageLeft={false}  // Image on RIGHT
      />


      <GridSection
        title="Reasons To Choose Our Trial Location Support Services"
        description="We deliver exceptional mobile research nurse and home care services for clinical trials. Here's why sponsors, patients, and investigator sites choose us:"
        items={reasonItems}
        bgClass="grid2 bg-col"
      />

      <GridSection
        title="How It Works for Investigator Sites"
        items={howItWorksItems}
        bgClass="grid2 grid3"
      />

      {/* Section 2: Image on Left */}
      <ImageTextSection
        title="Care Meets Clinical Precision"
        subtitle="Our approach combines compassionate patient interaction with strict clinical accuracy, ensuring both participant comfort and study success."
        paragraphs={[
          "Every Rumax research nurse is trained to balance the human element of patient care with the rigorous demands of clinical trial protocols, creating an environment where participants feel valued while maintaining the highest standards of data integrity and regulatory compliance."
        ]}
        imageSrc="/images/right-docc.png"
        imageAlt="Doctor with patient"
        bgClass="hs-vs"
        imageLeft={true}  // Image on LEFT
      />

<LogoSection logos={logos} />

      <FAQSection />

      <SupportSection />
    </div>
  );
}

export default Investigator;