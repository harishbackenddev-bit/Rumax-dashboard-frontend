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
      icon: "/images/logo20.png",
      title: "CQC Registration",
      description:
        "Fully regulated and compliant with all Care Quality Commission standards.",
    },
    {
      icon: "/images/logo21.png",
      title: "Trained Professionals",
      description:
        "All carers are DBS checked, fully trained, and experienced in person-centred care.",
    },
    {
      icon: "/images/logo22.png",
      title: "ISO9001-2015 Certified",
      description:
        "ISO 9001:2015 certification demonstrates our dedication to quality excellence. It ensures we have robust processes in place to consistently meet customer expectations, manage risks effectively, and drive continuous improvement across all operations.",
    },
    {
      icon: "/images/logo23.png",
      title: "ICH GCP E6(3) Compliant",
      description:
        "This demonstrates our commitment to international ethical and scientific standards for clinical trials, prioritising participant safety, data integrity, and high-quality trial conduct in line with the latest global requirements",
    },
    {
      icon: "/images/logo24.png",
      title: "Personalised Plans",
      description:
        "We are ICO registered for data protection. This reflects our legal compliance with the UK GDPR and our commitment to handling personal data responsibly, securely, and transparently.",
    },
    {
      icon: "/images/logo25.png",
      title: "24/7 Availability",
      description:
        "Our office team is always available to support you, your family, and our care team.",
    }
  ];

  const gridItems = items.length > 0 ? items : defaultItems;

  return (
<section className={`page-main-custom page-section grid-service clinic-m ${bgClass}`} style={{ color: "#fff !important;" }} >
      <div className="container">
        <div className="page-section__heading">
          <h2>{title}</h2>
          {/* <p>{description}</p> */}
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