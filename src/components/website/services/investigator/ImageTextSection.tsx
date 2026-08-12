// components/website/investigator/ImageTextSection.tsx
import React from "react";

interface GridItem {
  icon: string;
  title: string;
  description: string;
}

interface ImageTextSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: GridItem[];
  buttonText?: string;
  imageSrc?: string;
  imageAlt?: string;
  reverse?: boolean;
  bgClass?: string;
  heading?: string;
  paragraphs?: string[];
  showButtons?: boolean;
  imageLeft?: boolean; // true = image on left, false = image on right
}

const ImageTextSection: React.FC<ImageTextSectionProps> = ({
  title = "How Our Site Support Nurses Ensure Regulatory Compliance",
  subtitle = "Our site support nurses are fully trained to maintain the highest regulatory standards. They ensure:",
  description = "",
  items = [],
  buttonText = "",
  imageSrc = "/images/rt-img.png",
  imageAlt = "Doctor with patient",
  reverse = false,
  bgClass = "",
  heading = "",
  paragraphs = [],
  showButtons = false,
  imageLeft = true, // Default: image on left
}) => {
  // Default items for regulatory compliance
  const defaultItems = [
    {
      icon: "/images/site1.png",
      title: "Full ICH GCP E6 (R3) Adherence",
      description:
        "All activities are conducted in strict accordance with ICH Good Clinical Practice guidelines, including correct protocol execution, essential documentation, and ethical trial conduct.",
    },
    {
      icon: "/images/site2.png",
      title: "Accurate & Timely Source Documentation",
      description:
        "Real-time completion of source documents during visits, ensuring ALCOA+ principles are followed for data integrity, completeness, and audit readiness.",
    },
    {
      icon: "/images/site3.png",
      title: "Robust Patient Safety & Adverse Event Reporting",
      description:
        "Proactive monitoring, immediate identification, and proper escalation of adverse events to the principal investigator and sponsor in line with regulatory timelines.",
    },
    {
      icon: "/images/site4.png",
      title: "Data Protection & Privacy Compliance",
      description:
        "Full adherence to UK GDPR and Data Protection Act 2018, supported by our ICO registration. All patient data is handled securely with validated systems and strict confidentiality protocols.",
    },
    {
      icon: "/images/site5.png",
      title: "Seamless Investigational Product & Sample Handling",
      description:
        "Compliant management, administration, storage, and chain of custody for investigational medicinal products and biological samples, meeting MHRA and sponsor requirements.",
    },
  ];

  // Default items for "Care Meets Clinical Precision" section
  const defaultCareItems = [
    {
      icon: "/images/user.png",
      title: "Single Point of Contact",
      description:
        "Your dedicated Study Manager handles all operational queries and coordination",
    },
    {
      icon: "/images/time.png",
      title: "Real-Time Updates",
      description:
        "Immediate notification of visit completions, adverse events, and protocol deviations",
    },
    {
      icon: "/images/file.png",
      title: "Comprehensive Reporting",
      description:
        "Regular progress reports and quality metrics for your trial oversight",
    },
  ];

  // Use different default items based on the section
  const getDefaultItems = () => {
    if (title.includes("Care Meets Clinical Precision") || title === "Care Meets Clinical Precision") {
      return defaultCareItems;
    }
    return defaultItems;
  };

  const gridItems = items.length > 0 ? items : getDefaultItems();

  // Determine the order based on imageLeft prop
  const imageOrder = imageLeft ? 'order-1' : 'order-2';
  const contentOrder = imageLeft ? 'order-2' : 'order-1';

  return (
    <section className={`hvs-section page-main-custom page-section hvs-main-service ${bgClass}`}>
      <div className="container">
        <div className={`inner-hvs-sec hvs-in ${imageLeft ? 'hvs-image-left' : 'hvs-image-right'}`}>
          {/* Image */}
          <div className={`hvs-visual img ${imageOrder}`}>
            <img src={imageSrc} alt={imageAlt} />
          </div>

          {/* Content */}
          <div className={`page-section__heading ${contentOrder}`}>
            {heading && <h2>{heading}</h2>}
            {title && <h2>{title}</h2>}
            {subtitle && <p className="p-tag">{subtitle}</p>}
            {description && <p>{description}</p>}
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            {gridItems.length > 0 && (
              <div className="info-grid info-grid--three">
                {gridItems.map((item: GridItem, index: number) => (
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
            )}

            {showButtons && (
              <div className="hero-buttons">
                <a href="#" className="btn primary">
                  Get Started
                </a>
                <a href="#" className="btn secondary">
                  Learn More
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageTextSection;