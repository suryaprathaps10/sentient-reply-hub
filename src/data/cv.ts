export const profile = {
  name: "Surya Prathap Suresh",
  initials: "SPS",
  tagline:
    "I look for the friction in a process, understand what is causing it, and turn the problem into a practical software solution.",
  eyebrow: "Software engineering · Automation · AI-assisted development",
  preparedFor: "Prepared for Clear Rock AI · 2026",
  github: "https://github.com/",
  chips: [
    "Workflow automation",
    "Java",
    "SQL",
    "React / Node.js",
    "AI coding tools",
  ],
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
    tag: "Process automation · Professional experience",
    title: "Client self-service for a recurring freeze / unfreeze workflow",
    wide: true,
    body: [
      "Problem. A recurring monthly process depended on clients emailing a support team to request freeze/unfreeze actions. This created avoidable manual coordination across client and internal teams.",
      "Contribution. Helped move the process toward a client-initiated workflow, reducing reliance on email-based support intervention. The work involved coordination across UW and Groups teams.",
      "Why it matters. Understand the existing process, identify unnecessary hand-offs, and make the desired action easier and more repeatable.",
    ],
    status: "Completed experience",
    note: "Exact tools, approval controls and verified time or ticket reduction to be added before submitting. No impact figures are invented here.",
  },
  {
    tag: "Product project · In progress",
    title: "FrameVibe",
    body: [
      "A creator-focused project intended to support short-form content workflows: product thinking, repository structure, and frontend/backend decisions.",
    ],
    note: "Only implemented features are listed. Repository and live demo to be linked once available.",
  },
  {
    tag: "AI engineering · Next build",
    title: "AI support-workflow assistant",
    body: [
      "A proposed project to demonstrate hands-on LLM engineering: classify a request, retrieve relevant guidance, draft a recommended next step, and require human approval before consequential actions.",
    ],
    bullets: [
      "LLM API integration and structured outputs",
      "Grounded retrieval from a small knowledge base",
      "Evaluation cases, error handling and audit trail",
      "Human-in-the-loop controls",
    ],
    status: "Planned — not yet built",
  },
];

export const approach = [
  {
    tag: "01 · Understand",
    title: "Clarify the real problem",
    body: "Map the current workflow, users, constraints and desired outcome before choosing a solution.",
  },
  {
    tag: "02 · Decompose",
    title: "Make the work tractable",
    body: "Break the problem into components, define interfaces and identify risks or unknowns early.",
  },
  {
    tag: "03 · Build with AI",
    title: "Use tools deliberately",
    body: "Use AI coding assistance for exploration, implementation and iteration; review generated code rather than accepting it blindly.",
  },
  {
    tag: "04 · Verify",
    title: "Test the behaviour",
    body: "Check edge cases, validate assumptions, and document what is known, what is uncertain and what should happen next.",
  },
];

export const skills = [
  {
    title: "Software foundations",
    items: [
      "Java (including Java 17)",
      "SQL, databases and DBMS",
      "Data structures and algorithms",
      "Linux / Unix, networking and operating systems",
    ],
  },
  {
    title: "Web & cloud interests",
    items: [
      "React, Node.js and TypeScript",
      "API integration and application architecture",
      "AWS and cloud fundamentals",
      "Git, GitHub and iterative development",
    ],
  },
];

export const strengths =
  "Process analysis · Structured problem-solving · Cross-team coordination · Learning unfamiliar systems · Translating operational friction into workflow improvements";

export const tickerItems = [
  "Workflow automation",
  "Java 17",
  "SQL & DBMS",
  "React",
  "Node.js",
  "TypeScript",
  "AWS fundamentals",
  "Linux",
  "Git",
  "AI-assisted development",
  "Process analysis",
];
