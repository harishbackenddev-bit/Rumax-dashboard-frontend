// pages/InvestigatorTrialSupport.tsx
import React from "react";

import Hero from "@/components/website/partners/Hero";
import LogoSection from "@/components/website/services/clinical/LogoSection";
import InvestigatorCard from "@/components/website/partners/InvestigatorCard";

// Import images
// (Update paths as needed)
import ecaImg from "/images/eca.png";
import cqcLogoImg from "/images/cqc-logo.png";
import nhsImg from "/images/nhs.png";
import icoImg from "/images/ico.png";
import isoImg from "/images/iso.png";
import cyberEssentialImg from "/images/cyber-essential.png";

function Partner() {
    // Logo data
    const logos = [
        { src: ecaImg, alt: "ECA" },
        { src: cqcLogoImg, alt: "CQC" },
        { src: nhsImg, alt: "NHS" },
        { src: icoImg, alt: "ICO" },
        { src: isoImg, alt: "ISO" },
        { src: cyberEssentialImg, alt: "Cyber Essential" },
    ];

    // pages/Globalvendors.tsx

    const investigatorCards = [
        {
            eyebrow: "CROs & Sponsors",
            pill: "15+ years supporting global sponsors",
            heading: "A specialist UK homecare partner built for decentralised and hybrid trials.",
            description:
                "Rumax provides GCP-compliant clinical-trials homecare nurses across UK and remove England and Wales, enabling sponsors and CROs to take protocol-defined activity out of the site and into the participant's home — improving recruitment, retention, and participant experience without compromising data integrity.",
            buttonText: "Explore CRO & Sponsor Services",
            buttonLink: "https://rumax-dashboard-frontend.vercel.app/partners/cros-sponsors",
            rightTitle: "WHAT WE PROVIDE",
            features: [
                "In-home and remote study-visit delivery by experienced research nurses",
                "IMP administration including injectable and IV infusion support",
                "Sample collection, processing, and shipment to the central laboratory",
                "Vital signs, ECG, and protocol-specified clinical assessments",
                "National coverage with a single contracting and oversight point",
            ],
        },

        {
            eyebrow: "Investigator Sites & NHS Trusts",
            pill: "HRA-aligned governance built in",
            heading: "Protecting site capacity, continuity, and data quality.",
            description:
                "Rumax works alongside investigator sites, research-active NHS Trusts, and Patient Identification Centres to provide additional clinical capacity exactly where it is needed — helping sites take on, retain, and complete studies that might otherwise strain existing resources.",
            buttonText: "Explore Site & NHS Trust Services",
            buttonLink: "https://rumax-dashboard-frontend.vercel.app/partners/investigator-sites",
            rightTitle: "WHAT WE PROVIDE",
            features: [
                "Supplementary research-nurse capacity for site-based and home-based visits",
                "Home-visit delivery on behalf of the site, reducing participant travel",
                "Cover for workload peaks, staff absence, and overlapping study start-ups",
                "Continuity of named, consistent nursing staff for participants",
                "Slots into NHS governance — not around it",
            ],
        },

        {
            eyebrow: "Global Vendor Companies",
            pill: "Active relationships with Marken & others",
            heading: "Your qualified UK clinical 'last-mile' partner.",
            description:
                "Global logistics, technology, and specialist-service vendors increasingly need a qualified, regulated clinical partner to deliver the in-home or in-region clinical element of a decentralised trial. Rumax provides that UK clinical capability — the trained, registered nurse at the participant's door.",
            buttonText: "Explore Global Vendor Partnership",
            buttonLink: "https://rumax-dashboard-frontend.vercel.app/partners/global-vendors",
            rightTitle: "WHAT WE PROVIDE",
            features: [
                "UK clinical delivery layered on vendor logistics and direct-to-participant supply",
                "Nurse-administered IMP and sample-collection services",
                "Chain-of-custody discipline documented within our QMS",
                "CQC-registered counterparty your sponsor clients can trust",
                "Co-ordinated scheduling aligned with cold-chain and device timelines",
            ],
        },
    ];

    return (
        <div className="investigator-trial-page">
            <Hero />

            <LogoSection logos={logos} />
             <div className="investigator-cards-mains">
                    {investigatorCards.map((card, index) => (
                <InvestigatorCard
                    key={index}
                    eyebrow={card.eyebrow}
                    pill={card.pill}
                    heading={card.heading}
                    description={card.description}
                    buttonText={card.buttonText}
                    buttonLink={card.buttonLink}
                    rightTitle={card.rightTitle}
                    features={card.features}
                />
            ))}
            </div>

        </div>
    );
}

export default Partner;
