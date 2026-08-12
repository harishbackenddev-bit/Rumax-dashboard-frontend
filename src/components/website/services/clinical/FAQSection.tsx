// components/website/investigator/FAQSection.tsx
import React, { useState } from "react";

export interface FAQItem {
  id?: string | number;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  faqs?: FAQItem[];
  defaultOpenIndex?: number;
  className?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({
  title = "Frequently Asked Questions",
  faqs = [],
  defaultOpenIndex = 0,
  className = "",
}) => {
  // Default FAQs if none provided
  const defaultFaqs: FAQItem[] = [
    {
      id: 1,
      question: "What qualifications, training, and experience do your mobile research nurses have?",
      answer:
        "Our mobile research nurses are NMC-registered, ICH-GCP trained, and experienced in delivering commercial and academic clinical trials across a wide range of therapeutic areas. They hold enhanced DBS and occupational health clearance, complete protocol-specific training before every study, and maintain documented competencies in procedures such as phlebotomy, IMP administration, ECGs, vital signs, infusions, and ePRO support. We keep full CPD and revalidation records, giving sponsors and CROs an audit-ready, fully qualified homecare nursing workforce.",
    },
    {
      id: 2,
      question: "How do you ensure full ICH GCP E6 (R3) compliance and protocol adherence during home visits?",
      answer:
        "We operate a CQC-registered, ISO 9001:2015-certified quality management system aligned with ICH GCP E6 (R3) and MHRA expectations. Every home visit follows the approved study protocol, delegation log, and study-specific work instructions, with nurses trained and signed off before delivery. Source documentation, informed consent processes, IMP accountability, and data capture are all performed to GCP standards, and our governance framework includes monitoring, oversight, and CAPA processes to ensure consistent protocol adherence and inspection readiness.",
    },
    {
      id: 3,
      question: "What is your process for scheduling and coordinating home visits with the investigator site?",
      answer:
        "Our dedicated study management team coordinates all home visits in close partnership with the investigator site and project team. We work within protocol visit windows, liaise directly with site staff and participants, and confirm appointments, IMP availability, and sample logistics in advance. A single point of contact manages scheduling, rescheduling, and visit confirmation, with structured reporting back to the site and sponsor so that home visits are fully integrated with site activities and trial timelines.",
    },
    {
      id: 4,
      question: "How do you manage patient safety, emergency situations, and adverse events during home visits?",
      answer:
        "Patient safety is central to our homecare delivery. Our nurses are trained in emergency response, anaphylaxis management, and basic/immediate life support as appropriate to the protocol, and they follow defined escalation pathways to the Principal Investigator and emergency services. Adverse events and serious adverse events are identified, documented, and reported promptly in line with GCP and the study's pharmacovigilance requirements. Risk assessments, lone-worker policies, and clear SOPs ensure every visit is delivered safely for both patients and staff.",
    },
    {
      id: 5,
      question: "How is clinical data collected, documented, and integrated with the investigator site and EDC system?",
      answer:
        "Our nurses capture clinical data accurately at the point of care using source documents and study-specific worksheets, following ALCOA+ data integrity principles. Source data and visit records are transferred securely to the investigator site for entry into the EDC system, or entered directly where the protocol and delegation permit. We maintain clear documentation trails, support source data verification, and ensure timely, complete, and compliant data flow that integrates seamlessly with the site's records and sponsor systems.",
    },
    {
      id: 6,
      question: "What geographic areas and countries do you cover, and how do you handle rural or remote patients?",
      answer:
        "We provide nationwide clinical trials homecare coverage across UK, supported by a flexible, scalable network of mobile research nurses. For rural and remote participants, we plan visits efficiently using regional nurse coverage and careful route and logistics management, ensuring cold-chain integrity for IMP and samples even in harder-to-reach locations. This broad geographic reach helps sponsors and CROs improve patient access, recruitment, and retention regardless of where participants live.",
    },
    {
      id: 7,
      question: "What are the typical costs and pricing models for your mobile nursing services?",
      answer:
        "Our pricing is tailored to each study's protocol, visit complexity, duration, and geographic spread. We typically offer transparent models such as per-visit fees, hourly nursing rates, or study-based packages, with clear costing for mileage, specialist nursing (e.g. RMNs), and any additional procedures. Following a short feasibility and requirements review, we provide a detailed, itemised quotation or rate card, ensuring sponsors and CROs receive competitive, predictable pricing with no hidden costs.",
    },
  ];

  const faqItems = faqs.length > 0 ? faqs : defaultFaqs;
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className={`page-main-custom fq-section ${className}`}>
      <div className="top-level-div">
        <div className="page-section__heading">
          <h2 className="fq-title">{title}</h2>
        </div>
      </div>

      <div className="fq-list" id="fqList">
        {faqItems.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.id || index}
              className={`fq-item ${isOpen ? 'is-open' : ''}`}
              data-index={index + 1}
            >
              <button
                className="fq-trigger"
                aria-expanded={isOpen}
                onClick={() => toggleAccordion(index)}
              >
                <span className="fq-question">
                  <span className="fq-number">{index + 1}.</span> {faq.question}
                </span>
                <span className="fq-icon">
                  {/* Minus icon - shown when open */}
                  <svg
                    className="minus"
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: isOpen ? 'block' : 'none' }}
                  >
                    <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="#12086F" />
                    <path d="M31 23H13V21H31V23Z" fill="#12086F" />
                  </svg>
                  {/* Plus icon - shown when closed */}
                  <svg
                    className="plus"
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: isOpen ? 'none' : 'block' }}
                  >
                    <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="#AFAFAF" />
                    <path d="M31 23H13V21H31V23Z" fill="#AFAFAF" />
                    <path d="M23 13L23 31H21L21 13H23Z" fill="#AFAFAF" />
                  </svg>
                </span>
              </button>
              <div className="fq-panel">
                <div className="fq-panel-inner">
                  <p className="fq-answer">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;