import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { approach, linkedin, profile, skills, strengths, tickerItems, work } from "@/data/cv";
import { FeedbackForm } from "@/components/FeedbackForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${profile.name} | Engineering Portfolio` },
      {
        name: "description",
        content:
          "Interactive engineering portfolio: workflow automation, Java, SQL, React and AI-assisted development — with a live assistant and feedback.",
      },
      { property: "og:title", content: `${profile.name} | Engineering Portfolio` },
      {
        property: "og:description",
        content:
          "Process-first software engineering: automation case studies, projects, skills and a portfolio assistant you can ask questions.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={visible ? "animate-rise" : "opacity-0"}
    >
      {children}
    </div>
  );
}

function LiveClock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-2 text-xs text-ink-muted">
      <span className="h-2 w-2 rounded-full bg-accent" style={{ animation: "pulse-dot 1.6s infinite" }} />
      Available for engineering work {now ? `· ${now}` : ""}
    </span>
  );
}

function Index() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-20">
      <nav className="flex items-center justify-between py-6 text-sm">
        <span className="font-display text-xl font-bold">
          {profile.initials}
          <span className="text-lime-deep">.</span>
        </span>
        <div className="flex items-center gap-5 text-muted-foreground">
          <a href="#work" className="transition hover:text-foreground">
            Work
          </a>
          <a href="#approach" className="transition hover:text-foreground">
            Approach
          </a>
          <a href="#skills" className="transition hover:text-foreground">
            Skills
          </a>
          <Link
            to="/chat"
            className="rounded-full bg-ink px-4 py-2 font-semibold text-ink-foreground transition hover:opacity-90"
          >
            Ask the assistant
          </Link>
        </div>
      </nav>

      <header className="grid gap-10 rounded-3xl bg-ink p-8 text-ink-foreground shadow-panel sm:p-12 lg:grid-cols-[1.4fr_0.6fr] lg:p-16">
        <div>
          <div className="eyebrow text-accent">{profile.eyebrow}</div>
          <h1 className="mt-5 text-5xl leading-[0.95] sm:text-7xl">
            Surya Prathap
            <br />
            Suresh<span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-muted">{profile.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {profile.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-ink-line px-3 py-1 text-xs text-ink-muted"
              >
                {chip}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
            >
              Chat about my work →
            </Link>
            <a
              href="#work"
              className="rounded-full border border-ink-line px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
            >
              Explore my work ↓
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full border border-ink-line px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
            >
              Save as PDF
            </button>
          </div>
          <div className="mt-6">
            <LiveClock />
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-64 place-self-center">
          <span className="absolute inset-0 rounded-full border border-ink-line animate-orbit before:absolute before:left-1/2 before:top-0 before:h-2 before:w-2 before:-translate-x-1/2 before:rounded-full before:bg-accent before:content-['']" />
          <span className="absolute inset-[15%] rounded-full border border-ink-line" />
          <span className="absolute inset-[30%] rounded-full border border-ink-line" />
          <strong className="absolute inset-0 grid place-items-center text-center font-display text-xl leading-tight">
            Understand.
            <br />
            Build.
            <br />
            <span className="text-accent">Improve.</span>
          </strong>
        </div>
      </header>

      <div className="mt-6 overflow-hidden rounded-full border border-border bg-card py-3">
        <div className="flex w-max gap-8 whitespace-nowrap animate-ticker">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-sm text-muted-foreground">
              {item} <span className="text-lime-deep">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section id="work" className="pt-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="eyebrow text-lime-deep">01 / Selected work</div>
            <h2 className="mt-2 text-4xl sm:text-5xl">
              Engineering with
              <br />
              business outcomes.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            I focus on the operational problem first: who is affected, where work gets stuck, and
            what a better workflow should enable.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {work.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <article className={`panel h-full p-6 ${item.wide ? "md:col-span-2" : ""}`}>
                <span className="eyebrow text-lime-deep">{item.tag}</span>
                <h3 className="mt-3 text-2xl">{item.title}</h3>
                {item.body.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
                {item.bullets && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
                    {item.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                {item.status && (
                  <span className="mt-4 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                    {item.status}
                  </span>
                )}
                {item.note && <p className="mt-3 text-sm text-muted-foreground">{item.note}</p>}
              </article>
            </Reveal>
          ))}
          <Reveal delay={240}>
            <article className="panel h-full bg-ink p-6 text-ink-foreground md:col-span-2">
              <span className="eyebrow text-accent">Live · Portfolio assistant</span>
              <h3 className="mt-3 text-2xl">Have a question? Ask it now.</h3>
              <p className="mt-3 max-w-2xl text-ink-muted">
                A built-in assistant answers directly from this CV — experience, projects, skills,
                approach and contact. Conversations are saved in your browser, so you can pick them
                up later.
              </p>
              <Link
                to="/chat"
                className="mt-5 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
              >
                Open the assistant →
              </Link>
            </article>
          </Reveal>
        </div>
      </section>

      <section id="approach" className="pt-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="eyebrow text-lime-deep">02 / How I work</div>
            <h2 className="mt-2 text-4xl sm:text-5xl">
              AI accelerates work.
              <br />
              Engineering owns it.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            I use AI coding tools as assistants, not as a substitute for understanding the code,
            checking the output, or taking responsibility for the result.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {approach.map((step, i) => (
            <Reveal key={step.tag} delay={i * 70}>
              <article className="panel h-full p-6 transition hover:-translate-y-1 hover:shadow-float">
                <span className="eyebrow text-lime-deep">{step.tag}</span>
                <h3 className="mt-3 text-xl">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="skills" className="pt-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="eyebrow text-lime-deep">03 / Toolkit</div>
            <h2 className="mt-2 text-4xl sm:text-5xl">Foundations &amp; focus.</h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            A concise snapshot of the technologies and capabilities to substantiate with code,
            examples and discussion.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {skills.map((group, i) => (
            <Reveal key={group.title} delay={i * 70}>
              <article className="panel h-full p-6">
                <h3 className="text-xl">{group.title}</h3>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
          <Reveal delay={160}>
            <article className="panel p-6 md:col-span-2">
              <h3 className="text-xl">Professional strengths</h3>
              <p className="mt-2 text-muted-foreground">{strengths}</p>
            </article>
          </Reveal>
        </div>
      </section>

      <section id="recommendations" className="pt-20">
        <a
          href={linkedin}
          target="_blank"
          rel="noreferrer"
          className="panel group flex flex-wrap items-center justify-between gap-5 p-8 transition hover:opacity-90"
        >
          <div>
            <div className="eyebrow text-lime-deep">04 / Recommendations</div>
            <h2 className="mt-2 text-3xl sm:text-4xl">What colleagues say.</h2>
            <p className="mt-3 text-muted-foreground">
              Read my recommendations directly on my LinkedIn profile.
            </p>
          </div>
          <span className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-ink-foreground transition group-hover:opacity-90">
            View on LinkedIn ↗
          </span>
        </a>
      </section>

      <section id="feedback" className="grid gap-4 pt-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-between rounded-3xl bg-accent p-8 text-accent-foreground sm:p-10">
          <div>
            <div className="eyebrow text-lime-deep">05 / Let's talk</div>
            <h3 className="mt-3 text-3xl leading-tight">
              Practical problem-solving,
              <br />
              with a bias toward building.
            </h3>
            <p className="mt-4 max-w-lg">
              I'm interested in engineering work where understanding the business context matters as
              much as writing the code.
            </p>
          </div>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex w-fit rounded-full bg-ink px-5 py-3 text-sm font-semibold text-ink-foreground transition hover:opacity-90"
          >
            GitHub ↗
          </a>
          <a href={linkedin} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-fit rounded-full border border-ink px-5 py-3 text-sm font-semibold transition hover:bg-ink hover:text-ink-foreground">
            LinkedIn ↗
          </a>
        </div>
        <FeedbackForm />
      </section>

      <footer className="mt-16 flex flex-wrap justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground">
        <span>{profile.name} · Application portfolio</span>
        <span>{profile.preparedFor} · <Link to="/admin" className="underline">Admin</Link></span>
      </footer>
    </main>
  );
}
