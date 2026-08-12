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
  title = "Clinical trials homecare capabilities",
  description = "Our registered nurses deliver the full range of homecare procedures specified in sponsor protocols, supported by rigorous governance, competency assurance, and sponsor-grade documentation at every visit.",
  items = [],
  bgClass = "text-white",
}) => {
  const defaultItems = [
    {
      icon: "/images/logo11.png",
      title: "Mobile Clinical Nursing Visits",
      description:
        "Protocol-compliant home visits across all phases I–IV. Vital signs, physical assessments, concomitant medication review, and contemporaneous ALCOA+ source data documentation.",
    },
    {
      icon: "/images/logo12.png",
      title: "Phlebotomy & Sample Management",
      description:
        "Venepuncture and blood draw for PK, PD, safety, and biomarker samples. On-site centrifugation, cold chain packaging, IATA-compliant shipment, and full chain of custody documentation.",
    },
    {
      icon: "/images/logo13.png",
      title: "IMP Administration",
      description:
        "Subcutaneous, intramuscular, and intravenous investigational medicinal product administration. Full IMP accountability, dispensing records, and reconciliation documentation at each visit.",
    },
    {
      icon: "/images/logo14.png",
      title: "ECG Recording",
      description:
        "12-lead ECG recording in the patient home using calibrated, maintained equipment in accordance with sponsor-defined procedures and equipment qualification requirements.",
    },
    {
      icon: "/images/logo15.png",
      title: "Adverse Event Monitoring & Patient Safety",
      description:
        "AE identification, documentation, and escalation to investigative site and sponsor in accordance with protocol timelines. 24-hour on-call clinical escalation pathway for all active studies.",
    },
    {
      icon: "/images/logo16.png",
      title: "Site Augmentation",
      description:
        "Provision of qualified clinical trial nurses to augment investigator site capacity, supporting site teams with protocol-delegated tasks in a clinical setting.",
    },
    {
      icon: "/images/logo17.png",
      title: "Study Coordination",
      description:
        "Country coordination, POF/SRF management, study-specific guidelines development, study tracker oversight, and sponsor-facing quality reporting aligned to agreed KPI frameworks.",
    },
        {
      icon: "/images/logo18.png",
      title: "Protocol Feasibility Assessment",
      description:
        "Structured 10-stage feasibility process covering clinical procedure review, IMP assessment, sample handling, geographic coverage, equipment qualification, and formal go/no-go decision.",
    },
        {
      icon: "/images/logo19.png",
      title: "Nurse Training & Competency",
      description:
        "Study-specific training programmes, formal competency assessments, Study Clearance Records for every nurse, and ongoing clinical supervision throughout the study lifecycle. ICH GCP and IATA training",
    },
  ];

  const gridItems = items.length > 0 ? items : defaultItems;

  return (
<section className={`page-main-custom page-section grid-service clinic-main ${bgClass}`} style={{ color: "#fff !important;" }} >
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