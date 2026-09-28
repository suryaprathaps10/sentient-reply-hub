import { profile, skills, strengths, work } from "@/data/cv";

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
      `Hi — I'm the assistant for ${profile.name}'s portfolio. Ask me about his experience, projects, skills or how he works.`,
    suggestions: ["What has he built?", "What are his skills?", "How does he work?"],
  },
  {
    keywords: ["who", "about", "yourself", "introduce", "summary", "profile"],
    answer: () =>
      `${profile.name} is a software engineer focused on workflow automation and AI-assisted development. In his words: "${profile.tagline}"`,
    suggestions: ["Tell me about his experience", "Which technologies?"],
  },
  {
    keywords: ["experience", "work", "job", "professional", "freeze", "unfreeze", "automation"],
    answer: () => {
      const item = work[0]!;
      return `**${item.title}**\n\n${item.body.join("\n\n")}`;
    },
    suggestions: ["What projects is he building?", "What about AI work?"],
  },
  {
    keywords: ["project", "framevibe", "portfolio", "built", "building", "side"],
    answer: () =>
      work
        .slice(1)
        .map((item) => `**${item.title}** — ${item.body[0]}${item.status ? `\n_${item.status}_` : ""}`)
        .join("\n\n"),
    suggestions: ["What are his skills?", "How can I contact him?"],
  },
  {
    keywords: ["ai", "llm", "machine learning", "gpt", "assistant", "agent"],
    answer: () =>
      "He uses AI coding tools as assistants, not replacements: exploration, implementation and iteration, with review of everything generated. His next build is an AI support-workflow assistant with structured outputs, grounded retrieval, evaluation cases and human approval before consequential actions. He is not claiming production LLM experience yet.",
    suggestions: ["How does he work?", "What has he shipped?"],
  },
  {
    keywords: ["skill", "tech", "technolog", "stack", "language", "java", "sql", "react", "node", "aws", "tool"],
    answer: () =>
      skills
        .map((group) => `**${group.title}**\n- ${group.items.join("\n- ")}`)
        .join("\n\n"),
    suggestions: ["What are his strengths?", "Tell me about his experience"],
  },
  {
    keywords: ["strength", "soft skill", "team", "coordination", "communication"],
    answer: () => strengths,
    suggestions: ["How does he approach a problem?"],
  },
  {
    keywords: ["approach", "how do you work", "process", "method", "how does he work"],
    answer: () =>
      "Four steps: understand the real problem, decompose it into tractable components, build with AI tools used deliberately, then verify behaviour and edge cases and document what is still uncertain.",
    suggestions: ["What about AI tools?", "What has he built?"],
  },
  {
    keywords: ["contact", "email", "hire", "reach", "talk", "interview", "available"],
    answer: () =>
      `He's open to engineering work where business context matters as much as the code. Use the feedback form on the home page, or the GitHub link in the header (${profile.github}).`,
    suggestions: ["What kind of roles?", "What are his skills?"],
  },
  {
    keywords: ["role", "looking for", "kind of work", "position"],
    answer: () =>
      "Roles where he can analyse an operational process, find the friction and turn it into software: workflow automation, internal tooling, and practical AI-assisted development.",
    suggestions: ["What's his experience?", "How can I contact him?"],
  },
  {
    keywords: ["clear rock", "clearrock", "why", "fit"],
    answer: () =>
      "This portfolio was prepared for Clear Rock AI. The fit he's making the case for: process understanding first, deliberate use of AI tooling, and honest scoping of what is built versus planned.",
    suggestions: ["What's planned next?", "What are his skills?"],
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
  "I can only answer from this portfolio — no external AI is used here. Try asking about his experience, projects, skills, how he works, or how to get in touch.";

export const starterQuestions = [
  "What has he actually built?",
  "Which technologies does he use?",
  "How does he approach a problem?",
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
