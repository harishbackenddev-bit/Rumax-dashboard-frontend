import { AssetImage } from "@/components/ui/AssetImage";

export type ReasonItem = {
  iconAsset: string;
  title: string;
  description: string;
};

export function ReasonsGrid({ items, title }: { items: ReasonItem[]; title: string }) {
  return (
    <section className="page-section dom-care-reasons">
      <div className="container">
        <div className="dom-care-reasons__heading">
          <span aria-hidden="true" />
          <h2>{title}</h2>
        </div>
        <div className="dom-care-reasons__grid">
          {items.map((reason) => (
            <article className="dom-care-reason-card" key={`${title}-${reason.title}`}>
              <AssetImage name={reason.iconAsset} alt="" aria-hidden="true" />
              <div>
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
