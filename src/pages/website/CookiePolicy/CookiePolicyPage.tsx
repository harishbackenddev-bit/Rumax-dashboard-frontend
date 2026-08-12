
import { InnerHero, PageShell } from "@/components/pages/InnerPages";



const introSections = [
  [
    "What Are Cookies?",
    'Cookies are small text files which a website may put on your computer or mobile device when you first visit the website. The cookies will help the website recognise your device the next time you visit. Web beacons or other similar files can also do the same thing. We use the term "cookies" in this policy to refer to all files that collect information in this way.'
  ],
  [
    "How We Use Cookies",
    "We use cookies to distinguish you from other users of the website. This helps us to provide you with a good experience when you use the website and also allows us to improve the services we provide to you.\n\nOn revisiting the website, we will be able to obtain information about your previous visits and about your computer including where available, your IP address, operating system and browser type, for system administration. This is statistical data about your browsing actions and patterns and does not identify you. For the same reason, we may obtain information about your general internet usage by using a cookie file which is stored on the hard drive of your computer."
  ]
];

const closingSections = [
  [
    "Third-Party Cookies",
    "Please note that third parties (such as advertising networks and providers of external services) may also use cookies on the website, over which we have no control. These cookies are likely to be analytical cookies, performance cookies or targeting cookies."
  ],
  [
    "Managing Your Cookie Preferences",
    'Most browsers accept cookies automatically, but you can change your cookie preferences by adjusting your browser settings to refuse the setting of all or some cookies if you prefer. You can usually do this by visiting the "options" or "preferences" menu on your browser.'
  ]
];

const cookieTypes: Array<[string, string]> = [];

cookieTypes.push([
  "Strictly Necessary Cookies",
  "These are cookies that are essential in order to enable you to move around the website and use its features, such as accessing secure areas of the website. Disabling them may mean you are not able to access parts of our website."
]);

cookieTypes.push([
  "Analytical or Performance Cookies",
  "We use these cookies to collect information about how visitors use the website, for instance which pages visitors go to most. This helps us improve the way our website works and monitor website traffic using industry accepted third parties."
]);

cookieTypes.push([
  "Functionality Cookies",
  "These cookies are used to recognise you when you return to our website and to remember changes you have made to things such as text size, fonts and other parts of the website so we can personalise our content for you."
]);

cookieTypes.push([
  "Targeting Cookies",
  "We use these cookies to record your visit to our website, the pages you have visited and the links you have followed. We use this information to make our website and advertising more relevant to your interests."
]);

const cookieRows = [
  ["Session Cookie", "_session_id", "Maintains your session while browsing the website", "End of session"],
  ["Preferences", "_user_prefs", "Remembers your preferences and settings", "1 year"],
  ["Analytics", "_analytics", "Helps us understand how you use the website", "2 years"]
];

export default function CookiePolicyPage() {
  return (
    <PageShell>
      <InnerHero
        className="inner-hero--domiciliary"
        title="GDPR"
        description="How we use cookies and similar technologies on our website"
        backgroundImage="rumax-office-hero.png"
        showScrollCue
      />
      <main className="cookie-policy-page">
        <div className="cookie-policy-page__inner">
          {introSections.map(([title, body]) => (
            <section className="cookie-policy-copy" key={title}>
              <h2>{title}</h2>
              {body.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <section className="cookie-types-band">
          <div className="cookie-types-band__inner">
            <h2>Types Of Cookies We Use</h2>
            <div className="cookie-type-grid">
              {cookieTypes.map(([title, body], index) => (
                <article className="cookie-type-card" key={title}>
                  <span className={`cookie-type-card__icon cookie-type-card__icon--${index + 1}`} aria-hidden="true" />
                  <span className="cookie-type-card__number">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cookie-table-section">
          <div className="cookie-table-section__inner">
            <h2>Specific Cookies We Use</h2>
            <div className="cookie-table">
              <div className="cookie-table__row cookie-table__row--head">
                <span>Cookie Title</span>
                <span>Cookie Name</span>
                <span>Purpose</span>
                <span>Expiry</span>
              </div>
              {cookieRows.map((row) => (
                <div className="cookie-table__row" key={row[1]}>
                  {row.map((cell) => (
                    <span key={cell}>{cell}</span>
                  ))}
                </div>
              ))}
            </div>

            <div className="cookie-policy-page__inner cookie-policy-page__inner--closing">
              {closingSections.map(([title, body]) => (
                <section className="cookie-policy-copy" key={title}>
                  <h2>{title}</h2>
                  <p>{body}</p>
                </section>
              ))}

              <aside className="cookie-notice">
                <h3>Important Notice</h3>
                <p>Please note that if you choose to block all cookies (including essential cookies) we cannot guarantee that your experience will be as fulfilling as it would otherwise be, and you may not be able to access all or parts of our website.</p>
              </aside>

              <section className="cookie-contact-block">
                <h3>RUMAX LIMITED</h3>
                <address className="cookie-contact">
                  <span>Cornwallis House, Unit 2, Howard Chase</span>
                  <span>Basildon, Essex, SS14 3BB</span>
                  <span>United Kingdom</span>
                  <span>Phone: 03330115030</span>
                  <span>Last Reviewed: 02/03/2023</span>
                  <span>Last Amended: 02/03/2023</span>
                </address>
              </section>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
