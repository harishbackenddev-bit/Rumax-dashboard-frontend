
import { InnerHero, PageShell, PolicyArticle } from "@/components/pages/InnerPages";
import { privacySections } from "@/data/pages";



export default function PrivacyPolicyPage() {
  return (
    <PageShell>
      <InnerHero
        eyebrow="Privacy & Cookie Policy"
        title="Privacy & cookie policy"
        description="Clear information about the personal data we collect, the reasons we use it and the choices available to you."
        backgroundImage="rumax-team-hero.png"
      />
      <PolicyArticle
        title="Privacy Policy"
        description="Rumax uses personal information to respond to enquiries, provide services, meet governance obligations and improve our website."
        sections={privacySections}
      />
    </PageShell>
  );
}
