import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { certifications, education, interests, profile, projects, skills, strengths, work } from "@/data/cv";

const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

function createRunIdFetch() {
  let runId: string | undefined;
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
    const response = await fetch(input, { ...init, headers });
    runId ??= response.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim() || undefined;
    return response;
  };
}

function resumeText() {
  return [
    `Name: ${profile.name}. ${profile.tagline}`,
    "EXPERIENCE:",
    ...work.map((w) => `- ${w.title} (${w.tag}): ${w.body.join(" ")} ${(w.bullets ?? []).join("; ")}`),
    "PROJECTS:",
    ...projects.map((p) => `- ${p.title}: ${p.body}`),
    "EDUCATION:",
    ...education.map((e) => `- ${e.degree}, ${e.school} (${e.period})`),
    `CERTIFICATIONS: ${certifications.join("; ")}`,
    `SKILLS: ${skills.map((s) => `${s.title}: ${s.items.join(", ")}`).join(" | ")}`,
    `STRENGTHS: ${strengths}`,
    `INTERESTS: ${interests.join("; ")}`,
  ].join("\n");
}

export type RoleMatch = {
  fit: string;
  summary: string;
  experience: { title: string; why: string }[];
  skills: string[];
  gaps: string[];
};

export class GatewayError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function matchRole(role: string): Promise<RoleMatch> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new GatewayError("AI is not configured.", 401);

  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: createRunIdFetch(),
  });

  let failure: unknown;
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system:
      "You help recruiters see how a candidate fits a role. Use ONLY facts from the resume provided — never invent experience. " +
      'Reply with JSON only, no markdown: {"fit":"Strong|Good|Partial|Limited","summary":"2-3 sentences","experience":[{"title":"exact resume item title","why":"1 sentence"}],"skills":["relevant resume skills"],"gaps":["role requirements not evidenced in the resume"]}. ' +
      "List at most 4 experience items, 8 skills and 4 gaps, most relevant first.",
    prompt: `RESUME:\n${resumeText()}\n\nROLE DESCRIPTION FROM RECRUITER:\n${role}`,
    onError: ({ error }) => {
      failure = error;
    },
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  let text = "";
  try {
    text = await result.text;
  } catch (e) {
    failure = e;
  }
  if (failure || !text) {
    const status = (failure as { statusCode?: number })?.statusCode ?? 500;
    if (status === 429) throw new GatewayError("Too many requests right now — please try again in a minute.", 429);
    if (status === 402) throw new GatewayError("The AI matcher is temporarily unavailable (credits used up).", 402);
    throw new GatewayError("The AI matcher couldn't respond. Please try again later.", status);
  }

  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  try {
    const p = JSON.parse(json) as Partial<RoleMatch>;
    return {
      fit: String(p.fit ?? "—"),
      summary: String(p.summary ?? ""),
      experience: (p.experience ?? []).slice(0, 4).map((x) => ({ title: String(x.title), why: String(x.why) })),
      skills: (p.skills ?? []).slice(0, 8).map(String),
      gaps: (p.gaps ?? []).slice(0, 4).map(String),
    };
  } catch {
    return { fit: "—", summary: text.trim(), experience: [], skills: [], gaps: [] };
  }
}
