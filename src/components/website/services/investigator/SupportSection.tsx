// components/website/investigator/SupportSection.tsx
import React from "react";

interface SupportSectionProps {
  title?: string;
  description?: string;
  buttons?: Array<{
    text: string;
    icon?: string;
    className?: string;
    href: string;
  }>;
}

const SupportSection: React.FC<SupportSectionProps> = ({
  title = "Enquire About Our Investigator Location / Site Support",
  description = "Need support for your next project? Our team is here to assist.",
  buttons = [
    { text: "Call Us", icon: "call.png", className: "btn primary btn primary1", href: "#" },
    { text: "Get Started", icon: "star.png", className: "btn secondary btn secondary1", href: "#" },
    { text: "Work For Us", icon: "star.png", className: "btn secondary btn secondary1", href: "#" },
    {
      text: "Download Investigator Guide Book Now",
      icon: "star.png",
      className: "btn secondary btn secondary1",
      href: "#",
    },
  ],
}) => {
  return (
    <div className="support-main-custom">
      <div className="container">
        <div className="inner-support">
          <div className="hero-buttons hero-top-support">
            <a href="#" className="btn secondary btn secondary1">
              <img src="call.png" alt="" /> Get in Touch
            </a>
          </div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="inner-bottom-support">
          <div className="hero-buttons">
            {buttons.map((button, index) => (
              <a
                key={index}
                href={button.href}
                className={button.className}
              >
                {button.icon && <img src={button.icon} alt="" />}
                {button.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;