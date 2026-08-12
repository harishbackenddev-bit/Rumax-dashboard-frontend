// pages/InvestigatorTrialSupport.tsx
import React from "react";
import Hero from "@/components/website/services/clinical/Hero";
import LogoSection from "@/components/website/services/clinical/LogoSection";
import GridSection from "@/components/website/services/clinical/GridSection";
import GridSection2 from "@/components/website/services/clinical/GridSection_second";
import ImageTextSection from "@/components/website/services/clinical/ImageTextSection";
import FAQSection from "@/components/website/services/clinical/FAQSection";
import SupportSection from "@/components/website/services/clinical/SupportSection";
import TrialSupportForm from "@/components/website/services/clinical/TrialSupportForm";

// Import images
import ecaImg from "/images/eca.png";
import cqcLogoImg from "/images/cqc-logo.png";
import nhsImg from "/images/nhs.png";
import icoImg from "/images/ico.png";
import isoImg from "/images/iso.png";
import cyberEssentialImg from "/images/cyber-essential.png";

function Clinical() {
    const logos = [
        { src: ecaImg, alt: "ECA" },
        { src: cqcLogoImg, alt: "CQC" },
        { src: nhsImg, alt: "NHS" },
        { src: icoImg, alt: "ICO" },
        { src: isoImg, alt: "ISO" },
        { src: cyberEssentialImg, alt: "Cyber Essential" },
    ];

    return (
        <div className="investigator-trial-page">
            <Hero />
            <LogoSection logos={logos} />

            <ImageTextSection
                imageLeft={false}
                imageSrc="/images/left-doc.png"
                title="Mobile Research Nursing Services"
                subtitle="Our Mobile Research Nurse service provides qualified, experienced nursing professionals who travel directly to participants' homes or designated locations to conduct clinical trial visits, assessments, and procedures. This patient-centric approach removes barriers to participation, improves recruitment and retention rates, and enhances the overall participant experience."
                description="We work with Sponsors, contract research organizations (CROs), and research sites to deliver high-quality, compliant, and compassionate mobile nursing support for a wide range of clinical studies."
            />

            <GridSection
                title="Clinical trials homecare capabilities"
                description="Our registered nurses deliver the full range of homecare procedures specified in sponsor protocols, supported by rigorous governance, competency assurance, and sponsor-grade documentation at every visit."
            />

            <ImageTextSection
                imageLeft={true}
                imageSrc="/images/right-docc.png"
                title="Why Choose Rumax for Clinical Trials Support"
                subtitle='ISO 9001:2015 Registered – Our ISO 9001:2015 registration demonstrates our dedication to quality excellence. It ensures we have robust processes in place to consistently meet customer expectations, manage risks effectively, and drive continuous improvement across all operations.'
                description=""
            />

            <GridSection2
                title="Why Choose Rumax for Clinical Trials Support"
                description="Our registered nurses deliver the full range of homecare procedures specified in sponsor protocols, supported by rigorous governance, competency assurance, and sponsor-grade documentation at every visit."
            />

            {/* Add the form before FAQ section */}
            <section className="page-main-form page-section  Step-form">
                <div className="container">
                    <div className="page-section__heading">
                  <h2> Start Your Clinical Trial Support Journey</h2>
                  <p>Tell us about your study and schedule a consultation with our mobile research team.</p>
                    </div>
               
                <TrialSupportForm />
                </div>
            </section>

            <FAQSection />
            <SupportSection />
        </div>
    );
}

export default Clinical;