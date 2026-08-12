// components/sections/Hero.tsx
import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero hero-main-custom">
      <div className="container">
        <div className="hero-content">
          <h1>Clinical Trial Homecare Service</h1>
          <h3>
            Bridging The Gap Between The Trial Participant "Patient"
            And The Trial Location "Investigator Site". UK Wide Clinical Trial Support.
          </h3>
          <p>
            Rumax Limited helps accelerates recruitment, maximises retention and protects study timelines through expert Clinical Trial Home Nursing and Investigator Location "Site" Support. We deliver GCP-Compliant decentralised (DCT), hybrid and on-site clinical research solutions across the United Kingdom.
          </p>
          <div className="hero-buttons">
            <Link to="/contact" className="btn primary">
              Discuss Your Trial Needs
            </Link>
            <Link to="/contact" className="btn secondary">
              Request Capacity Assessment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;