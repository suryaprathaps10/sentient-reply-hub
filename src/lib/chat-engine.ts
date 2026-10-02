import { certifications, contact, education, profile, projects, skills, strengths, work } from "@/data/cv";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

type Rule = {
  keywords: string[];
  answer: () => string;
  suggestions?: string[];
};

const rules: Rule[] = [
  {
    keywords: ["hello", "hi ", "hey", "good morning", "good evening"],
    answer: () =>
      `Hi — I'm the assistant for ${profile.name}'s portfolio. Ask me about his experience, education, projects, skills or how to get in touch.`,
    suggestions: ["What's his experience?", "What are his skills?", "Where did he study?"],
  },
  {
    keywords: ["who", "about", "yourself", "introduce", "summary", "profile"],
    answer: () =>
      `${profile.name} is a software developer with 2 years of experience — most of it building ServiceNow applications at Right Prompt Technologies in Bengaluru. He's currently completing an MSc in Management at the University of Nottingham and looking for roles that blend technical expertise with leadership.`,
    suggestions: ["Tell me about his experience", "What are his skills?"],
  },
  {
    keywords: ["experience", "work", "job", "professional", "servicenow", "developer", "right prompt", "career"],
    answer: () => {
      const item = work.find((w) => w.title.includes("Right Prompt"))!;
      return `**${item.title}** — ${item.tag}\n\n${item.body.join("\n\n")}\n\n${item.bullets!.map((b) => `- ${b}`).join("\n")}`;
    },
    suggestions: ["What else has he done?", "What are his skills?"],
  },
  {
    keywords: ["retail", "jd", "part-time", "part time", "shop"],
    answer: () => {
      const item = work.find((w) => w.title.includes("Retail"))!;
      return `**${item.title}** — ${item.tag}\n\n${item.body.join("\n\n")}`;
    },
    suggestions: ["What's his experience?", "Where did he study?"],
  },
  {
    keywords: ["consultancy", "consulting", "applyu", "admissions", "market", "competition"],
    answer: () => {
      const item = work.find((w) => w.title.includes("ApplyU"))!;
      return `**${item.title}** — ${item.tag}\n\n${item.body.join("\n\n")}\n\n${item.bullets!.map((b) => `- ${b}`).join("\n")}`;
    },
    suggestions: ["Tell me about his experience", "What are his skills?"],
  },
  {
    keywords: ["project", "portfolio", "built", "course management", "blockchain", "cloud"],
    answer: () =>
      projects
        .map((p) => `**${p.title}** (${p.tag}) — ${p.body}`)
        .join("\n\n"),
    suggestions: ["What are his skills?", "What's his experience?"],
  },
  {
    keywords: ["education", "msc", "university", "nottingham", "college", "study", "degree", "bachelor", "vidyavardhaka"],
    answer: () =>
      education
        .map((e) => `**${e.degree}** — ${e.school}, ${e.detail} (${e.period})`)
        .join("\n\n"),
    suggestions: ["Is he certified in anything?", "What are his skills?"],
  },
  {
    keywords: ["certified", "certification", "csa", "cad", "csm", "credential"],
    answer: () => `He holds three ServiceNow certifications:\n- ${certifications.join("\n- ")}`,
    suggestions: ["What's his experience?", "What are his skills?"],
  },
  {
    keywords: ["skill", "tech", "technolog", "stack", "language", "python", "sql", "javascript", "html", "css", "figma", "tool"],
    answer: () =>
      skills
        .map((group) => `**${group.title}**\n- ${group.items.join("\n- ")}`)
        .join("\n\n"),
    suggestions: ["Is he certified in anything?", "What are his strengths?"],
  },
  {
    keywords: ["strength", "soft skill", "team", "coordination", "communication", "leadership", "manager"],
    answer: () => strengths,
    suggestions: ["What kind of roles is he looking for?", "What are his skills?"],
  },
  {
    keywords: ["contact", "email", "hire", "reach", "talk", "interview", "available", "phone", "call"],
    answer: () =>
      `You can reach him at ${contact.email} or ${contact.phone}. He's based in ${contact.location}. The feedback form on the home page also gets straight to him.`,
    suggestions: ["What kind of roles?", "What are his skills?"],
  },
  {
    keywords: ["role", "looking for", "kind of work", "position", "why", "fit", "hobby", "interest"],
    answer: () =>
      "He's seeking managerial roles where he can leverage a blend of technical expertise and leadership capabilities to contribute to strategic decision-making and drive innovation. Outside work: dancing, agriculture, music — and he's a district-level Kabaddi player.",
    suggestions: ["What's his experience?", "How can I contact him?"],
  },
  {
    keywords: ["cv", "resume", "pdf", "download", "print"],
    answer: () =>
      "Use the “Save as PDF” button in the hero section — it prints this page in a clean, interview-ready layout.",
  },
  {
    keywords: ["thanks", "thank you", "cheers"],
    answer: () => "Glad to help. Anything else you'd like to know?",
  },
];

const fallback =
  "I can only answer from this portfolio — no external AI is used here. Try asking about his experience, education, projects, skills, certifications, or how to get in touch.";

export const starterQuestions = [
  "What's his experience?",
  "Which technologies does he use?",
  "Where did he study?",
  "How can I contact him?",
];

export function answerFor(question: string): { content: string; suggestions: string[] } {
  const q = ` ${question.toLowerCase().trim()} `;
  let best: Rule | undefined;
  let bestScore = 0;

  for (const rule of rules) {
    const score = rule.keywords.reduce((acc, kw) => (q.includes(kw) ? acc + kw.length : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      best = rule;
    }
  }

  if (!best) return { content: fallback, suggestions: starterQuestions.slice(0, 3) };
  return { content: best.answer(), suggestions: best.suggestions ?? starterQuestions.slice(0, 3) };
}

export function titleFor(text: string) {
  const clean = text.trim().replace(/\s+/g, " ");
  return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean || "New chat";
}
