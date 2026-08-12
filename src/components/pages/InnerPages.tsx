import type { CSSProperties, ReactNode } from "react";
import { asset } from "@/data/site";
import type { InfoItem, PolicySection } from "@/data/pages";
import { HeroCallbackCard } from "@/components/common/HeroCallbackCard";
import { FormInputField, FormSelectField, FormTextareaField } from "@/components/pages/PageFormControls";
import { useNavigate } from "react-router-dom";

type PageShellProps = {
  children: ReactNode;
};

type InnerHeroProps = {
  actions?: Array<{
    href: string;
    label: string;
    variant?: "primary" | "secondary";
  }>;
  className?: string;
  eyebrow?: string;
  title: string;
  description: string;
  image?: string;
  backgroundImage?: string;
  showCallback?: boolean;
  showScrollCue?: boolean;
};

type SplitSectionProps = {
  eyebrow?: string;
  title: string;
  body: string[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
};

type InfoGridProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  items: InfoItem[];
  columns?: "two" | "three";
};

type StepsProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  items: InfoItem[];
};

type PolicyArticleProps = {
  title: string;
  description: string;
  sections: PolicySection[];
};

export function PageShell({ children }: PageShellProps) {
  return (
    <>

      <main>{children}</main>

    </>
  );
}

