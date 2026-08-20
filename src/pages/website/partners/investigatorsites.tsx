// pages/InvestigatorTrialSupport.tsx
import React from "react";

import CroHero from "@/components/website/partners/CroHero";
import LogoSection from "@/components/website/services/clinical/LogoSection";
import ServiceOfferingBlock from "@/components/website/partners/ServiceOfferingBlock_second";
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
    question: 'What do your investigator site support nurses do at clinical trial sites?',
    answer: 'Our investigator site support nurses provide on-site clinical research delivery to strengthen NHS Trust and investigator site capacity. They support study visits, patient screening and consent processes, phlebotomy and sample processing, IMP administration, vital signs and ECGs, eCRF data entry, and source documentation. By embedding experienced research nurses directly within your site team, we help reduce backlogs, accelerate recruitment, and ensure GCP-compliant trial delivery without adding to your permanent headcount.'
  },
  {
    id: 'faq-2',
    question: ' Are your site support nurses NMC-registered and GCP-trained?',
    answer: 'Yes. All our clinical research nurses are NMC-registered, ICH-GCP trained, and experienced in delivering commercial and non-commercial studies at NHS and investigator sites. They hold enhanced DBS clearance, occupational health clearance, and protocol-specific training as required. We maintain documented competency records and CPD evidence, giving Trusts and sponsors a fully compliant, audit-ready research nursing workforce'
  },
  {
    id: 'faq-3',
    question: 'How quickly can you provide research nurses to support our site?',
    answer: 'We offer flexible, scalable research nurse resourcing with rapid mobilisation nationally across UK. Following a short capacity and requirements review, we can deploy site support nurses to cover peaks in workload, staff shortages, recruitment surges, or specific study demands. Our responsive staffing model helps sites maintain trial timelines and avoid recruitment delays caused by insufficient research staff.'
  },
  {
    id: 'faq-4',
    question: 'Can your nurses integrate with our existing R&D and site study teams?',
    answer: 'Yes. Our site support nurses are experienced in working within established NHS R&D departments and investigator site teams under the direction of the Principal Investigator. They follow your local SOPs, governance processes, and delegation logs, integrating seamlessly to extend your existing capacity. This collaborative approach ensures continuity of care, consistent data quality, and smooth study delivery alongside your substantive staff.'
  },
  {
    id: 'faq-5',
    question: 'What types of studies and therapy areas can your site support nurses cover?',
    answer: 'Our research nurses support a broad range of clinical trials across multiple phases and therapy areas, including complex and specialist studies. We can provide nurses with relevant experience to match your protocol requirements, whether for routine study visits, intensive PK sampling, or specialist nursing needs. This flexibility helps Trusts and sites take on a wider portfolio of commercial and academic research.'
  },
  {
    id: 'faq-6',
    question: 'How do you ensure quality, governance, and regulatory compliance for site-based nursing?',
    answer: 'We operate as a CQC-registered, ISO 9001:2015-certified provider with a robust quality management system, comprehensive SOPs, and full GCP alignment. Our nurses work within your sites governance framework while we maintain oversight of training, competency, revalidation, and compliance. This dual assurance gives NHS Trusts and investigator sites confidence that our site support nursing service meets MHRA expectations and UK clinical research regulatory standards.'
  }
];

function Investigatorsites() {
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
      <section className="hero-main-custom">
      <div className="hero">
        <div className="container">
          <div className="hero-content">

            <h1>Investigator Site & NHS Trust</h1>

            <h3>
             Protecting site capacity, continuity, and data quality.
            </h3>

            <div className="hero-badges">

              <div className="hero-badge">
                <div className="hero-badge-icon">
                  ✓
                </div>
                <div className="hero-badge-content">
                  <h4>NMC Registered Nurses</h4>
                </div>
              </div>

              <div className="hero-badge">
                <div className="hero-badge-icon">
                  ✓
                </div>
                <div className="hero-badge-content">
                  <h4>GCP Certified</h4>
                </div>
              </div>

              <div className="hero-badge">
                <div className="hero-badge-icon">
                  ✓
                </div>
                <div className="hero-badge-content">
                  <h4>HRA-Aligned</h4>
                </div>
              </div>

              <div className="hero-badge">
                <div className="hero-badge-icon">
                  ✓
                </div>
                <div className="hero-badge-content">
                  <h4>UK-wide</h4>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="hero-stats">

        <div className="hero-stat">
          <h2>15+</h2>
          <p>Years In Clinical-Trials Homecare</p>
        </div>

        <div className="hero-stat">
          <h2>1000+</h2>
          <p>Home Visits</p>
        </div>

        <div className="hero-stat">
          <h2>12+</h2>
          <p>NHS Trusts</p>
        </div>

        <div className="hero-stat">
          <h2>6</h2>
          <p>Milestone Onboarding Stages</p>
        </div>

        <div className="hero-stat">
          <h2>UK</h2>
          <p>Nationwide</p>
        </div>

      </div>
    </section>

      <LogoSection logos={logos} />
      <ServiceOfferingBlock />
<GridSection
  title="An extension of your study team, not a transactional supplier.   "
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

export default Investigatorsites;
