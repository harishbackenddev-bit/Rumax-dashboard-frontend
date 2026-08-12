import { complianceLogos } from "@/data/site";
import { AssetImage } from "@/components/ui/AssetImage";

export function Compliance() {
  return (
    <section className="compliance">
      <div className="container compliance__inner">
        <div>
          <h2>Our Compliance &amp; Accreditation</h2>
          <p>
            Rumax platform meets the highest certification standards for data security &amp; privacy in healthcare, leveraging
            industry standards to secure data for our clients.
          </p>
        </div>
        <div className="compliance-logos" aria-label="ECA, CQC, NHS, ICO, ISO and Cyber Essentials accreditations">
          {complianceLogos.map((logo) => (
            <AssetImage name={logo.icon} alt={logo.label} key={logo.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