export function InnerHero({ actions, className, eyebrow, title, description, image, backgroundImage, showCallback, showScrollCue }: InnerHeroProps) {
  return (
    <section
      className={`inner-hero${showCallback ? " inner-hero--with-card" : ""}${className ? ` ${className}` : ""}`}
      style={backgroundImage ? ({ "--inner-hero-bg": `url("${asset(backgroundImage)}")` } as CSSProperties) : undefined}
    >
      {showScrollCue ? <InnerScrollCue /> : null}
      <div className="container inner-hero__inner">
        <div className="inner-hero__copy">
          {eyebrow ? <span className="page-eyebrow">{eyebrow}</span> : null}
          <h1>{title}</h1>
          <p>{description}</p>
          {actions?.length ? (
            <div className="inner-hero__actions">
              {actions.map((action) => (
                <a className={action.variant === "secondary" ? "inner-hero__action--secondary" : undefined} href={action.href} key={action.label}>
                  {action.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        {showCallback ? <HeroCallbackCard /> : null}
        {image ? (
          <div className="inner-hero__media">
            <img src={asset(image)} alt="" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function InnerScrollCue() {
  return (
    <div className="inner-scroll-cue" aria-hidden="true">
      {/* <span>Scroll down</span> */}
      {/* <img src={asset("rumax-scroll-arrow.svg")} alt="" /> */}
    </div>
  );
}

export function SplitSection({ eyebrow, title, body, image, imageAlt, reverse }: SplitSectionProps) {
  return (
    <section className={`page-section split-section${reverse ? " split-section--reverse" : ""}`}>
      <div className="container split-section__inner">
        <div className="split-section__media">
          <img src={asset(image)} alt={imageAlt} />
        </div>
        <div className="split-section__copy">
          {eyebrow ? <span className="page-eyebrow">{eyebrow}</span> : null}
          <h2>{title}</h2>
          {body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
export function SplitSectionReverse({ eyebrow, title, body, image, imageAlt, reverse }: SplitSectionProps) {
  return (
    <section className={`page-section split-section${reverse ? " split-section--reverse" : ""}`}>
      <div className="container split-section__inner">

        <div className="split-section__copy">
          {eyebrow ? <span className="page-eyebrow">{eyebrow}</span> : null}
          <h2>{title}</h2>
          {body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="split-section__media">
          <img src={asset(image)} alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}
export function InfoGrid({ eyebrow, title, intro, items, columns = "three" }: InfoGridProps) {
  return (
    <section className="InfoGrid InfoGrid-main-custom">
      <div className="InfoGrid-container">

        <div className="page-section__heading">
          {eyebrow && (
            <span className="InfoGrid-eyebrow">{eyebrow}</span>
          )}
          <h2>{title}</h2>

          {intro && <p>{intro}</p>}
        </div>

        <div className={`InfoGrid-grid InfoGrid-grid--${columns}`}>
          {items.map((item, index) => (
            <article className="InfoGrid-card" key={item.title}>

              <span className="InfoGrid-cardIcon">
                {item.iconAsset ? (
                  <img src={asset(item.iconAsset)} alt="" />
                ) : item.icon ? (
                  <PageIcon name={item.icon} />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </span>

            <div className="Bottom-infoGrid">
              <h3 className="InfoGrid-cardTitle">
                {item.title}
              </h3>

              <p className="InfoGrid-cardDescription">
                {item.description}
              </p>
              </div>

              {item.href && (
                <a
                  href={item.href}
                  className="InfoGrid-cardLink"
                >
                  Learn More
                </a>
              )}
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export function ProcessTimeline({ title, items }: { title: string; items: InfoItem[] }) {
  return (
    <section className="page-section process-section">
      <div className="container">
        <div className="page-section__heading">
          <h2>{title}</h2>
        </div>
        <div className="process-timeline">
          {items.map((item, index) => (
            <article key={`${item.title}-${index}`}>
              <b>{index === items.length - 1 ? "4" : index + 1}</b>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}



// components/pages/InnerPages.tsx (JobGrid component - no changes needed)
export function JobGrid({ jobs }: { jobs: InfoItem[] }) {
  const navigate = useNavigate();

  return (
    <section className="page-section jobs-section">
      <div className="container">
        <div className="page-section__heading">
          <h2>Jobs At Rumax</h2>
        </div>

        <div className="job-card-grid">
          {jobs.map((job) => (
            <article className="job-card" key={job._id}>
              <div className="job-card__top">
                <span aria-hidden="true">
                  {job.iconAsset ? (
                    <img src={asset(job.iconAsset)} alt="" />
                  ) : (
                    <PageIcon name={job.icon ?? "briefcase"} />
                  )}
                </span>
                <small>{job.daysAgo || '3 Days ago'}</small>
              </div>

              <h3>{job.title}</h3>

              <em className="job-card__meta">
                {job.contractType || 'Full-time'} &bull; {job.experience || '3-5 yrs'} &bull; {job.isRemote ? 'Remote' : (job.location || 'On-site')}
              </em>

              <p>{job.description}</p>

              <div className="job-card__actions">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/careers/${job._id}`);
                  }}
                >
                  View Details
                </a>

                <a className="job-card__apply" href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/apply/${job._id}`);
                  }}>
                  Apply Now
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function StepsSection({ eyebrow, title, intro, items }: StepsProps) {
  return (
    <section className="page-section steps-section">
      <div className="container">
        <div className="page-section__heading">
          {eyebrow ? <span className="page-eyebrow">{eyebrow}</span> : null}
          <h2>{title}</h2>
          {intro ? <p>{intro}</p> : null}
        </div>
        <div className="steps-list">
          {items.map((item, index) => (
            <article className="step-item" key={item.title}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PolicyArticle({ title, description, sections }: PolicyArticleProps) {
  return (
    <section className="page-section policy-section">
      <article className="container policy-article">
        <header>
          <span className="page-eyebrow">Company Policy</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </header>
        {sections.map((section) => (
          <section className="policy-block" key={section.title}>
            <h3>{section.title}</h3>
            {section.body?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.items ? (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </article>
    </section>
  );
}

export function ContactForm() {
  return (
    <form className="contact-form">
      <div className="form-grid">
        <FormInputField label="Full name" name="name" type="text" />
        <FormInputField label="Phone number" name="phone" type="tel" />
        <FormInputField label="Email address" name="email" type="email" />
        <FormSelectField label="Service type" name="service" defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          <option>Domiciliary care</option>
          <option>Supported living</option>
          <option>Clinical trials nursing</option>
          <option>Training services</option>
        </FormSelectField>
      </div>
      <FormTextareaField label="Message" name="message" rows={6} />
      <button type="submit">Request a Callback</button>
    </form>
  );
}

export function AssessmentForm({
  buttonLabel = "Request a Free Assessment",
  description = "Tell us about your care needs and we will arrange a free, no-obligation assessment.",
  title = "Request A Free Assessment"
}: {
  buttonLabel?: string;
  description?: string;
  title?: string;
} = {}) {
  const fields = [
    "Full Name*",
    "Relationship to Client",
    "Email Address*",
    "Phone Number*",
    "Postcode",
    "Type of Care Required",
    "When do you need care?",
    "Funding Type"
  ];

  return (
    <section className="page-section assessment-section">
      <div className="container assessment-section__inner">
        <div className="page-section__heading">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <form className="assessment-form">
          <div className="form-grid">
            {fields.map((field) => (
              <FormInputField
                key={field}
                label={field}
                placeholder={field.includes("Name") ? "John Smith" : field.includes("Email") ? "sarah@example.com" : "Select"}
                type="text"
              />
            ))}
          </div>
          <FormTextareaField
            label="Additional information"
            rows={6}
            placeholder="Please share any relevant details about care needs, medical conditions, or specific requirements..."
          />
          <button type="submit">{buttonLabel}</button>
        </form>
      </div>
    </section>
  );
}

export function FaqSection({ items }: { items: string[] }) {
  return (
    <section className="page-section faq-section">
      <div className="container faq-section__inner">
        <div className="page-section__heading">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {items.map((item, index) => (
            <details key={item} open={index === 0}>
              <summary>
                {index === 0 ? item : `${index + 1}. ${item}`}
              </summary>
              <p>Our team will discuss this with you during assessment and agree the right support plan before care begins.</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactCards({ items }: { items: InfoItem[] }) {
  return (
    <section className="contact-methods-section">
      <div className="contact-methods-section__inner">
        <div className="contact-methods-section__heading">
          <h2>
            Services tailored to meet the unique <strong>Needs of Each Client</strong>
          </h2>
        </div>
        <div className="contact-methods-grid">
          {items.map((item) => (
            <article className="contact-method-tile" key={item.title}>
              <span className="contact-method-tile__icon" aria-hidden="true">
                <PageIcon name={item.icon ?? "check"} />
              </span>
              <div className="contact-method-tile__copy">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MapBand() {
  const mapSrc =
    "https://maps.google.com/maps?q=Cornwallis%20House%2C%20Unit%202%2C%20Howard%20Chase%2C%20Basildon%2C%20Essex%2C%20SS14%203BB&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <section className="map-band" aria-label="Rumax office location map">
      <iframe
        src={mapSrc}
        title="Rumax office location on Google Maps"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </section>
  );
}

export function BulletPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="bullet-panel">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function PageIcon({ name }: { name: string }) {
  switch (name) {
    case "mail":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16v12H4z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5 6 7c-.6.6-.7 1.5-.3 2.3 1.9 3.8 4.9 6.8 8.7 8.7.8.4 1.7.3 2.3-.3l2-2-3.2-3.2-1.7 1.7c-1.7-.9-3.1-2.3-4-4L11.4 8 8 5z" />
        </svg>
      );
    case "location":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s7-5.4 7-12a7 7 0 0 0-14 0c0 6.6 7 12 7 12z" />
          <circle cx="12" cy="9" r="2.4" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "briefcase":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 7V5h8v2" />
          <path d="M4 8h16v10H4z" />
          <path d="M4 12h16" />
        </svg>
      );
    case "money":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 7h14v10H5z" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="M7 10V9h1M17 14v1h-1" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="9" cy="9" r="3" />
          <circle cx="17" cy="10" r="2.5" />
          <path d="M4 19c.6-3 2.4-5 5-5s4.4 2 5 5" />
          <path d="M14 18c.6-2.1 1.9-3.4 3.8-3.4 1.5 0 2.7.8 3.2 2.4" />
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m4 11 8-7 8 7" />
          <path d="M6 10v10h12V10" />
          <path d="M10 20v-6h4v6" />
        </svg>
      );
    case "medical":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 4h6v6h5v6h-5v5H9v-5H4v-6h5z" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
        </svg>
      );
    case "award":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="m9.5 12-2 8 4.5-2 4.5 2-2-8" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6z" />
          <path d="m9 12 2 2 4-5" />
        </svg>
      );
    case "document":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 4h7l3 3v13H7z" />
          <path d="M14 4v4h4M9 12h6M9 16h6" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 6h14v14H5z" />
          <path d="M8 4v4M16 4v4M5 10h14" />
          <path d="M9 14h2M13 14h2M9 17h2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="m8.5 12.5 2.4 2.4 4.8-5.5" />
        </svg>
      );
  }
}
