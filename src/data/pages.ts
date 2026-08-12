
// types/index.ts or wherever InfoItem is defined

export type InfoItem = {
  title: string;
  description: string;
  href?: string;
  icon?: string;
  iconAsset?: string | null; // Allow null
  iconTone?: "blue" | "green" | "orange" | "purple" | "navy";
  // Job specific fields
  _id?: string;
  location?: string;
  salary?: string;
  contractType?: string;
  experience?: string;
  availability?: string;
  isRemote?: boolean;
  postedDate?: string;
  daysAgo?: string;
  department?: string;
  jobType?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PolicySection = {
  title: string;
  body?: string[];
  items?: string[];
};

export const aboutValues: InfoItem[] = [
  {
    title: "Compassion",
    icon: "shield",
    iconAsset: "about-value-compassion.svg",
    iconTone: "blue",
    description:
      "We treat every individual - whether a frail elderly resident in Basildon or a clinical trial participant in Aberdeen - with the respect, patience, and kindness they deserve. Care is personal. We never forget that."
  },
  {
    title: "Quality",
    icon: "award",
    iconAsset: "about-value-quality.svg",
    iconTone: "green",
    description:
      "Our ISO 9001:2015 certification and CQC registration are not just compliance badges. They are our promise that every process, every visit, and every interaction is governed by the highest professional standards - independently verified."
  },
  {
    title: "Reliability",
    icon: "shield",
    iconAsset: "about-value-reliability.svg",
    iconTone: "orange",
    description:
      "In both homecare and clinical research, being there when we say we will be is the foundation of trust. Families depend on us. Sponsors depend on us. We do not take that lightly."
  }
];

export const aboutRecognition: InfoItem[] = [
  {
    title: "CQC Registration",
    icon: "award",
    iconAsset: "about-award-cqc-registration.svg",
    iconTone: "purple",
    description: "Personal Care, Treatment of Disease, Disorder or Injury, Nursing Care"
  },
  {
    title: "ISO 9001:2015",
    icon: "award",
    iconAsset: "about-award-iso.svg",
    iconTone: "purple",
    description: "Quality Management Certification"
  },
  {
    title: "CQC Compliance",
    icon: "award",
    iconAsset: "about-award-cqc-compliance.svg",
    iconTone: "purple",
    description: "Fully compliant with all CQC regulatory standards"
  }
];

export const careServiceCards: InfoItem[] = [
  {
    title: "Personal Care & Daily Living",
    icon: "home",
    iconTone: "purple",
    description: "Respectful support with daily routines, hygiene, dressing and wellbeing."
  },
  {
    title: "Dementia Care",
    icon: "heart",
    iconTone: "purple",
    description: "Specialist support focused on familiarity, safety, reassurance and quality of life."
  },
  {
    title: "Medication Support",
    icon: "medical",
    iconTone: "purple",
    description: "Safe prompts and administration support delivered by trained staff within agreed care plans."
  },
  {
    title: "Respite & Live-In Care",
    icon: "clock",
    iconTone: "purple",
    description: "Flexible cover for families and continuous support for people who need around-the-clock care."
  },
  {
    title: "Supported Living",
    icon: "users",
    iconTone: "purple",
    description: "Independence-building support for adults with learning disabilities, autism or mental health needs."
  },
  {
    title: "Family Communication",
    icon: "mail",
    iconTone: "purple",
    description: "Clear updates, responsive office support and regular reviews as care needs change."
  }
];

export const careReasons: InfoItem[] = [
  {
    title: "CQC Registration",
    icon: "award",
    iconTone: "purple",
    description: "Fully regulated and aligned to Care Quality Commission standards."
  },
  {
    title: "Trained Professionals",
    icon: "users",
    iconTone: "purple",
    description: "DBS-checked carers and nurses with person-centred care experience."
  },
  {
    title: "Flexible Support",
    icon: "clock",
    iconTone: "purple",
    description: "From a few hours a week to full-time care, support adapts to the person."
  },
  {
    title: "Personalised Plans",
    icon: "check",
    iconTone: "purple",
    description: "Every plan is shaped around routines, preferences, needs and family input."
  },
  {
    title: "Compassionate Care",
    icon: "heart",
    iconTone: "purple",
    description: "Care is delivered with kindness, patience and respect for each person."
  },
  {
    title: "24/7 Availability",
    icon: "phone",
    iconTone: "purple",
    description: "Office and on-call support help families get timely guidance when needs change."
  }
];

export const careSteps: InfoItem[] = [
  {
    title: "Initial Assessment",
    description: "We begin with a detailed conversation about needs, preferences, routines and goals."
  },
  {
    title: "Personalised Care Plan",
    description: "A tailored plan is created with the individual and their family involved throughout."
  },
  {
    title: "Matched Care Team",
    description: "We match carers with the right experience, skills and personal fit."
  },
  {
    title: "Ongoing Review",
    description: "Care plans are reviewed and adjusted as needs change."
  }
];

export const jobs: InfoItem[] = [
  {
    title: "Research Nurse",
    href: "/careers/research-nurse",
    icon: "briefcase",
    iconAsset: "careers-job-research-nurse.svg",
    description:
      "Rumax Limited is expanding its bank of Research Nurses to support our rapidly growing clinical trials homecare division."
  },
  {
    title: "Phlebotomist Flexible Engagement",
    href: "/careers/research-nurse",
    icon: "medical",
    iconAsset: "careers-job-phlebotomist.svg",
    description: "Rumax Limited recruits qualified Phlebotomists to support blood sample collection for clinical trials in patients' homes."
  },
  {
    title: "Carers",
    href: "/careers/research-nurse",
    icon: "home",
    iconAsset: "careers-job-carers.svg",
    description: "At Rumax Limited, our domiciliary care team supports individuals across Essex to live independently and with dignity in their own homes."
  }
];

export const recruitmentSteps: InfoItem[] = [
  {
    title: "Apply",
    description: "Submit your application and CV"
  },
  {
    title: "Screening",
    description: "Initial review and phone interview"
  },
  {
    title: "Interview",
    description: "In-person or video interview"
  },
  {
    title: "Offer",
    description: "Job offer and pre-employment checks"
  },
  {
    title: "Offer",
    description: "Job offer and pre-employment checks"
  }
];

export const careerSupport: InfoItem[] = [
  {
    title: "Daily Living Skills & Routines",
    icon: "home",
    iconAsset: "careers-support-daily-living.svg",
    iconTone: "navy",
    description: "Support with planning the day, personal routines, managing appointments, and maintaining a comfortable home environment."
  },
  {
    title: "Personal Care (Where Required)",
    icon: "users",
    iconAsset: "careers-support-personal-care.png",
    iconTone: "navy",
    description: "Respectful support with hygiene, dressing, and wellbeing, always delivered in line with an agreed support plan."
  },
  {
    title: "Medication Support (As Agreed)",
    icon: "document",
    iconAsset: "careers-support-medication.svg",
    iconTone: "navy",
    description: "Assistance with medication prompts and safe support within the agreed plan and appropriate scope."
  },
  {
    title: "Community Access & Meaningful Activities",
    icon: "users",
    iconAsset: "careers-support-community.png",
    iconTone: "navy",
    description: "Helping individuals access education, volunteering, hobbies, social activities, and community services."
  },
  {
    title: "Managing Money & Budgeting Support",
    icon: "money",
    iconAsset: "careers-support-budgeting.svg",
    iconTone: "navy",
    description: "Practical help to build skills around budgeting, bills, and safer financial routines."
  },
  {
    title: "Tenancy Support & Maintaining A Home",
    icon: "home",
    iconAsset: "careers-support-tenancy.svg",
    iconTone: "navy",
    description: "Support with tenancy responsibilities, reporting repairs, and developing independent living habits."
  }
];

export const researchNurseResponsibilities = [
  "Provide comprehensive nursing care to patients, including assessment, planning, implementation, and evaluation of care plans",
  "Monitor patient conditions, administer medications, and perform clinical procedures as per physician instructions",
  "Supervise and mentor junior nurses, ensuring adherence to best practices and hospital protocols",
  "Coordinate with doctors, specialists, and multidisciplinary teams to ensure seamless patient care",
  "Maintain accurate and up-to-date patient records and documentation",
  "Respond effectively to medical emergencies and provide critical care when required",
  "Ensure compliance with healthcare regulations, safety standards, and infection control protocols",
  "Educate patients and their families about treatment plans, medications, and post-care instructions",
  "Participate in staff training, performance evaluations, and continuous improvement initiatives",
  "Assist in managing ward operations, staffing schedules, and resource allocation"
];

export const researchNurseRequirements = [
  "Bachelor's degree in Nursing (BSc Nursing) or equivalent qualification",
  "Valid nursing registration/license with the relevant medical council",
  "Minimum 5-7 years of clinical experience, preferably in a hospital or healthcare facility",
  "Proven experience in a supervisory or senior nursing role",
  "Strong knowledge of clinical procedures, patient care standards, and healthcare regulations",
  "Excellent communication, interpersonal, and leadership skills",
  "Ability to work in high-pressure environments and handle critical situations",
  "Proficiency in using hospital management systems and medical software"
];

export const contactMethods: InfoItem[] = [
  {
    title: "Email",
    icon: "mail",
    description: "enquiries@ru-max.co.uk"
  },
  {
    title: "Phone",
    icon: "phone",
    description: "01268 123456 | +44 3330115030"
  },
  {
    title: "Address",
    icon: "location",
    description: "Basildon, Essex, UK"
  },
  {
    title: "Hours",
    icon: "clock",
    description: "Mon-Fri: 9am-5pm | On-call 24/7"
  }
];

export const careFaqs = [
  "What qualifications, training, and experience do your mobile research nurses have?",
  "How do you ensure full ICH GCP E6 (R3) compliance and protocol adherence during home visits?",
  "What is your process for scheduling and coordinating home visits with the investigator site?",
  "How do you manage patient safety, emergency situations, and adverse events during home visits?",
  "How is clinical data collected, documented, and integrated with the investigator site and EDC system?",
  "What geographic areas and countries do you cover, and how do you handle rural or remote patients?",
  "What are the typical costs and pricing models for your mobile nursing services?"
];

export const privacySections: PolicySection[] = [
  {
    title: "Who We Are",
    body: [
      "We are RUMAX LIMITED, a company incorporated in England and Wales. Our registered address is Cornwallis House, Unit 2, Howard Chase, Basildon, Essex, SS14 3BB.",
      "We comply with UK GDPR and all applicable data protection legislation. We are the data controller for information you pass to us through this website and our services."
    ]
  },
  {
    title: "Information You Give Us",
    body: ["You may provide information by completing enquiry forms, requesting marketing information or contacting our team."],
    items: ["Name and contact details", "Postal address", "Phone number", "Care enquiry information", "Marketing preferences"]
  },
  {
    title: "Information We Collect",
    body: ["We may collect technical and usage information when you visit the website."],
    items: [
      "IP address, browser type, device and operating system",
      "Pages visited, time spent on pages and interaction information",
      "Website errors, performance information and referral data"
    ]
  },
  {
    title: "How We Use Information",
    items: [
      "Fulfil our obligations under a contract with you or a service user you represent",
      "Respond to enquiries and provide requested information",
      "Improve website performance and service quality",
      "Maintain records required for governance, safeguarding and compliance"
    ]
  },
  {
    title: "Legitimate Business Purposes",
    body: ["RUMAX LIMITED processes personal information for certain legitimate business purposes."],
    items: [
      "Enhancing, modifying, personalising or improving our services and communications",
      "Administering the website and carrying out data analysis",
      "Troubleshooting, testing and maintaining service quality"
    ]
  },
  {
    title: "How Safe is Your Information?",
    body: [
      "Protecting your security and privacy is important to us. We make every effort to secure information and maintain confidentiality in accordance with data protection legislation.",
      "The website is protected by security technology designed to reduce unauthorised access, processing, accidental loss, destruction and damage."
    ]
  },
  {
    title: "Your Rights",
    body: ["You have rights in relation to the personal data we hold about you."],
    items: ["Right to access", "Right to rectification", "Right to object", "Right to data portability", "Right to erasure"]
  },
  {
    title: "Marketing Preferences",
    body: [
      "If you wish to have your information removed from our database or do not want us to contact you for marketing purposes, use the unsubscribe option in any email or contact us directly."
    ]
  },
  {
    title: "Third Party Sites",
    body: [
      "Our website may contain links to third-party websites. These links are provided for convenience only and we do not control those websites or their privacy practices."
    ]
  },
  {
    title: "Disclosure of Your Information",
    body: [
      "We may share information with trusted service providers, professional advisers, regulators, safeguarding bodies or public authorities where required by law or necessary to deliver services."
    ]
  },
  {
    title: "Retention of Information",
    body: [
      "We retain personal information only for as long as needed for the purpose it was collected, to provide services, respond to enquiries, meet legal obligations and maintain governance records."
    ]
  },
  {
    title: "Passwords and Access",
    body: [
      "Where you have chosen a password or been given one to access parts of the website, you are responsible for keeping that password confidential."
    ]
  },
  {
    title: "Changes to This Policy",
    body: [
      "We may update this policy from time to time. Any updates will be published on this website and, where appropriate, notified through other channels."
    ]
  },
  {
    title: "Complaints & Supervisory Authority",
    body: [
      "If you have concerns about our use of your personal data, please contact us. You also have the right to complain to the Information Commissioner's Office."
    ]
  }
];

export const cookieSections: PolicySection[] = [
  {
    title: "What Are Cookies?",
    body: [
      "Cookies are small text files that a website may place on your computer or mobile device. They help the website recognise your device the next time you visit."
    ]
  },
  {
    title: "How We Use Cookies",
    body: [
      "We use cookies to distinguish you from other users, support a better website experience and understand how our services can be improved."
    ]
  },
  {
    title: "Types of Cookies We Use",
    items: [
      "Strictly necessary cookies for essential website features",
      "Analytical or performance cookies to understand how visitors use the site",
      "Functionality cookies to remember choices you make",
      "Targeting cookies that may help make content more relevant"
    ]
  },
  {
    title: "Third-Party Cookies",
    body: [
      "Third parties such as analytics providers or external services may also use cookies on the website. These are outside our direct control."
    ]
  },
  {
    title: "Managing Cookie Preferences",
    body: [
      "Most browsers accept cookies automatically, but you can change your browser settings to refuse some or all cookies. Blocking essential cookies may affect how the website works."
    ]
  },
  {
    title: "Specific Cookies We Use",
    body: [
      "Some cookies are required for site security, form handling and basic page functionality. Others help us understand how visitors move through the website."
    ],
    items: ["Session cookies", "Analytics cookies", "Preference cookies", "Security cookies"]
  },
  {
    title: "Blocking Cookies",
    body: [
      "Please note that if you choose to block all cookies, including essential cookies, we cannot guarantee that your website experience will be as complete as intended."
    ]
  },
  {
    title: "RUMAX LIMITED",
    body: [
      "For questions about cookies or privacy, contact RUMAX LIMITED at Cornwallis House, Unit 2, Howard Chase, Basildon, Essex, SS14 3BB."
    ]
  },
  {
    title: "Changes to This Cookie Policy",
    body: [
      "We may update this cookie policy to reflect changes to our website, technology or legal requirements. Please check this page periodically for updates."
    ]
  },
  {
    title: "Contact About Cookies",
    body: [
      "If you have questions about how cookies are used on this website, contact the Rumax team using the details provided on our contact page."
    ]
  }
];
