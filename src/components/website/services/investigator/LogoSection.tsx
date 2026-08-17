// components/website/investigator/LogoSection.tsx
import React from "react";

interface LogoSectionProps {
  title?: string;
  subtitle?: string;
  logos?: { src: string; alt: string }[];
}

const LogoSection: React.FC<LogoSectionProps> = ({
  title = "Our Compliance & Accreditation",
  subtitle = "Rumax platform meets the highest certification standards for data security & privacy in healthcare, leveraging industry standards to secure data for our clients.",
  logos = [
    { src: "ceca.png", alt: "CECA" },
    { src: "cqc-logo.png", alt: "Care Quality Commission" },
    { src: "nhs.png", alt: "NHS" },
    { src: "ico.png", alt: "ICO" },
    { src: "iso-9001.png", alt: "ISO 9001:2015" },
  ],
}) => {
  return (
    <section className="compliance-section">
      <div className="container">
        <div className="compliance-header">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="compliance-logos">
          {logos.map((logo, index) => (
            <div className="logo-item" key={index}>
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoSection;
