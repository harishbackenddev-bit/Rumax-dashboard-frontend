export const asset = (name: string) => `/assets/figma-exported/${name}`;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/domiciliary-and-personal-care", hasIcon: true },
  { label: "Funding & Cost", href: "/pricing-and-funding" },
  { label: "About Us", href: "/about-us" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact-us" }
];

export const serviceDropdownLinks = [
  { label: "Domiciliary Care/Personal Care Service", href: "/domiciliary-and-personal-care" },
  { label: "Supported Living Service", href: "/supported-living" },
  { label: "Training", href: "/training-service" }
];

export const socialLinks = [
  { label: "Facebook", icon: "rumax-facebook.svg" },
  { label: "Instagram", icon: "rumax-instagram.svg" },
  { label: "LinkedIn", icon: "rumax-linkedin.svg" },
  { label: "X", icon: "rumax-twitter.svg" }
];

export const footerSocialLinks = [
  { label: "Facebook", icon: "rumax-footer-facebook.svg" },
  { label: "Instagram", icon: "rumax-footer-instagram.svg" },
  { label: "LinkedIn", icon: "rumax-footer-linkedin.svg" },
  { label: "X", icon: "rumax-footer-twitter.svg" }
];

export const areaPills = ["Basildon", "Rochford", "Leigh-on-Sea", "Brentwood", "Wickford"];

export const services = [
  {
    number: "01",
    title: "Domiciliary & Personal Care",
    href: "/domiciliary-and-personal-care",
    icon: "rumax-service-domiciliary.svg",
    description: "Compassionate care including end of life that focuses on choice, dignity, independence and privacy.",
    tags: ["Personal Care", "Medication Support", "Companionship"]
  },
  {
    number: "02",
    title: "Supported Living",
    href: "/supported-living",
    icon: "rumax-service-supported.svg",
    largeIcon: true,
    description: "Empowering individuals with learning disabilities, mental health needs, or physical challenges to live independently.",
    tags: ["24/7 Support", "Independent Living", "Community Integration"]
  },
  {
    number: "03",
    title: "Investigator Site Support",
    href: "/contact-us",
    icon: "rumax-service-investigator.svg",
    largeIcon: true,
    description: "End-to-end operational and clinical support for sponsors, CROs, and research teams across decentralised trials.",
    tags: ["Protocol Compliance", "Data Collection", "Patient Safety"]
  },
  {
    number: "04",
    title: "Training Services",
    href: "/training-service",
    icon: "figma-service-training.png",
    largeIcon: true,
    description: "Professional healthcare training programs designed to equip caregivers and healthcare professionals with practical skills.",
    tags: ["Certified Training", "Practical Learning", "Industry Compliance"]
  }
];

export const complianceLogos = [
  { label: "ECA", icon: "rumax-compliance-eca.png" },
  { label: "CQC", icon: "rumax-compliance-cqc.png" },
  { label: "NHS", icon: "rumax-compliance-nhs.png" },
  { label: "ICO", icon: "rumax-compliance-ico.png" },
  { label: "ISO", icon: "rumax-compliance-iso.png" },
  { label: "Cyber Essentials", icon: "rumax-compliance-cyber.png" }
];

export const trustFeatures = [
  {
    title: "Personalised Care Plans",
    icon: "rumax-feature-personalised.svg",
    description: "Every individual receives care tailored to their needs, lifestyle and preferences."
  },
  {
    title: "Highly Skilled Professionals",
    icon: "rumax-feature-skilled.svg",
    description: "Our team includes experienced caregivers and clinically trained professionals."
  },
  {
    title: "Compassionate Approach",
    icon: "rumax-feature-compassion.svg",
    description: "We prioritise empathy, dignity, respect, and emotional wellbeing in every interaction."
  },
  {
    title: "Reliable & Consistent Care",
    icon: "rumax-feature-reliable.svg",
    description: "Dependable support delivered with professionalism, punctuality, and continuity."
  },
  {
    title: "Clinical Excellence",
    icon: "rumax-feature-clinical.svg",
    description: "Supporting healthcare providers with precise clinical services and high standards."
  },
  {
    title: "100+ Families Supported",
    icon: "rumax-feature-families.svg",
    description: "Trusted by families across the UK with a proven track record of exceptional care."
  }
];

