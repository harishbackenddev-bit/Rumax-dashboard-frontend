
import { InnerHero, PageShell, PolicyArticle } from "@/components/pages/InnerPages";
import { privacySections } from "@/data/pages";



export default function GdprPrivacyPage() {
  return (
    <PageShell>
      <InnerHero
        eyebrow="GDPR & Privacy"
        title="GDPR & Privacy"
        description="We are committed to protecting privacy and complying with UK GDPR and data protection legislation."
        backgroundImage="rumax-team-hero.png"
      />
      <PolicyArticle
        title="GDPR & Privacy"
        description="This page summarises how Rumax collects, uses and protects personal information."
        sections={privacySections}
      />
    </PageShell>
  );
}
