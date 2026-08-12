import React from "react";

const OnboardingProcess = () => {
  const steps = [
    {
      title: "Discovery & fit",
      description:
        "We explore the combined offering, target studies, and where clinical delivery sits within your service model.",
    },
    {
      title: "Mutual Qualification",
      description:
        "CDA executed; we exchange quality and compliance documentation and complete each other's vendor-qualification checks.",
    },
    {
      title: "Solution & interface design",
      description:
        "We jointly define the service interface, responsibilities (RACI), data flows, and chain-of-custody points.",
    },
    {
      title: "Commercial Framework",
      description:
        "Partnership or sub-contract agreement and rate framework agreed, with clear scope boundaries.",
    },
    {
      title: "Integration & Testing",
      description:
        "SOP alignment, training, and a pilot or dry-run where appropriate to validate the combined process.",
    }
  ];

  return (
    <section className="Onboarding_main_Process">
      <div className="container">
    <div className="OnboardingProcess">
      <h1 className="OnboardingProcess-title">
        Structured. Milestone-Based.Assurance At Every Stage.
      </h1>
{/* 
      <p className="OnboardingProcess-subtitle">
        Onboarding is a structured, milestone-based process designed to give
        sponsors and CROs assurance at every stage and to satisfy
        vendor-qualification requirements.
      </p> */}

      <div className="OnboardingProcess-timeline">
        {steps.map((_, index) => (
          <div className="OnboardingProcess-node" key={index}>
            {index + 1}
          </div>
        ))}
      </div>

      <div className="OnboardingProcess-cards-5">
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