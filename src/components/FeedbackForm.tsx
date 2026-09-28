import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ratings = [1, 2, 3, 4, 5];

export function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError("Please add your name and a short message.");
      setState("error");
      return;
    }
    setState("sending");
    setError("");
    const { error: insertError } = await supabase.from("feedback").insert({
      name: name.trim(),
      email: email.trim() || null,
      rating,
      message: message.trim(),
    });
    if (insertError) {
      setError("That didn't send. Please try again in a moment.");
      setState("error");
      return;
    }
    setState("sent");
    setName("");
    setEmail("");
    setRating(null);
    setMessage("");
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-lime-deep focus:ring-2 focus:ring-ring/40";

  return (
    <form onSubmit={onSubmit} className="panel p-6 sm:p-8">
      <div className="eyebrow text-lime-deep">Leave feedback</div>
      <h3 className="mt-2 text-2xl">Tell me what you think.</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Every message is stored securely and read personally.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input
          className={inputClass}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Your name"
        />
        <input
          className={inputClass}
          placeholder="Email (optional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Rating</span>
        {ratings.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value === rating ? null : value)}
            aria-pressed={rating === value}
            className={`h-9 w-9 rounded-full border text-sm font-semibold transition ${
              rating !== null && value <= rating
                ? "border-lime-deep bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground hover:border-lime-deep"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <textarea
        className={`${inputClass} mt-4 min-h-32 resize-y`}
        placeholder="What stood out? What would you change?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        aria-label="Message"
      />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ink-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send feedback"}
        </button>
        {state === "sent" && (
          <span className="text-sm font-medium text-lime-deep">Thank you — received.</span>
        )}
        {state === "error" && <span className="text-sm text-destructive">{error}</span>}
      </div>
    </form>
  );
}
