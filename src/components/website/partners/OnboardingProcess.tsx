import React from "react";

const OnboardingProcess = () => {
  const steps = [
    {
      title: "Initial enquiry & feasibility",
      description:
        "We review the protocol synopsis, geography, visit schedule, and volumes, and provide an honest feasibility response — including any capability gaps and the mitigations we propose.",
    },
    {
      title: "Confidentiality & Qualification",
      description:
        "Mutual CDA executed. We complete your vendor-qualification questionnaire and provide accreditation evidence (CQC, ISO 9001:2015, insurances, GCP training).",
    },
    {
      title: "Scope & Costing",
      description:
        "We agree the service scope and provide a transparent rate card or budget, with assumptions clearly stated.",
    },
    {
      title: "Contracting",
      description:
        "Master Services Agreement and/or Work Order executed, with quality and data-protection schedules aligned to your requirements.",
    },
    {
      title: "Study set-up",
      description:
        "Protocol-specific training, delegation, SOP alignment, nurse allocation, and supply logistics set-up completed and documented.",
    },
    {
      title: "Go-Live & Oversight",
      description:
        "First visits delivered under agreed oversight, with KPI reporting and a scheduled review cadence established from the outset.",
    },
  ];

  return (
    <section className="Onboarding_main_Process">
      <div className="container">
    <div className="OnboardingProcess">
      <h1 className="OnboardingProcess-title">
        Structured. Milestone-Based.
        <br />
        Assurance At Every Stage.
      </h1>

      <p className="OnboardingProcess-subtitle">
        Onboarding is a structured, milestone-based process designed to give
        sponsors and CROs assurance at every stage and to satisfy
        vendor-qualification requirements.
      </p>

      <div className="OnboardingProcess-timeline">
        {steps.map((_, index) => (
          <div className="OnboardingProcess-node" key={index}>
            {index + 1}
          </div>
        ))}
      </div>

      <div className="OnboardingProcess-cards">
        {steps.map((step, index) => (
          <div className="OnboardingProcess-card" key={index}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
      </div>
    </div>
    </section>
  );
};

export default OnboardingProcess;