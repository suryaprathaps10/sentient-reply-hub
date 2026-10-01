import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin sign in · Surya Prathap Suresh" },
      { name: "description", content: "Sign in to review portfolio feedback." },
      { property: "og:title", content: "Admin sign in · Surya Prathap Suresh" },
      { property: "og:description", content: "Sign in to review portfolio feedback." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg({ kind: "err", text: error.message });
      navigate({ to: "/admin" });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (error) return setMsg({ kind: "err", text: error.message });
      if (data.session) return navigate({ to: "/admin" });
      setMsg({ kind: "ok", text: "Check your inbox to confirm your email, then sign in." });
    }
  }

  const input =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-lime-deep focus:ring-2 focus:ring-ring/40";

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <form onSubmit={submit} className="panel w-full max-w-sm p-8">
        <Link to="/" className="font-display text-xl font-bold">
          SPS<span className="text-lime-deep">.</span>
        </Link>
        <h1 className="mt-4 text-2xl">{mode === "in" ? "Admin sign in" : "Create admin account"}</h1>
        <div className="mt-6 space-y-3">
          <input className={input} type="email" required placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={input} type="password" required minLength={8} placeholder="Password" aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button disabled={busy} className="mt-5 w-full rounded-full bg-ink py-3 text-sm font-semibold text-ink-foreground transition hover:opacity-90 disabled:opacity-60">
          {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Sign up"}
        </button>
        {msg && <p className={`mt-3 text-sm ${msg.kind === "err" ? "text-destructive" : "text-lime-deep"}`}>{msg.text}</p>}
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 text-sm text-muted-foreground underline">
          {mode === "in" ? "No account? Sign up" : "Have an account? Sign in"}
        </button>
      </form>
    </main>
  );
}
