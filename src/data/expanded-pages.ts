export const careCalculatorSteps = [
  {
    id: "1",
    title: "Are daily personal care routines becoming difficult?",
    description: "Consider activities like bathing, dressing, grooming, and personal hygiene.",
    options: [
      "Independent - manages all personal care without help",
      "Needs slight help - occasional assistance needed",
      "Needs daily assistance - regular help required",
      "Fully dependent - requires complete assistance"
    ]
  },
  {
    id: "2",
    title: "Is mobility decreasing or are safety risks increasing?",
    description: "Think about walking, transferring from bed to chair, balance, and fall risks.",
    options: [
      "Safe & independent - no mobility concerns",
      "Slightly unsteady - minor balance issues",
      "Recent fall or difficulty - clear mobility challenges",
      "High risk or dependent - significant safety concerns"
    ]
  },
  {
    id: "3",
    title: "Are meals, nutrition, and household upkeep maintained?",
    description: "Consider meal preparation, grocery shopping, eating habits, and home cleanliness.",
    options: [
      "Fully independent - manages all household tasks",
      "Occasional help needed - mostly independent",
      "Poor nutrition or clutter - struggling with basics",
      "Unsafe environment - cannot manage household"
    ]
  },
  {
    id: "4",
    title: "Are health and medication managed correctly?",
    description: "Think about taking medications on time, attending appointments, and managing health conditions.",
    options: [
      "Fully managed - handles all health needs independently",
      "Needs reminders - occasional prompting required",
      "Missed doses - frequently forgets medications",
      "Cannot manage - needs complete health supervision"
    ]
  },
  {
    id: "5",
    title: "Are there changes in memory, mood, or social connection?",
    description: "Consider cognitive function, emotional wellbeing, social engagement, and behavioral changes.",
    options: [
      "Active & engaged - socially connected with good cognition",
      "Mild forgetfulness - some memory lapses",
      "Confusion or isolation - noticeable cognitive or social decline",
      "Severe cognitive issues - significant mental health concerns"
    ]
  }
];

export const referralSteps = [
  {
    id: "1",
    title: "Patient Details",
    description: "Tell us who needs support and how we can reach the right contact.",
    fields: ["Full Name", "Date of Birth", "Postcode", "Primary Contact", "Phone Number", "Email Address"]
  },
  {
    id: "2",
    title: "Care Requirements",
    description: "Share the reason for referral and the support that is currently needed.",
    fields: ["Referral Source", "Type of Support", "Discharge Date", "Current Risks", "Mobility Notes", "Medication Needs"]
  },
  {
    id: "3",
    title: "Clinical Information",
    description: "Add health details, diagnosis, equipment and safeguarding information.",
    fields: ["Diagnosis", "Medical History", "Equipment Required", "Allergies", "Safeguarding Notes", "Consent Confirmed"]
  },
  {
    id: "4",
    title: "Funding & Schedule",
    description: "Confirm funding route, visit frequency and target start date.",
    fields: ["Funding Type", "Package Hours", "Preferred Start Date", "Visit Frequency", "Preferred Times", "Urgency"]
  },
  {
    id: "5",
    title: "Review & Submit",
    description: "Review the referral details and submit securely to the Rumax team.",
    fields: ["Referrer Name", "Organisation", "Referrer Email", "Referrer Phone", "Additional Notes"]
  }
];

export const complaintsVariants = [
  {
    id: "care",
    label: "Care Services",
    eyebrow: "Enquire About Our Services",
    title: "Complaints, Concerns & Feedback",
    description: "We listen carefully, respond quickly and use feedback to improve care quality."
  },
  {
    id: "clinical",
    label: "Clinical Trials",
    eyebrow: "Enquire About Clinical Trial Services",
    title: "Complaints, Concerns & Feedback",
    description: "Raise concerns about research nursing, home visits or clinical trial service delivery."
  },
  {
    id: "site",
    label: "Investigator Support",
    eyebrow: "Enquire About Investigator Site Support Services",
    title: "Complaints, Concerns & Feedback",
    description: "Share feedback about investigator site support, protocol delivery or operational coordination."
  }
];

export const locations = [
  {
    slug: "basildon",
    name: "Basildon",
    description: "Home care, personal care and support services across Basildon and nearby communities."
  },
  {
    slug: "brentwood",
    name: "Brentwood",
    description: "Reliable care support for families and individuals across Brentwood."
  },
  {
    slug: "leigh-on-sea",
    name: "Leigh On Sea",
    description: "Compassionate home care services for Leigh-on-Sea and surrounding areas."
  },
  {
    slug: "rayleigh",
    name: "Rayleigh",
    description: "Personalised care and support services delivered around Rayleigh."
  },
  {
    slug: "rochford",
    name: "Rochford",
    description: "Local care support for Rochford, families and referral partners."
  },
  {
    slug: "wickford",
    name: "Wickford",
    description: "Flexible care services for people living independently in Wickford."
  }
];

export const trainingTabs = [
  {
    id: "overview",
    label: "Overview",
    title: "Training Services",
    description: "Professional healthcare training programmes for carers, support workers and clinical teams."
  },
  {
    id: "person-centred",
    label: "Person-Centred Support",
    title: "Person-Centred Support",
    description: "Build confident, respectful care practice around individual needs, preferences and outcomes."
  },
  {
    id: "moving-handling",
    label: "Moving & Handling",
    title: "Moving & Handling",
    description: "Practical techniques for safer transfers, mobility support and risk-aware care delivery."
  },
  {
    id: "medication",
    label: "Medication",
    title: "Medication Administration",
    description: "Safe medication support, prompts, records, escalation and care-plan compliance."
  },
  {
    id: "safeguarding",
    label: "Safeguarding",
    title: "Safeguarding Adults",
    description: "Recognise concerns, record accurately and respond through the right safeguarding pathway."
  },
  {
    id: "clinical",
    label: "Clinical Skills",
    title: "Clinical Skills",
    description: "Training for research visits, observations, documentation and quality-controlled service delivery."
  }
];
