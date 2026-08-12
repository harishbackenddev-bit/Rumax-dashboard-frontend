// components/website/home/ImageTextSection.tsx
import React from "react";

interface ImageTextSectionProps {
  title?: string;
  subtitle?: string;
  items?: string[];
  buttonText?: string;
  imageSrc?: string;
  imageAlt?: string;
  bgClass?: string;
  reverse?: boolean;
}

const ImageTextSection: React.FC<ImageTextSectionProps> = ({
  title = "Bringing The Trial To The Patient: Decentralised & Hybrid Home Visits",
  subtitle = "Remove logistical barriers and create a truly patient-centric trial experience",
  items = [
    "Investigational Medicinal Product Administration",
    "Sample Collection & Processing",
    "Clinical Assessments",
    "Adverse Events Assessments",
    "Collection of Study Data",
  ],
  buttonText = "Explore Home Nursing Capabilities",
  imageSrc = "right-doc.png",
  imageAlt = "Doctor with patient",
  bgClass = "",
  reverse = false,
}) => {
  const asset = (path: string) => `/images/${path}`;

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#12086F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12L11 14L15 10" stroke="#12086F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <section className={`hvs-section hvs-main-cst ${bgClass}`}>
      <div className="container">
        <div className={`inner-hvs-sec${reverse ? ' reverse' : ''}`}>
          {!reverse && (
            <div className="hvs-visual img">
              <img src={asset(imageSrc)} alt={imageAlt} />
            </div>
          )}
          <div className="hvs-content">
            <h2>{title}</h2>
            <p className="hvs-subtext">{subtitle}</p>
            <ul className="hvs-list">
              {items.map((item, index) => (
                <li key={index}>
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
            <button className="trial-btn">{buttonText}</button>
          </div>
          {reverse && (
            <div className="hvs-visual img">
              <img src={asset(imageSrc)} alt={imageAlt} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImageTextSection;