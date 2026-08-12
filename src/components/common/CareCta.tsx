import { ctaLinks } from "@/data/site";
import { AssetImage } from "@/components/ui/AssetImage";

type CareCtaProps = {
  description?: string;
  title?: string;
};

export function CareCta({
  description = "Need support for yourself or a loved one? Our team is here to help you find the perfect care solution.",
  title = "Enquire About Care Services"
}: CareCtaProps) {
  return (
    <section className="cta">
      <div className="container cta__inner">
        <span className="cta__eyebrow">
          <AssetImage name="rumax-cta-pill-phone.svg" aria-hidden="true" />
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
              <AssetImage name={link.icon} aria-hidden="true" />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
