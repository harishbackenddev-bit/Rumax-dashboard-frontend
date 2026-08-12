import type { ReactNode } from "react";
import { CareCta } from "@/components/common/CareCta";
import { FormInputField, FormTextareaField } from "@/components/pages/PageFormControls";
import { InnerHero, PageIcon, PageShell } from "@/components/pages/InnerPages";

type CardItem = {
  title: string;
  description: string;
  icon?: string;
  href?: string;
};

export function ResourcePage({
  eyebrow,
  title,
  description,
  cards,
  children,
  showCallback = false,
  showScrollCue = false,
  heroActions,
  heroBackgroundImage = "rumax-team-hero.png",
  heroClassName
}: {
  eyebrow?: string;
  title: string;
  description: string;
  cards?: CardItem[];
  children?: ReactNode;
  showCallback?: boolean;
  showScrollCue?: boolean;
  heroActions?: Array<{
    href: string;
    label: string;
    variant?: "primary" | "secondary";
  }>;
  heroBackgroundImage?: string;
  heroClassName?: string;
}) {
  return (
    <PageShell>
      <InnerHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        backgroundImage={heroBackgroundImage}
        actions={heroActions}
        className={heroClassName}
        showCallback={showCallback}
        showScrollCue={showScrollCue}
      />
      {cards ? <ResourceCardSection title={title} cards={cards} /> : null}
      {children}
      <CareCta />
    </PageShell>
  );
}

export function ResourceCardSection({ title, cards }: { title: string; cards: CardItem[] }) {
  return (
    <section className="page-section resource-section">
      <div className="container">
        <div className="page-section__heading">
          <h2>{title}</h2>
        </div>
        <div className="resource-card-grid">
          {cards.map((card) => (
            <article className="resource-card" key={card.title}>
              <span aria-hidden="true">
                <PageIcon name={card.icon ?? "check"} />
              </span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              {card.href ? <a href={card.href}>Learn More</a> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessBand({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="page-section process-band">
      <div className="container">
        <div className="page-section__heading">
          <h2>{title}</h2>
        </div>
        <div className="process-card-row">
          {items.map((item, index) => (
            <article key={item}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WizardPage({
  eyebrow,
  title,
  description,
  stepLabel,
  stepTitle,
  stepDescription,
  options,
  fields,
  backHref,
  nextHref,
  submitLabel = "Continue"
}: {
  eyebrow: string;
  title: string;
  description: string;
  stepLabel: string;
  stepTitle: string;
  stepDescription: string;
  options?: string[];
  fields?: string[];
  backHref?: string;
  nextHref?: string;
  submitLabel?: string;
}) {
  return (
    <PageShell>
      <section className="wizard-page">
        <div className="container wizard-page__inner">
          <div className="wizard-page__copy">
            <span className="page-eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <form className="wizard-card">
            <span>{stepLabel}</span>
            <h2>{stepTitle}</h2>
            <p>{stepDescription}</p>
            {options ? (
              <div className="choice-list">
                {options.map((option) => (
                  <label key={option}>
                    <input type="radio" name="choice" />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            ) : null}
            {fields ? (
              <div className="form-grid">
                {fields.map((field) => (
                  <FormInputField key={field} label={field} placeholder={field.includes("Email") ? "name@example.com" : "Enter details"} />
                ))}
              </div>
            ) : null}
            <div className="wizard-card__actions">
              {backHref ? <a href={backHref}>Back</a> : <span />}
              {nextHref ? <a className="wizard-card__primary" href={nextHref}>{submitLabel}</a> : <button type="submit">{submitLabel}</button>}
            </div>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

export function ResultPage({ booked = false }: { booked?: boolean }) {
  return (
    <PageShell>
      <section className="wizard-page wizard-page--result">
        <div className="container result-card">
          <span aria-hidden="true">
            <PageIcon name={booked ? "calendar" : "heart"} />
          </span>
          <h1>{booked ? "Consultation Booked!" : "Your Assessment Result"}</h1>
          <h2>{booked ? "Friday, April 24, 2026 at 11:00 AM" : "Moderate Personal Care Needed"}</h2>
          <p>
            {booked
              ? "We've sent a confirmation email with all the details. A care advisor will call you at the scheduled time."
              : "Daily personal care assistance is recommended, with safety monitoring, meal preparation and medication support."}
          </p>
          <div className="result-card__actions">
            <a href="/contact-us">Contact Us</a>
            <a href="/care-calculator?step=details">Book a Free Consultation</a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function ContactVariantForm({ title, description }: { title: string; description: string }) {
  return (
    <section className="page-section feedback-section">
      <div className="container feedback-grid">
        <div>
          <span className="page-eyebrow">We Will Listen</span>
          <h2>{title}</h2>
          <p>{description}</p>
          <ul>
            <li>We acknowledge feedback quickly and keep clear records.</li>
            <li>Concerns are reviewed by the right manager or clinical lead.</li>
            <li>Learning is shared with teams to improve service quality.</li>
          </ul>
        </div>
        <form className="contact-form">
          <div className="form-grid">
            <FormInputField label="Full Name*" placeholder="John Smith" icon="user" />
            <FormInputField label="Email Address*" placeholder="sarah@example.com" icon="mail" />
            <FormInputField label="Phone Number" placeholder="00 23 456 7890" icon="phone" />
            <FormInputField label="Service Area" placeholder="Select" />
          </div>
          <FormTextareaField label="Your feedback" rows={7} icon="message" />
          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </section>
  );
}
