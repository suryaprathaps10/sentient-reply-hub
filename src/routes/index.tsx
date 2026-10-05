import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { contact, linkedin, profile, tickerItems } from "@/data/cv";
import { FeedbackForm } from "@/components/FeedbackForm";
import { SiteHero, SiteSections } from "@/components/SiteSections";
import { RoleMatcher } from "@/components/RoleMatcher";
import { getSiteContent } from "@/lib/site-content.functions";

export const Route = createFileRoute("/")({
  loader: () => getSiteContent(),
  errorComponent: () => <p className="p-10">Couldn't load the page. Please refresh.</p>,
  notFoundComponent: () => <p className="p-10">Not found.</p>,
  head: () => ({
    meta: [
      { title: `${profile.name} | Portfolio` },
      {
        name: "description",
        content:
          "Portfolio of Surya Prathap Suresh — ServiceNow developer with 2 years of experience, MSc Management candidate at the University of Nottingham. Live assistant and feedback included.",
      },
      { property: "og:title", content: `${profile.name} | Portfolio` },
      {
        property: "og:description",
        content:
          "ServiceNow development, consultancy projects, education and certifications — with a live assistant you can ask questions.",
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
      Available for work {now ? `· ${now}` : ""}
    </span>
  );
}

function Index() {
  const content = Route.useLoaderData();
  return (
    <div style={content.pageBg ? { background: content.pageBg } : undefined}>
    <main className="mx-auto max-w-6xl px-6 pb-20">
      <nav className="flex items-center justify-between py-6 text-sm">
        <span className="font-display text-xl font-bold">
          {profile.initials}
          <span className="text-lime-deep">.</span>
        </span>
        <div className="flex items-center gap-5 text-muted-foreground">
          {content.sections.slice(0, 4).map((s) => (
            <a key={s.id} href={`#${s.id}`} className="hidden transition hover:text-foreground sm:inline">
              {s.eyebrow.replace(/^\d+\s*\/\s*/, "").split(" ")[0]}
            </a>
          ))}
          <Link
            to="/chat"
            className="rounded-full bg-ink px-4 py-2 font-semibold text-ink-foreground transition hover:opacity-90"
          >
            Ask the assistant
          </Link>
        </div>
      </nav>

      <SiteHero
        content={content}
        actions={
          <>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/chat" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90">
                Chat about my work →
              </Link>
              <a href={`#${content.sections[0]?.id ?? "feedback"}`} className="rounded-full border border-ink-line px-5 py-3 text-sm font-semibold transition hover:bg-white/5">
                Explore my experience ↓
              </a>
              <button type="button" onClick={() => window.print()} className="rounded-full border border-ink-line px-5 py-3 text-sm font-semibold transition hover:bg-white/5">
                Save as PDF
              </button>
            </div>
            <div className="mt-6">
              <LiveClock />
            </div>
          </>
        }
        side={
          <div className="relative mx-auto aspect-square w-full max-w-64 place-self-center">
            <span className="absolute inset-0 rounded-full border border-ink-line animate-orbit before:absolute before:left-1/2 before:top-0 before:h-2 before:w-2 before:-translate-x-1/2 before:rounded-full before:bg-accent before:content-['']" />
            <span className="absolute inset-[15%] rounded-full border border-ink-line" />
            <span className="absolute inset-[30%] rounded-full border border-ink-line" />
            <strong className="absolute inset-0 grid place-items-center text-center font-display text-xl leading-tight">
              Build.
              <br />
              Lead.
              <br />
              <span className="text-accent">Improve.</span>
            </strong>
          </div>
        }
      />

      <div className="mt-6 overflow-hidden rounded-full border border-border bg-card py-3">
        <div className="flex w-max gap-8 whitespace-nowrap animate-ticker">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-sm text-muted-foreground">
              {item} <span className="text-lime-deep">✦</span>
            </span>
          ))}
        </div>
      </div>

      <SiteSections content={content} wrap={(node, key, i) => <Reveal key={key} delay={i * 70}>{node}</Reveal>} />

      <section className="pt-20">
        <article className="panel bg-ink p-6 text-ink-foreground">
          <span className="eyebrow text-accent">Live · Portfolio assistant</span>
          <h3 className="mt-3 text-2xl">Have a question? Ask it now.</h3>
          <p className="mt-3 max-w-2xl text-ink-muted">
            A built-in assistant answers directly from this resume. Conversations are saved in your browser.
          </p>
          <Link to="/chat" className="mt-5 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90">
            Open the assistant →
          </Link>
        </article>
      </section>

      <RoleMatcher />

      <section id="recommendations" className="pt-20">
        <a
          href={linkedin}
          target="_blank"
          rel="noreferrer"
          className="panel group flex flex-wrap items-center justify-between gap-5 p-8 transition hover:opacity-90"
        >
          <div>
            <div className="eyebrow text-lime-deep">05 / Recommendations</div>
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
            <div className="eyebrow text-lime-deep">06 / Let's talk</div>
            <h3 className="mt-3 text-3xl leading-tight">
              Open to roles where
              <br />
              technical and leadership
              <br />
              skills meet.
            </h3>
            <p className="mt-4 max-w-lg">
              Based in {contact.location}. Reach me at {contact.email} or {contact.phone}.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex w-fit rounded-full bg-ink px-5 py-3 text-sm font-semibold text-ink-foreground transition hover:opacity-90"
            >
              Email me ↗
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit rounded-full border border-ink px-5 py-3 text-sm font-semibold transition hover:bg-ink hover:text-ink-foreground"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
        <FeedbackForm />
      </section>

      <footer className="mt-16 flex flex-wrap justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground">
        <span>{profile.name} · {contact.location}</span>
        <span>{profile.preparedFor} · <Link to="/admin" className="underline">Admin</Link></span>
      </footer>
    </main>
    </div>
  );
}
