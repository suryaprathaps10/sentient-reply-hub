import type { ReactNode } from "react";
import { boxStyle, type SiteContent } from "@/lib/site-content";

const cols = { 1: "", 2: "md:grid-cols-2", 3: "md:grid-cols-3" } as const;
const span = { 1: "", 2: "md:col-span-2", 3: "md:col-span-3" } as const;

export function SiteHero({ content, actions, side }: { content: SiteContent; actions?: ReactNode; side?: ReactNode }) {
  const h = content.hero;
  const chips = h.chips.split(",").map((c) => c.trim()).filter(Boolean);
  const words = h.name.trim().split(" ");
  const last = words.pop();
  return (
    <header
      style={boxStyle(h.style)}
      className="grid gap-10 rounded-3xl bg-ink p-8 text-ink-foreground shadow-panel sm:p-12 lg:grid-cols-[1.4fr_0.6fr] lg:p-16"
    >
      <div>
        <div className="eyebrow text-accent">{h.eyebrow}</div>
        <h1 className="mt-5 text-5xl leading-[0.95] sm:text-7xl">
          {words.join(" ")}
          {words.length > 0 && <br />}
          {last}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-xl whitespace-pre-line text-lg opacity-75">{h.tagline}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span key={chip} className="rounded-full border border-ink-line px-3 py-1 text-xs opacity-75">
              {chip}
            </span>
          ))}
        </div>
        {actions}
      </div>
      {side}
    </header>
  );
}

export function SiteSections({ content, wrap }: { content: SiteContent; wrap?: (node: ReactNode, key: string, i: number) => ReactNode }) {
  return (
    <>
      {content.sections.map((s) => (
        <section key={s.id} id={s.id} className="mt-20 rounded-3xl" style={boxStyle(s.style)}>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="eyebrow text-lime-deep">{s.eyebrow}</div>
              <h2 className="mt-2 text-4xl sm:text-5xl">{s.title}</h2>
            </div>
            {s.intro && <p className="max-w-md opacity-70">{s.intro}</p>}
          </div>
          <div className={`grid gap-4 ${cols[s.columns] ?? cols[2]}`}>
            {s.cards.map((c, i) => {
              const node = (
                <article
                  style={boxStyle(c.style)}
                  className="panel h-full p-6 transition hover:-translate-y-1 hover:shadow-float"
                >
                  {c.tag && <span className="eyebrow text-lime-deep">{c.tag}</span>}
                  <h3 className="mt-3 text-2xl">{c.title}</h3>
                  {c.body.split(/\n\s*\n/).filter((p) => p.trim()).map((p, j) => (
                    <p key={j} className="mt-3 whitespace-pre-line opacity-75">{p}</p>
                  ))}
                  {c.bullets.trim() && (
                    <ul className="mt-3 list-disc space-y-1 pl-5 opacity-75">
                      {c.bullets.split("\n").filter((b) => b.trim()).map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                </article>
              );
              return (
                <div key={c.id} className={c.wide ? span[s.columns] ?? "" : ""}>
                  {wrap ? wrap(node, c.id, i) : node}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
