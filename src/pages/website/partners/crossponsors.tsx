// pages/InvestigatorTrialSupport.tsx
import React from "react";

import CroHero from "@/components/website/partners/CroHero";
import LogoSection from "@/components/website/services/clinical/LogoSection";
import ServiceOfferingBlock from "@/components/website/partners/ServiceOfferingBlock";
import OnboardingProcess from "@/components/website/partners/OnboardingProcess";
import FAQSection from '@/components/website/partners/FAQSection';
import GridSection from "@/components/website/partners/GridSection";


// Import images
// (Update paths as needed)
import ecaImg from "/images/eca.png";
import cqcLogoImg from "/images/cqc-logo.png";
import nhsImg from "/images/nhs.png";
import icoImg from "/images/ico.png";
import isoImg from "/images/iso.png";
import cyberEssentialImg from "/images/cyber-essential.png";



const myFaqs = [
  {
    id: 'faq-1',
    question: 'Do you provide clinical trials homecare services on behalf of global vendors and partner organisations?',
    answer: 'Rumax provides national coverage across England and Wales. We offer a single contracting and oversight point, which significantly reduces the vendor-management burden for sponsors and CROs.'
  },
  {
    id: 'faq-2',
    question: 'How do you ensure consistency with our protocols, SOPs, and branding?',
    answer: 'We work flexibly to align with your operating model, delivering services in accordance with your study protocols, SOPs, work instructions, and quality standards. Our research nurses are trained to follow vendor-specific requirements while we maintain robust internal governance and oversight. This ensures a consistent, white-label homecare service that reflects your processes and protects the integrity of your sponsor and CRO relationships..'
  },
    {
    id: 'faq-3',
    question: 'Are you CQC-registered and ISO-certified for UK delivery?',
    answer: 'Yes. We are a CQC-registered healthcare provider and hold ISO 9001:2015 certification, giving global vendors assurance that UK homecare delivery meets local regulatory, quality, and patient safety standards. Our governance framework supports MHRA expectations and GCP compliance, and we are experienced in vendor qualification, providing the documentation and evidence partners need for due diligence and audit readiness.'
  },
    {
    id: 'faq-4',
    question: 'What UK coverage and nursing capacity can you offer as a subcontracted partner?',
    answer: 'We provide nationwide coverage across UK with scalable research nursing capacity, including specialist and registered mental health nurses (RMNs) for complex studies. Our flexible resourcing model allows global vendors to mobilise quickly for new studies, manage recruitment peaks, and expand into UK regions, all delivered through one reliable local partner with established study management infrastructure.'
  },
    {
    id: 'faq-5',
    question: 'How do you handle communication, reporting, and study oversight with vendor partners?',
    answer: 'We provide dedicated study management and a single point of contact to ensure clear, timely communication with our vendor partners. Our team delivers structured reporting on visit completion, scheduling, compliance, and any deviations or adverse events, integrating with your project management and oversight processes. This transparency gives global vendors confidence that UK delivery is closely managed and fully accountable.'
  },
    {
    id: 'faq-6',
    question: 'How do you manage data protection, IMP handling, and regulatory compliance in the UK?',
    answer: 'We comply with UK GDPR and Data Protection Act requirements, validated cold-chain logistics, and GCP-aligned IMP handling, ensuring secure data management and product integrity throughout delivery. Our quality management system, comprehensive SOPs, and pharmacovigilance and adverse event reporting processes ensure full regulatory compliance, allowing global vendors to subcontract UK homecare delivery with confidence in patient safety and data integrity.'
  },
];

function CroSponsors() {
  // Logo data
  const logos = [
    { src: ecaImg, alt: "ECA" },
    { src: cqcLogoImg, alt: "CQC" },
    { src: nhsImg, alt: "NHS" },
    { src: icoImg, alt: "ICO" },
    { src: isoImg, alt: "ISO" },
    { src: cyberEssentialImg, alt: "Cyber Essential" },
  ];

  const clinicalCapabilities = [
  {
    icon: "/images/logo26.png",
    description:
      "A named study management and operational point of contact for every engagement, supported by our Country Study Manager function.",
  },
  {
    icon: "/images/logo27.png",
    description:
      "Activity delivered under the sponsor/CRO protocol, the site delegation log, and Rumax SOPs — with clear lines of medical and clinical oversight.",
  },
  {
    icon: "/images/logo28.png",

    description:
      "Quality and performance reporting against agreed KPIs (visit completion, visit-window adherence, deviation rates, and timelines).",
  },
  {
    icon: "/images/logo29.png",
    description:
      "Deviation, incident, and CAPA management handled within our ISO 9001:2015 QMS and reported in line with GCP and your pharmacovigilance requirements.",
  },
  {
    icon: "/images/logo30.png",
    description:
      "Audit and inspection readiness as standard, including documented training records, competency evidence, and a maintained QMS index.",
  },
  {
    icon: "/images/logo31.png",
    description:
      "Our long-standing relationships with major CROs reflect this approach — Rumax has supported research delivery partners since 2013.",
  },
];

  return (
    <div className="investigator-trial-page">
      <CroHero />

      <LogoSection logos={logos} />
      <ServiceOfferingBlock />
<GridSection
  title="An extension of your study team, not a transactional supplier."
  description="We position ourselves as an extension of your study team, not a transactional supplier. Our partnership model is built on delegated oversight, 
transparent quality reporting, and a relationship that scales from a single site to a national programme."
  items={clinicalCapabilities}
/>


      <OnboardingProcess />
      <FAQSection
        title="Frequently Asked Questions"
        faqs={myFaqs}
        defaultOpenIndex={0}
      />
    </div>
  );
}

export default CroSponsors;