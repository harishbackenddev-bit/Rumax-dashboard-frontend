// components/sections/Hero.tsx
import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Who We Partner With</h1>
          <h3>
            Rumax exists at the point where clinical research, regulated care, and patient experience meet. For more than fifteen years we have delivered clinical-trials homecare and regulated domiciliary care across England and Wales — bringing the trial to the participant, supporting investigator sites, and giving sponsors and vendors a single, accountable, quality-assured UK delivery partner.


          </h3>
          <h3>
            We work in three principal partnership groups. Whoever you are in the research ecosystem, our promise is the same: clinical excellence delivered inside a documented, inspection-ready quality framework.

          </h3>
          <div className="hero-badges">
            <div className="hero-badge">
              <div className="hero-badge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z" />
                </svg>
              </div>

              <div className="hero-badge-content">
                <h4>CQC Registered</h4>
                <p>Care Quality Commission</p>
              </div>
            </div>

            <div className="hero-badge">
              <div className="hero-badge-icon">

                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.6041 9.66437L12.7399 16.0568C12.7527 16.1321 12.7421 16.2094 12.7097 16.2785C12.6772 16.3477 12.6245 16.4052 12.5584 16.4435C12.4924 16.4818 12.4163 16.4991 12.3402 16.4929C12.2641 16.4868 12.1917 16.4576 12.1326 16.4092L9.4485 14.3946C9.31892 14.2978 9.16151 14.2455 8.99977 14.2455C8.83802 14.2455 8.68061 14.2978 8.55103 14.3946L5.8624 16.4084C5.80341 16.4568 5.73109 16.4859 5.65509 16.4921C5.57909 16.4982 5.50302 16.481 5.43704 16.4428C5.37105 16.4046 5.31828 16.3472 5.28578 16.2782C5.25327 16.2093 5.24257 16.132 5.2551 16.0568L6.39023 9.66437" stroke="#5B4DFF" stroke-width="1.49952" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M8.9966 10.4966C11.4811 10.4966 13.4951 8.48254 13.4951 5.99806C13.4951 3.51358 11.4811 1.49951 8.9966 1.49951C6.51212 1.49951 4.49805 3.51358 4.49805 5.99806C4.49805 8.48254 6.51212 10.4966 8.9966 10.4966Z" stroke="#5B4DFF" stroke-width="1.49952" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

              </div>

              <div className="hero-badge-content">
                <h4>ISO 9001:2015</h4>
                <p>Quality Management</p>
              </div>
            </div>

            <div className="hero-badge">
              <div className="hero-badge-icon">

                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_8929_347)">
                    <path d="M8.99758 16.4947C13.1384 16.4947 16.4952 13.1379 16.4952 8.9971C16.4952 4.85629 13.1384 1.49951 8.99758 1.49951C4.85678 1.49951 1.5 4.85629 1.5 8.9971C1.5 13.1379 4.85678 16.4947 8.99758 16.4947Z" stroke="#5B4DFF" stroke-width="1.49952" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.74805 8.99708L8.24756 10.4966L11.2466 7.49756" stroke="#5B4DFF" stroke-width="1.49952" stroke-linecap="round" stroke-linejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_8929_347">
                      <rect width="17.9942" height="17.9942" fill="white" />
                    </clipPath>
                  </defs>
                </svg>


              </div>

              <div className="hero-badge-content">
                <h4>GCP Certified</h4>
                <p>ICH E6(R3) nurses</p>
              </div>
            </div>

            <div className="hero-badge">
              <div className="hero-badge-icon">

                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_8929_356)">
                    <path d="M8.99758 16.4947C13.1384 16.4947 16.4952 13.1379 16.4952 8.9971C16.4952 4.85629 13.1384 1.49951 8.99758 1.49951C4.85678 1.49951 1.5 4.85629 1.5 8.9971C1.5 13.1379 4.85678 16.4947 8.99758 16.4947Z" stroke="#5B4DFF" stroke-width="1.49952" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.99805 4.49854V8.99709L11.9971 10.4966" stroke="#5B4DFF" stroke-width="1.49952" stroke-linecap="round" stroke-linejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_8929_356">
                      <rect width="17.9942" height="17.9942" fill="white" />
                    </clipPath>
                  </defs>
                </svg>


              </div>

              <div className="hero-badge-content">
                <h4>15+ Years</h4>
                <p>Clinical research delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;