import type { CSSProperties } from "react";
import { certifications, education, interests, profile, projects, skills, strengths, work } from "@/data/cv";

export type BoxStyle = {
  bg?: string; // css color, empty = default
  text?: string;
  padding?: number; // px
  radius?: number; // px
};

export type Card = {
  id: string;
  tag: string;
  title: string;
  body: string; // paragraphs separated by blank lines
  bullets: string; // one per line
  wide: boolean;
  style: BoxStyle;
};

export type Section = {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  columns: 1 | 2 | 3;
  style: BoxStyle;
  cards: Card[];
};

export type SiteContent = {
  hero: {
    eyebrow: string;
    name: string;
    tagline: string;
    chips: string; // comma separated
    style: BoxStyle;
  };
  pageBg: string;
  sections: Section[];
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export const newCard = (): Card => ({
  id: uid(), tag: "", title: "New card", body: "", bullets: "", wide: false, style: {},
});

export const newSection = (): Section => ({
  id: uid(), eyebrow: "New section", title: "Section title", intro: "", columns: 2, style: {}, cards: [newCard()],
});

const card = (c: Partial<Card>): Card => ({ ...newCard(), ...c, id: uid() });

export const defaultContent: SiteContent = {
  hero: {
    eyebrow: profile.eyebrow,
    name: profile.name,
    tagline: profile.tagline,
    chips: profile.chips.join(", "),
    style: {},
  },
  pageBg: "",
  sections: [
    {
      id: "work", eyebrow: "01 / Experience", title: "Technical depth, business focus.",
      intro: "Two years building ServiceNow applications for the insurance and financial sectors, now paired with management studies at the University of Nottingham.",
      columns: 2, style: {},
      cards: work.map((w) => card({ tag: w.tag, title: w.title, body: w.body.join("\n\n"), bullets: (w.bullets ?? []).join("\n"), wide: !!w.wide })),
    },
    {
      id: "projects", eyebrow: "02 / Projects", title: "Built end to end.",
      intro: "Academic and self-directed projects spanning full-stack web development, cloud infrastructure and blockchain security.",
      columns: 2, style: {},
      cards: projects.map((p) => card({ tag: p.tag, title: p.title, body: p.body })),
    },
    {
      id: "education", eyebrow: "03 / Education & certifications", title: "Credentials.", intro: "", columns: 2, style: {},
      cards: [
        card({ title: "Education", body: education.map((e) => `${e.degree} — ${e.school}, ${e.detail} · ${e.period}`).join("\n\n") }),
        card({ title: "Certifications", bullets: certifications.join("\n") }),
      ],
    },
    {
      id: "skills", eyebrow: "04 / Toolkit", title: "Skills & strengths.", intro: "", columns: 2, style: {},
      cards: [
        ...skills.map((s) => card({ title: s.title, bullets: s.items.join("\n") })),
        card({ title: "Professional strengths", body: strengths, wide: true }),
        card({ title: "Beyond work", body: interests.join(" · "), wide: true }),
      ],
    },
  ],
};

export function boxStyle(s?: BoxStyle): CSSProperties {
  if (!s) return {};
  return {
    ...(s.bg ? { background: s.bg } : {}),
    ...(s.text ? { color: s.text } : {}),
    ...(s.padding != null ? { padding: s.padding } : {}),
    ...(s.radius != null ? { borderRadius: s.radius } : {}),
  };
}
