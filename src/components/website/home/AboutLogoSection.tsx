// components/sections/LogoSection.tsx
import React from "react";

const asset = (path: string) => `/images/${path}`;

const AboutLogoSection = () => {
  const logos = [
    { src: "eca.png", alt: "ECA" },
    { src: "cqc-logo.png", alt: "CQC" },
    { src: "nhs.png", alt: "NHS" },
    { src: "ico.png", alt: "ICO" },
    { src: "iso.png", alt: "ISO" },
    { src: "cyber-essential.png", alt: "Cyber Essentials" },
  ];

  return (
    <div className="logo-main">
      <div className="container">
        <div className="inner-logos">
          <div className="left-logo-0">
            <h3>
              Our Compliance & accreditation
            </h3>
            <p>Rumax platform meets the highest certification standards for data security & 
privacy in healthcare, leveraging industry standards to secure data for our clients.</p>
          </div>
          <div className="right-logo-0">
            <div className="footer-certificates">
              {logos.map((logo) => (
                <div key={logo.alt} className="logo-foot">
                  <img src={asset(logo.src)} alt={logo.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutLogoSection;
