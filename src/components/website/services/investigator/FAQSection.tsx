// components/website/investigator/FAQSection.tsx
import React, { useState } from "react";

interface FAQItem {
  number: number;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  faqs?: FAQItem[];
}

const FAQSection: React.FC<FAQSectionProps> = ({
  title = "Frequently Asked Questions",
  faqs = [],
}) => {
  const defaultFaqs = [
    {
      number: 1,
      question: "What support do your nurses provide to investigator sites?",
      answer:
        "Our site support nurses act as an extension of your team, assisting with study visits, data collection, source documentation, patient follow-ups, and administrative tasks to reduce site workload.",
    },
    {
      number: 2,
      question: "How do your nurses ensure they work seamlessly with our site?",
      answer:
        "Our nurses integrate closely with your existing workflows, communicating regularly with site staff and following your established protocols to ensure a smooth, coordinated experience for every study visit.",
    },
    {
      number: 3,
      question: "Are your nurses trained in GCP and regulatory requirements?",
      answer:
        "Yes, every nurse completes Good Clinical Practice training and stays current on relevant regulatory requirements to ensure compliance throughout the course of your study.",
    },
    {
      number: 4,
      question: "Can your nurses perform protocol-specific procedures at the site or at patients' homes?",
      answer:
        "Our nurses are trained to perform protocol-specific procedures both at the investigator site and in patients' homes, giving your study the flexibility to meet participants where they are.",
    },
    {
      number: 5,
      question: "How quickly can you provide site support, nurses?",
      answer:
        "Turnaround depends on study needs, but we typically place qualified nurses at your site within days of confirming the request, minimizing delays to your enrollment timeline.",
    },
  ];

  const faqItems = faqs.length > 0 ? faqs : defaultFaqs;
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="page-main-custom fq-section">
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
              key={index}
              className={`fq-item ${isOpen ? 'is-open' : ''}`}
              data-index={faq.number}
            >
              <button
                className="fq-trigger"
                aria-expanded={isOpen}
                onClick={() => toggleAccordion(index)}
              >
                <span className="fq-question">
                  <span className="fq-number">{faq.number}.</span> {faq.question}
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
                    <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="#12086F"/>
                    <path d="M31 23H13V21H31V23Z" fill="#12086F"/>
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
                    <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="#AFAFAF"/>
                    <path d="M31 23H13V21H31V23Z" fill="#AFAFAF"/>
                    <path d="M23 13L23 31H21L21 13H23Z" fill="#AFAFAF"/>
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