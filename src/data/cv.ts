export const profile = {
  name: "Surya Prathap Suresh",
  initials: "SPS",
  tagline:
    "Software developer with two years of hands-on experience and proven managerial skills — now completing an MSc in Management, aiming for roles that blend technical expertise with leadership.",
  eyebrow: "Software development · ServiceNow · MSc Management candidate",
  preparedFor: "Nottingham, United Kingdom · 2026",
  chips: [
    "ServiceNow",
    "Python",
    "SQL",
    "JavaScript",
    "GitHub",
    "GlideAjax",
  ],
};

export const contact = {
  email: "suryaprathaps345@gmail.com",
  phone: "+44 7512 065323",
  location: "Nottingham, United Kingdom",
};

export type WorkItem = {
  tag: string;
  title: string;
  body: string[];
  bullets?: string[];
  status?: string;
  note?: string;
  wide?: boolean;
};

export const work: WorkItem[] = [
  {
    tag: "Management consultancy competition · University of Nottingham · 2026",
    title: "ApplyU AI — admissions strategy",
    wide: true,
    body: [
      "Collaborated in a cross-functional team to develop a market entry strategy for an AI-powered university admissions platform.",
      "Designed a trust and governance framework covering AI ethics, data privacy, stakeholder concerns and an implementation roadmap.",
    ],
    bullets: [
      "Conducted market research and analysed admissions pain points",
      "Evaluated AI use cases to recommend a low-risk adoption strategy",
      "Presented recommendations, pilot success metrics and a go-to-market plan",
    ],
    status: "University of Nottingham · 2026",
  },

  {
    tag: "Part-time · November 2025 – Present",
    title: "Retail Assistant — JD",
    body: [
      "Interact with customers face to face, understanding their needs and helping them find what they are looking for.",
      "Handle customer requirements on the shop floor while balancing part-time work with full-time MSc study — building communication, responsibility and time management.",
    ],
    status: "Nottingham, United Kingdom",
  },
  {
    tag: "Software development · September 2023 – September 2025 · Bengaluru",
    title: "Associate Software Developer — Right Prompt Technologies",
    body: [
      "Design, development and deployment of ServiceNow web applications with complex flows and features for the insurance and financial sectors.",
      "Reviewed business requirement documents (BRD), prepared functional specification documents (FSD) and attended client and business requirement meetings.",
    ],
    bullets: [
      "Built a customisable ServiceNow portal using widgets for the Smart Assurance Aggregator, enabling a seamless end-to-end insurance policy purchase journey",
      "Developed and integrated the Underwriter Portal for managing existing policy cases",
      "Implemented SOP requests and REST messages to connect ServiceNow with external platforms",
    ],
    wide: true,
    status: "2 years · Full-time",
  },
];

export const education = [
  {
    degree: "MSc Management",
    school: "University of Nottingham",
    detail: "Nottingham, United Kingdom",
    period: "September 2025 – September 2026",
  },
  {
    degree: "B.E. Information Science and Engineering",
    school: "Vidyavardhaka College of Engineering",
    detail: "Mysuru, Karnataka",
    period: "August 2019 – June 2023",
  },
];

export const certifications = [
  "ServiceNow Certified System Administrator (CSA)",
  "ServiceNow Certified Application Developer (CAD)",
  "ServiceNow Certified Implementation Specialist — Customer Service Management (CSM)",
];

export const projects = [
  {
    tag: "Web application",
    title: "Online Course Management System",
    body: "Web app built with HTML, PHP and CSS on the front end and MySQL for the database, running on a XAMPP Apache server — designed to improve the quality, efficiency and flexibility of teaching and learning in higher education.",
  },
  {
    tag: "Blockchain & cloud security",
    title: "Secure Cloud Fund Transfer using Blockchain",
    body: "Integrated blockchain (Ethereum, MetaMask) with cloud computing, hosted on Amazon EC2, to create a secure fund transfer mechanism with enhanced data confidentiality, integrity and reliability.",
  },
];

export const skills = [
  {
    title: "Languages",
    items: ["Python", "HTML", "CSS", "JavaScript", "SQL"],
  },
  {
    title: "Developer tools",
    items: ["ServiceNow", "VS Code", "Figma"],
  },
  {
    title: "Technologies & frameworks",
    items: ["GitHub", "GlideAjax"],
  },
];

export const strengths =
  "Client requirement analysis (BRD → FSD) · Cross-functional collaboration · Time management · Communication · Translating business needs into working software";

export const interests = [
  "Dancing",
  "Agriculture",
  "Music",
  "District-level Kabaddi player — inter-school and inter-district competitions",
  "Active member of college cultural and sports teams",
];

export const tickerItems = [
  "ServiceNow",
  "Python",
  "SQL",
  "JavaScript",
  "HTML & CSS",
  "GlideAjax",
  "GitHub",
  "Figma",
  "MSc Management",
  "Blockchain & cloud",
  "Client workshops",
];

export const linkedin = "https://www.linkedin.com/in/surya-prathap-suresh-065a70253/";

export type Recommendation = { quote: string; name: string; role: string };

// LinkedIn recommendations are shown via the profile link — no inline display.
export const recommendations: Recommendation[] = [];
