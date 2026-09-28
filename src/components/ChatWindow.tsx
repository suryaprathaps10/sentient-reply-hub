import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { answerFor, starterQuestions, titleFor, type ChatMessage } from "@/lib/chat-engine";
import {
  createThread,
  deleteThread,
  loadThreads,
  newId,
  upsertThread,
  type Thread,
} from "@/lib/threads";
import { profile } from "@/data/cv";

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).map((chunk, i) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return <strong key={i}>{chunk.slice(2, -2)}</strong>;
    }
    if (chunk.startsWith("_") && chunk.endsWith("_")) {
      return <em key={i}>{chunk.slice(1, -1)}</em>;
    }
    return <span key={i}>{chunk}</span>;
  });
}

function Rich({ text }: { text: string }) {
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {text.split("\n").map((line, i) =>
        line.trim().startsWith("- ") ? (
          <div key={i} className="flex gap-2">
            <span className="text-lime-deep">•</span>
            <span>{renderInline(line.replace(/^\s*-\s*/, ""))}</span>
          </div>
        ) : line.trim() === "" ? (
          <div key={i} className="h-1" />
        ) : (
          <p key={i}>{renderInline(line)}</p>
        ),
      )}
    </div>
  );
}

export function ChatWindow({ threadId }: { threadId: string }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [streaming, setStreaming] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(starterQuestions);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const stored = loadThreads();
    const current = stored.find((t) => t.id === threadId) ?? createThread(threadId);
    setThreads(upsertThread({ ...current, updatedAt: current.updatedAt || Date.now() }));
    setMessages(current.messages);
    setStreaming("");
    setTyping(false);
    setSuggestions(starterQuestions);
    inputRef.current?.focus();
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, [threadId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, streaming, typing]);

  const persist = useCallback(
    (next: ChatMessage[]) => {
      const title = next.find((m) => m.role === "user")?.content;
      setThreads(
        upsertThread({
          id: threadId,
          title: title ? titleFor(title) : "New chat",
          updatedAt: Date.now(),
          messages: next,
        }),
      );
    },
    [threadId],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || typing) return;
      const userMessage: ChatMessage = {
        id: newId(),
        role: "user",
        content: text,
        createdAt: Date.now(),
      };
      const withUser = [...messages, userMessage];
      setMessages(withUser);
      persist(withUser);
      setInput("");
      setTyping(true);
      setStreaming("");
      inputRef.current?.focus();

      const { content, suggestions: next } = answerFor(text);
      const think = window.setTimeout(() => {
        setTyping(false);
        let index = 0;
        const step = () => {
          index = Math.min(content.length, index + Math.ceil(content.length / 90) + 1);
          setStreaming(content.slice(0, index));
          if (index < content.length) {
            timers.current.push(window.setTimeout(step, 18));
          } else {
            const assistant: ChatMessage = {
              id: newId(),
              role: "assistant",
              content,
              createdAt: Date.now(),
            };
            const full = [...withUser, assistant];
            setStreaming("");
            setMessages(full);
            persist(full);
            setSuggestions(next);
            inputRef.current?.focus();
          }
        };
        step();
      }, 420);
      timers.current.push(think);
    },
    [messages, persist, typing],
  );

  const sorted = useMemo(() => [...threads].sort((a, b) => b.updatedAt - a.updatedAt), [threads]);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="panel h-fit p-4">
        <div className="flex items-center justify-between">
          <span className="eyebrow text-lime-deep">Your chats</span>
          <Link
            to="/chat"
            className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-ink-foreground transition hover:opacity-90"
          >
            + New
          </Link>
        </div>
        <ul className="mt-4 space-y-1">
          {sorted.length === 0 && (
            <li className="text-sm text-muted-foreground">No saved chats yet.</li>
          )}
          {sorted.map((thread) => (
            <li
              key={thread.id}
              className={`group flex items-center gap-1 rounded-xl px-2 py-1.5 transition ${
                thread.id === threadId ? "bg-secondary" : "hover:bg-secondary/60"
              }`}
            >
              <Link
                to="/chat/$threadId"
                params={{ threadId: thread.id }}
                className="min-w-0 flex-1 truncate text-left text-sm"
              >
                {thread.title}
              </Link>
              <button
                type="button"
                aria-label={`Delete ${thread.title}`}
                onClick={() => setThreads(deleteThread(thread.id))}
                className="rounded-md px-1.5 text-xs text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="panel flex min-h-[70vh] flex-col overflow-hidden">
        <header className="flex items-center gap-3 border-b border-border px-5 py-4">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-bold text-accent">
            {profile.initials}
          </span>
          <div>
            <p className="text-sm font-semibold">Portfolio assistant</p>
            <p className="text-xs text-muted-foreground">
              Answers come from this CV only — no external AI.
            </p>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
          {messages.length === 0 && !typing && !streaming && (
            <div className="animate-rise text-sm text-muted-foreground">
              Ask anything about {profile.name}'s work, skills or approach.
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-ink text-ink-foreground"
                    : "border border-border bg-secondary/40"
                }`}
              >
                <Rich text={m.content} />
              </div>
            </div>
          ))}
          {streaming && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl border border-border bg-secondary/40 px-4 py-3">
                <Rich text={streaming} />
              </div>
            </div>
          )}
          {typing && (
            <div className="flex items-center gap-1 px-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-lime-deep"
                  style={{ animation: `pulse-dot 1s ${i * 0.15}s infinite` }}
                />
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border px-5 py-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-border px-3 py-1.5 text-xs transition hover:border-lime-deep hover:bg-accent/30"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ask about experience, projects, skills…"
              aria-label="Message"
              className="min-h-11 flex-1 resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-lime-deep focus:ring-2 focus:ring-ring/40"
            />
            <button
              type="submit"
              disabled={typing || !input.trim()}
              className="h-11 shrink-0 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
