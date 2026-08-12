import { AssetImage } from "@/components/ui/AssetImage";

type QualityGovernanceStripProps = {
  title?: string;
  items?: string[];
};

export function QualityGovernanceStrip({
  title = "Quality Governance",
  items = [
    "ISO 9001:2015 certified quality management system",
    "CQC registered for Treatment of Disease, Disorder or Injury and Nursing Care",
    "All clinical trial nurses hold current GCP training and relevant clinical competencies"
  ]
}: QualityGovernanceStripProps) {
  return (
    <section className="quality-governance-strip">
      <div className="container quality-governance-strip__inner">
        <div className="quality-governance-strip__copy">
          <AssetImage className="quality-governance-strip__mark" name="dom-care-cqc-mark.png" alt="Care Quality Commission" />
          <div>
            <h2>{title}</h2>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="dom-care-cqc__rating quality-governance-strip__rating">
          <AssetImage name="dom-care-cqc-rating-logo.svg" alt="Care Quality Commission" />
          <i aria-hidden="true" />
          <span>Overall: <strong>Good</strong></span>
          <AssetImage className="dom-care-cqc__external" name="dom-care-cqc-external.svg" alt="" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
