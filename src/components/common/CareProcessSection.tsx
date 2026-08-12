import { asset } from "@/data/site";

type ProcessStep = {
  title: string;
  description: string;
};

type CareProcessSectionProps = {
  body?: string[];
  bullets?: string[];
  image: string;
  imageAlt: string;
  intro?: string;
  reverse?: boolean;
  steps?: ProcessStep[];
  title: string;
  variant?: "steps" | "about";
};

export function CareProcessSection({ body, bullets, image, imageAlt, intro, reverse = false, steps, title, variant = "steps" }: CareProcessSectionProps) {
  return (
    <section className={`page-section dom-care-process${reverse ? " dom-care-process--reverse" : ""}${variant === "about" ? " dom-care-process--about" : ""}`}>
      <div className="container dom-care-process__inner">
        <div className="dom-care-process__copy">
          <div className="dom-care-process__heading">
            <span className="section-spark" aria-hidden="true" />
            <h2>{title}</h2>
            {intro ? <p>{intro}</p> : null}
          </div>
          {variant === "about" ? (
            <div className="dom-care-process__body">
              {body?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {bullets?.length ? (
                <ul className="dom-care-process__bullets">
                  {bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : (
            <div className="dom-care-process__steps">
              {steps?.map((step, index) => (
                <article key={step.title}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        <div className="dom-care-process__media">
          <img src={asset(image)} alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}
