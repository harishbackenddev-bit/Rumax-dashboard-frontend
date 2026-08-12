import React from "react";
import { CareCta } from "@/components/common/CareCta";
import { CareProcessSection } from "@/components/common/CareProcessSection";
import AboutLogoSection from "@/components/website/home/AboutLogoSection";
import { TeamVideos } from "@/components/website/home/TeamVideos";
import { InfoGrid, InnerHero, PageShell, SplitSectionReverse } from "@/components/pages/InnerPages";
import { aboutRecognition, aboutValues } from "@/data/pages";
import { asset } from "@/data/site";

const AboutPage: React.FC = () => {
  return (
    <PageShell>
      <div className="about-page">
        <InnerHero
          title="About Rumax Limited"
          description="Rumax Limited is one of the leading that simultaneously holds CQC registration for domiciliary care and delivers ICH-GCP-compliant clinical trials homecare nursing at a national scale, under a single governance framework and a single point of accountability."
          backgroundImage="rumax-team-hero.png"
        />
        
        <SplitSectionReverse
          title="Our Story"
          image="about-story-banner.png"
          imageAlt="Rumax care team standing beside Rumax banner"
          reverse
          body={[
            "RUMAX LIMITED was founded with a clear and simple mission: to provide high-quality, professional healthcare services where they are most effective and comfortable - in the home.",
            "Our journey began with a focus on Domiciliary Care in Essex. We recognised that for many individuals and families, the best care is not just about clinical tasks; it is about dignity, independence, and the peace of mind that comes from being in familiar surroundings. By combining a compassionate, person-centred approach with rigorous professional standards, we established ourselves as a trusted local provider across Basildon, Southend, Brentwood, and the wider Essex area.",
            "As our reputation for reliability and quality grew, so did our vision. We saw a significant gap in the clinical research landscape: the need for dependable, protocol-driven clinical trial delivery that could reach participants across the UK. Leveraging our deep roots in homecare and our commitment to clinical excellence, we launched our Homecare Clinical Trials Service - and today we are proud to partner with global vendors, CROs, and NHS Trusts to deliver complex protocol activities, from PK sampling to IMP administration, in participants' homes nationwide."
          ]}
        />
        
        <AboutLogoSection />
        
        <div className="about_page_infogrid">
          <InfoGrid title="Our Values" items={aboutValues} />
        </div>
        
        <TeamVideos />
        
        
<section className="AwardsRecognition">
  <div className="AwardsRecognition-container">

    <div className="AwardsRecognition-heading">
      <h2>Awards &amp; Recognition</h2>
    </div>

    <div className="AwardsRecognition-grid">
      {aboutRecognition.map((item) => (
        <article
          className="AwardsRecognition-card"
          key={item.title}
        >
          <img
            src={asset(item.iconAsset ?? "")}
            alt=""
          />

          <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </article>
      ))}
    </div>

  </div>
</section>
        
        <CareCta />
      </div>
    </PageShell>
  );
};

export default AboutPage;