export const reviews = [
  {
    name: "Oliver Simpson",
    date: "7 months ago",
    avatar: "rumax-review-avatar-o.svg",
    text: "Rumax have been caring for my mother for the past three years. The carers are always cheerful and friendly."
  },
  {
    name: "Jacqueline Taylor",
    date: "8 months ago",
    avatar: "rumax-review-avatar-j.svg",
    text: "The carers are good at informing me if there is a medical issue with my mum."
  },
  {
    name: "Joanne J",
    date: "8 months ago",
    avatar: "rumax-review-avatar-j2.svg",
    text: "Cant say thankyou enough, one of the best care decisions we have made."
  }
];

export const videos = [
  {
    size: "small",
    thumb: "rumax-video-left.png",
    playIcon: "rumax-play-small-left.svg",
    label: "Play patient journeys video",
    alt: "Patient journeys video thumbnail"
  },
  {
    size: "large",
    thumb: "rumax-video-main.png",
    playIcon: "rumax-play-main.svg",
    label: "Play supported living video",
    alt: "Supported living video thumbnail"
  },
  {
    size: "small",
    thumb: "rumax-video-right.png",
    playIcon: "rumax-play-small-right.svg",
    label: "Play clinical care video",
    alt: "Clinical care video thumbnail"
  }
];

export const ctaLinks = [
  { label: "Contact Our Clinical Trails", href: "/contact-us", icon: "rumax-cta-callback.svg" },
  { label: "Schedule a Capacity Presntation", href: "/self-assessment", icon: "rumax-cta-assessment.svg" },
  { label: "Rumax Careers", href: "/careers", icon: "rumax-cta-careers.svg" }
];

export const locationCards = ["Rayleigh", "Rochford", "Leigh on Sea", "Brentwood", "Basildon", "Wickford"];

export const footerLinks = {
  useful: [
    { label: "Home", href: "/" },
    { label: "About us", href: "/about-us" },
    { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Domiciliary Care", href: "/domiciliary-and-personal-care" },
    { label: "Supported Living", href: "/supported-living" },
    { label: "Training Services", href: "/training-service" }
  ],
  locations: [
    { label: "Rayleigh", accent: true },
    { label: "Billericay" },
    { label: "Rochford", accent: true },
    { label: "Chelmsford" },
    { label: "Leigh On Sea", accent: true },
    { label: "Maldon" },
    { label: "Brentwood", accent: true },
    { label: "Rawreth" },
    { label: "Basildon", accent: true },
    { label: "Eastwood" },
    { label: "Wickford", accent: true },
    { label: "Southend On Sea" },
    { label: "Hadleigh" },
    null,
    { label: "Hullbridge" },
    null,
    { label: "Pitsea" },
    null,
    { label: "Laindon" },
    null
  ],
  company: [
    { label: "GDPR", href: "/gdpr-and-privacy" },
    { label: "GDPR & Privacy", href: "/gdpr-and-privacy" },
    { label: "Privacy & Cookie Policy", href: "/privacy-policy" },
    { label: "Cookie Policy", href: "/cookie-policy" }
  ],
  resources: [
    { label: "Self Assessment", href: "/self-assessment" },
    { label: "Care Estimator", href: "/care-calculator" },
    { label: "Complaints, Concerns & Feedback", href: "/complaints-concerns-feedback" },
    { label: "Referral", href: "/referral" }
  ]
};

export const footerBadges = [
  { label: "ECA", icon: "rumax-footer-eca.png" },
  { label: "CQC", icon: "rumax-footer-cqc.png" },
  { label: "ICO", icon: "rumax-footer-ico.png" },
  { label: "NHS", icon: "rumax-footer-nhs.png" },
  { label: "ISO", icon: "rumax-footer-iso.png" },
  { label: "Cyber Essentials", icon: "rumax-footer-cyber.png" }
];
