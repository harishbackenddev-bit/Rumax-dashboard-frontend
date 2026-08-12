import { AssetImage } from "@/components/ui/AssetImage";

type SupportSectionProps = {
  description?: string;
  title?: string;
};

const ctaLinks = [
  {
    label: "Get Started",
    href: "#",
    icon: "rumax-cta-assessment.svg",
  },
  {
    label: "Work For Us",
    href: "#",
    icon: "rumax-cta-assessment.svg",
  },
  {
    label: "Download Investigator Guide Book Now",
    href: "#",
    icon: "rumax-cta-assessment.svg",
  },
];

const SupportSection = ({
  description = "Need support for your next project? Our team is here to assist.",
  title = "Enquire About Our Investigator Site Support",
}: SupportSectionProps) => {
  return (
    <section className="cta">
      <div className="container cta__inner">
        <span className="cta__eyebrow">
          <AssetImage
            name="rumax-cta-pill-phone.svg"
            aria-hidden="true"
          />
          Get in Touch
        </span>

        <h2>{title}</h2>

        <p>{description}</p>

        <div className="cta__actions">
          <a href="/contact-us" className="cta-main">
            Call Us
          </a>

          {ctaLinks.map((link) => (
            <a href={link.href} key={link.label}>
              <AssetImage
                name={link.icon}
                aria-hidden="true"
              />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;