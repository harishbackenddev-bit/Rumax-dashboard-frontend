import React from "react";

const ServiceOfferingBlock = () => {
  const services = [
    "In-home and remote study-visit delivery by experienced research nurses, including visit windows aligned to protocol schedules.",
    "Investigational medicinal product (IMP) administration, including injectable and infusion support, within delegated authority and site oversight.",
    "Sample collection, processing, and onward handling coordinated with central and local laboratories.",
    "Vital signs, ECG, and protocol-specified clinical assessments, with source documentation completed to GCP standards.",
    "Support for complex and specialist protocols, including controlled-substance studies, with appropriate governance and chain-of-custody controls.",
    "National coverage with a single contracting and oversight point, reducing the sponsor's vendor-management burden.",
  ];

  return (
    <section className="ServiceOfferingBlock-container">
      <div className="container">
    <div className="ServiceOfferingBlock">
      {/* LEFT */}
      <div className="ServiceOfferingBlock-left">
        <span className="ServiceOfferingBlock-pill">
          Our Service Offering
        </span>

        <h1 className="ServiceOfferingBlock-title">
          Taking Protocol-Defined Activity Out Of The Site And Into The Home.
        </h1>

        <p className="ServiceOfferingBlock-description">
          Rumax provides GCP-compliant clinical-trials homecare nursing across
          England and Wales, enabling sponsors and CROs to take
          protocol-defined activity out of the site and into the participant's
          home. Our service is designed to improve recruitment, retention, and
          the participant experience without compromising data integrity or
          oversight.
        </p>

        <div className="ServiceOfferingBlock-infoBox">
          <div className="ServiceOfferingBlock-infoHeader">
            <svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5748 10.993C15.5748 15.5733 12.3686 17.8634 8.55786 19.1917C8.35831 19.2593 8.14155 19.2561 7.9441 19.1825C4.12416 17.8634 0.917969 15.5733 0.917969 10.993V4.58064C0.917969 4.33769 1.01448 4.10469 1.18627 3.9329C1.35807 3.7611 1.59107 3.66459 1.83402 3.66459C3.66613 3.66459 5.95627 2.56532 7.5502 1.17292C7.74427 1.00712 7.99115 0.916016 8.2464 0.916016C8.50166 0.916016 8.74853 1.00712 8.9426 1.17292C10.5457 2.57449 12.8267 3.66459 14.6588 3.66459C14.9017 3.66459 15.1347 3.7611 15.3065 3.9329C15.4783 4.10469 15.5748 4.33769 15.5748 4.58064V10.993Z" stroke="#5B4DFF" stroke-opacity="0.9" stroke-width="1.83211" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <h3>Why sponsors choose Rumax</h3>
          </div>

          <p>
            We are not a generalist staffing agency. Rumax is a
            CQC-registered, ISO 9001:2015-certified specialist whose nurses,
            SOPs, and quality systems are purpose-built for clinical research —
            so the homecare arm of your trial carries the same governance as the
            site.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="ServiceOfferingBlock-right">
        {services.map((service, index) => (
          <div className="ServiceOfferingBlock-card" key={index}>
            <span className="ServiceOfferingBlock-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>

            <p>{service}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
    </section>
  );
};

export default ServiceOfferingBlock;