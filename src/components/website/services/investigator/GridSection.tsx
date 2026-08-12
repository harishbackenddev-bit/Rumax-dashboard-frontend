// components/website/investigator/GridSection.tsx
import React from "react";

interface GridItem {
  icon: string;
  title: string;
  description: string;
}

interface GridSectionProps {
  title?: string;
  description?: string;
  items?: GridItem[];
  bgClass?: string;
}

const GridSection: React.FC<GridSectionProps> = ({
  title = "Our Mobile Research Nurse Capabilities",
  description = "We provide highly trained mobile research nurses who act as a seamless extension of your investigator site team. Here are seven key capabilities we deliver to support your clinical trials:",
  items = [],
  bgClass = "",
}) => {
  const defaultItems = [
    {
      icon: "/images/logo1.png",
      title: "Patient Screening & Recruitment Support",
      description:
        "Our nurses assist with community-based pre-screening, medical record review, and home-based eligibility assessments. This helps expand your recruitment pool and accelerate enrolment without adding burden to your site staff.",
    },
    {
      icon: "/images/logo2.png",
      title: "Home-Based Study Visits & Protocol Procedures",
      description:
        "We perform complete or hybrid study visits at the patient's home, including vital signs, blood sampling, ECGs, investigational product administration, and other protocol-specific assessments — all conducted in accordance with ICH GCP E6 (R3) standards.",
    },
    {
      icon: "/images/logo3.png",
      title: "Patient Education & Informed Consent",
      description:
        "Our nurses deliver clear, patient-friendly study information and reinforce the informed consent process. They ensure that patients fully understand the trial requirements, thereby improving comprehension and long-term engagement.",
    },
    {
      icon: "/images/logo4.png",
      title: "High-Quality Data Collection & Documentation",
      description:
        "Real-time collection of clinical data using validated electronic systems, with immediate source documentation completed during the visit. Data is securely shared with your site team for timely investigator review and EDC entry.",
    },
    {
      icon: "/images/logo5.png",
      title: "Adverse Event Monitoring & Patient Safety",
      description:
        "Proactive safety monitoring during home visits, with prompt identification, management, and escalation of adverse events to the principal investigator in accordance with protocol and regulatory requirements.",
    },
    {
      icon: "/images/logo6.png",
      title: "Patient Retention & Compliance Support",
      description:
        "By offering convenient home visits, our nurses reduce travel burden, build strong patient relationships, and significantly improve visit compliance and retention rates.",
    },
    {
      icon: "/images/logo7.png",
      title: "Seamless Site Coordination & Communication",
      description:
        "We work as an integrated part of your site team — providing detailed visit reports within 24 hours, maintaining clear communication channels, and always ensuring full visibility and oversight for the investigator.",
    },
  ];

  const gridItems = items.length > 0 ? items : defaultItems;

  return (
    <section className={`page-main-custom page-section grid-service grid-main-cst ${bgClass}`}>
      <div className="container">
        <div className="page-section__heading">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="info-grid info-grid--three">
          {gridItems.map((item, index) => (
            <article className="info-card" key={index}>
              <div className="bottom-grid-area">
                <div className="info-card__icon info-card__icon--blue">
                  <img src={item.icon} alt="" />
                </div>
                <div className="h3-bottom">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GridSection;