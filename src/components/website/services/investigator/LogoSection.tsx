// components/website/investigator/LogoSection.tsx
import React from "react";

interface LogoSectionProps {
  title?: string;
  logos?: { src: string; alt: string }[];
}

const LogoSection: React.FC<LogoSectionProps> = ({
  title = "Our Compliance & accreditation",
  desc = "Rumax platform meets the highest certification standards for data security & privacy in healthcare, leveraging industry standards to secure data for our clients.",
  logos = [
    { src: "eca.png", alt: "ECA" },
    { src: "cqc-logo.png", alt: "CQC" },
    { src: "nhs.png", alt: "NHS" },
    { src: "ico.png", alt: "ICO" },
    { src: "iso.png", alt: "ISO" },
    { src: "cyber-essential.png", alt: "Cyber Essential" },
  ],
}) => {
  return (
    <div className="logo-main">
      <div className="container">
        <div className="inner-logos">
          <div className="left-logo-0">
            <h3>{title}</h3>
              <p>{desc}</p>
          </div>
          <div className="right-logo-0">
            <div className="footer-certificates">
              {logos.map((logo, index) => (
                <div className="logo-foot" key={index}>
                  <img src={logo.src} alt={logo.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoSection;
