import { FormInputField, FormTextareaField, type FieldIconName } from "@/components/pages/PageFormControls";

type EnquiryType = "care" | "research";

type FieldConfig = {
  icon?: FieldIconName;
  label: string;
  placeholder: string;
};

const enquiryTabs: Array<{ id: EnquiryType; label: string; description: string; buttonLabel: string }> = [
  {
    id: "care",
    label: "Care Enquiry",
    description: "Tell us about your care needs and we will arrange a free, no-obligation assessment.",
    buttonLabel: "Apply Now"
  },
  {
    id: "research",
    label: "Research Enquiry",
    description: "Tell us about your study, protocol needs, location and visit requirements.",
    buttonLabel: "Apply Now"
  }
];

const careFields: FieldConfig[] = [
  { label: "Full Name*", placeholder: "John Smith", icon: "user" },
  { label: "Relationship to Client", placeholder: "Select" },
  { label: "Email Address*", placeholder: "sarah@example.com", icon: "mail" },
  { label: "Phone Number*", placeholder: "00 23 456 7890", icon: "phone" },
  { label: "Postcode", placeholder: "Select" },
  { label: "Type of Care Required", placeholder: "Select" },
  { label: "When do you need care?", placeholder: "Select" },
  { label: "Funding Type", placeholder: "Select" }
];

const researchFields: FieldConfig[] = [
  { label: "Full Name*", placeholder: "John Smith", icon: "user" },
  { label: "Organization", placeholder: "Enter Organization Name" },
  { label: "Job Title", placeholder: "e.g. Study Manager" },
  { label: "Email Address*", placeholder: "sarah@example.com", icon: "mail" },
  { label: "Regions/Locations Required", placeholder: "Select" },
  { label: "Support Required", placeholder: "Select" },
  { label: "Timeline", placeholder: "Select" },
  { label: "Funding Type", placeholder: "Select" }
];

export function TabbedAssessmentForm({ activeTab = "care" }: { activeTab?: EnquiryType }) {
  const activeConfig = enquiryTabs.find((tab) => tab.id === activeTab) ?? enquiryTabs[0];
  const fields = activeTab === "care" ? careFields : researchFields;

  return (
    <section className="page-section assessment-section tabbed-assessment-section" id="assessment-form">
      <div className="container assessment-section__inner">
        <div className="page-section__heading">
          <h2>Request A Free Assessment</h2>
          <p>{activeConfig.description}</p>
        </div>

        <div className="form-tabs" aria-label="Enquiry type">
          {enquiryTabs.map((tab) => (
            <a
              aria-pressed={activeTab === tab.id}
              className={activeTab === tab.id ? "is-active" : undefined}
              href={`/contact-us?enquiry=${tab.id}#assessment-form`}
              key={tab.id}
              role="button"
            >
              {tab.label}
            </a>
          ))}
        </div>

        <form
          className="assessment-form"
          id={`${activeTab}-enquiry-panel`}
          key={activeTab}
        >
          <div className="form-grid">
            {fields.map((field) => (
              <FormInputField
                icon={field.icon}
                key={field.label}
                label={field.label}
                placeholder={field.placeholder}
                type="text"
              />
            ))}
          </div>
          <FormTextareaField
            icon="message"
            label="Additional information"
            rows={6}
            placeholder={
              activeTab === "care"
                ? "Please share any relevant details about care needs, medical conditions, or specific requirements..."
                : "Please share protocol requirements, visit procedures, sample handling needs, timelines, and coverage areas..."
            }
          />
          <button type="submit">{activeConfig.buttonLabel}</button>
        </form>
      </div>
    </section>
  );
}
