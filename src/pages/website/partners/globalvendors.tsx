// pages/InvestigatorTrialSupport.tsx
import React from "react";

import GlobalHero from "@/components/website/partners/GlobalHero";
import LogoSection from "@/components/website/services/clinical/LogoSection";
import ServiceOfferingBlock from "@/components/website/partners/ServiceOfferingBlock_third";
import OnboardingProcess from "@/components/website/partners/OnboardingProcess_second";
import FAQSection from '@/components/website/partners/FAQSection';
import GridSection from "@/components/website/partners/GridSection";
import TrialSupportForm from "@/components/website/services/clinical/TrialSupportForm";

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
    question: 'What clinical trials homecare services do you provide across the UK?',
    answer: 'We deliver nationwide clinical trials homecare and decentralised clinical trial (DCT) support across England and Wales, including in-home and community-based visits by qualified research nurses. Our services cover study drug administration, IMP handling, phlebotomy and sample collection, vital signs monitoring, patient assessments, and ePRO support. We work flexibly with CROs and sponsors to bring trial activities directly to participants homes, improving recruitment, retention, and patient-centric trial delivery.'
  },
  {
    id: 'faq-2',
    question: 'Are your research nurses GCP-trained and appropriately qualified?',
    answer: 'Yes. All our nurses are NMC-registered, ICH-GCP trained, and experienced in clinical research delivery. We maintain a robust competency and training framework with documented evidence of qualifications, ongoing CPD, and protocol-specific training. Our staff are vetted with enhanced DBS checks and occupational health clearance, ensuring sponsors and CROs receive a fully compliant, audit-ready homecare nursing workforce.'
  },
  {
    id: 'faq-3',
    question: 'Are you CQC-registered and ISO-certified?',
    answer: 'Yes. We are a CQC-registered healthcare provider and hold ISO 9001:2015 certification for our quality management system. This means our clinical trials homecare delivery meets rigorous UK regulatory, quality, and patient safety standards. Our governance framework supports MHRA expectations, GCP compliance, and full audit readiness for sponsor and CRO vendor qualification.'
  },
  {
    id: 'faq-4',
    question: 'How do you handle cold-chain logistics and investigational medicinal product (IMP) management?',
    answer: 'We follow validated cold-chain logistics processes to ensure temperature-sensitive investigational medicinal products (IMPs) are stored, transported, and administered within required parameters. Our procedures cover temperature monitoring, excursion management, secure handling, and full chain-of-custody documentation, ensuring IMP integrity from receipt through to in-home administration in line with GCP and MHRA standards.'
  },
  {
    id: 'faq-5',
    question: 'How quickly can you set up and deliver a homecare clinical trial study?',
    answer: 'Our experienced study management team can rapidly mobilise homecare resource following feasibility assessment and study set-up. We provide nationwide coverage with scalable nursing capacity, enabling fast site activation, patient scheduling, and visit delivery. Our streamlined onboarding, protocol training, and quality processes support sponsors and CROs in meeting recruitment timelines and reducing patient burden.'
  },
  {
    id: 'faq-6',
    question: 'How do you ensure patient safety, data integrity, and regulatory compliance?',
    answer: 'Patient safety and data integrity are central to our clinical trials homecare service. We operate under a CQC-registered, ISO 9001:2015-certified quality management system with comprehensive SOPs, robust pharmacovigilance and adverse event reporting, source data verification support, and secure documentation practices. Our GCP-compliant governance ensures every home visit is delivered safely, accurately, and in full alignment with sponsor protocols and UK regulatory requirements.'
  },
];

function Globalvendors() {
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
        "Joint solution design: we map where Rumax nursing integrates with your logistics, technology, or laboratory service.",
    },
    {
      icon: "/images/logo27.png",
      description:
        "Aligned SOPs and interfaces, so handovers (sample, IMP, data) are controlled and traceable on both sides.",
    },
    {
      icon: "/images/logo28.png",

      description:
        "Shared quality language: as an ISO 9001:2015-certified organisation we speak to your QMS in terms your quality team recognises.",
    },
    {
      icon: "/images/logo29.png",
      description:
        "A single accountable UK clinical partner, simplifying your sponsor-facing proposition and due-diligence story.",
    },
    {
      icon: "/images/logo30.png",
      description:
        "Rumax understands HRA approvals, the site delegation log, local R&D processes, and NMC professional standards. We slot into existing site governance rather than asking sites to work around us.",
    },
  ];

  return (
    <div className="investigator-trial-page">
      <GlobalHero />

      <LogoSection logos={logos} />
      <ServiceOfferingBlock />
      <GridSection
        title="A complete UK solution without building a nursing infrastructure of your own."
        description="We act as the clinical complement to your service — white-label or co-branded as agreed — so you can offer a complete UK solution without building a nursing infrastructure of your own."
        items={clinicalCapabilities}
      />


      <OnboardingProcess />

      {/* Add the form before FAQ section */}
      <section className="page-main-form page-section  Step-form global-section ">
        <div className="container">
          <div className="page-section__heading">
            <h2> Start Your Clinical Trial Support Journey</h2>
            <p>Tell us about your study and schedule a consultation with our mobile research team.</p>
          </div>

          <TrialSupportForm />
        </div>
      </section>


      <FAQSection
        title="Frequently Asked Questions"
        faqs={myFaqs}
        defaultOpenIndex={0}
      />
    </div>
  );
}

export default Globalvendors;