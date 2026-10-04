import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { matchRoleFn } from "@/lib/role-match.functions";

type Result = Extract<Awaited<ReturnType<typeof matchRoleFn>>, { ok: true }>["result"];

export function RoleMatcher() {
  const run = useServerFn(matchRoleFn);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (role.trim().length < 20) return setError("Please describe the role in a bit more detail.");
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await run({ data: { role } });
      if (res.ok) setResult(res.result);
      else setError(res.error);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="match" className="pt-20">
      <div className="panel p-6 sm:p-8">
        <div className="eyebrow text-lime-deep">For recruiters · AI-powered</div>
        <h2 className="mt-2 text-3xl sm:text-4xl">Hiring for a role? See how I fit.</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Paste a job description or describe the role. Lovable AI picks out the most relevant experience and skills from my resume.
        </p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <textarea
            aria-label="Role description"
            rows={5}
            maxLength={4000}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Junior ServiceNow developer to build portals and integrations for an insurance client…"
            className="w-full rounded-2xl border border-border bg-card p-4 text-sm outline-none focus:border-lime-deep"
          />
          <button disabled={loading} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-ink-foreground disabled:opacity-50">
            {loading ? "Matching…" : "Find relevant experience"}
          </button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

        {result && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-ink p-5 text-ink-foreground md:col-span-2">
              <span className="eyebrow text-accent">Fit: {result.fit}</span>
              <p className="mt-2">{result.summary}</p>
            </div>
            {result.experience.length > 0 && (
              <div className="rounded-2xl border border-border p-5">
                <h3 className="text-lg">Most relevant experience</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {result.experience.map((x) => (
                    <li key={x.title}><strong>{x.title}</strong><br /><span className="text-muted-foreground">{x.why}</span></li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-4">
              {result.skills.length > 0 && (
                <div className="rounded-2xl border border-border p-5">
                  <h3 className="text-lg">Matching skills</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.skills.map((s) => (
                      <span key={s} className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.gaps.length > 0 && (
                <div className="rounded-2xl border border-border p-5">
                  <h3 className="text-lg">Not covered in the resume</h3>
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                    {result.gaps.map((g) => <li key={g}>{g}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
