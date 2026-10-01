import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Feedback admin · Surya Prathap Suresh" },
      { name: "description", content: "Review and manage portfolio feedback." },
      { property: "og:title", content: "Feedback admin · Surya Prathap Suresh" },
      { property: "og:description", content: "Review and manage portfolio feedback." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const STATUSES = ["new", "reviewed", "resolved", "archived"] as const;
type Status = (typeof STATUSES)[number];

type Filters = { from: string; to: string; rating: string; status: string };

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [filters, setFilters] = useState<Filters>({ from: "", to: "", rating: "", status: "" });

  const access = useQuery({
    queryKey: ["admin-access"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("claim_first_admin");
      if (error) throw error;
      return data === true;
    },
  });

  const feedback = useQuery({
    queryKey: ["feedback", filters],
    enabled: access.data === true,
    queryFn: async () => {
      let q = supabase.from("feedback").select("*").order("created_at", { ascending: false });
      if (filters.from) q = q.gte("created_at", new Date(`${filters.from}T00:00:00`).toISOString());
      if (filters.to) q = q.lte("created_at", new Date(`${filters.to}T23:59:59.999`).toISOString());
      if (filters.rating === "none") q = q.is("rating", null);
      else if (filters.rating) q = q.eq("rating", Number(filters.rating));
      if (filters.status) q = q.eq("status", filters.status);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  async function setStatus(id: string, status: Status) {
    const { error } = await supabase.from("feedback").update({ status }).eq("id", id);
    if (error) return alert("Couldn't update status. Please try again.");
    qc.invalidateQueries({ queryKey: ["feedback"] });
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const field =
    "rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-lime-deep";
  const rows = feedback.data ?? [];
  const avg = rows.filter((r) => r.rating).reduce((a, r, _, arr) => a + (r.rating ?? 0) / arr.length, 0);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <nav className="mb-8 flex items-center justify-between text-sm">
        <Link to="/" className="font-display text-xl font-bold">
          SPS<span className="text-lime-deep">.</span>
        </Link>
        <button onClick={signOut} className="text-muted-foreground hover:text-foreground">
          Sign out
        </button>
      </nav>

      <div className="eyebrow text-lime-deep">Admin</div>
      <h1 className="mt-2 text-4xl">Feedback</h1>

      {access.isLoading && <p className="mt-6 text-muted-foreground">Checking access…</p>}
      {access.data === false && (
        <p className="mt-6 panel p-6 text-muted-foreground">
          This account doesn't have admin access.
        </p>
      )}
      {access.isError && <p className="mt-6 text-destructive">Couldn't check access.</p>}

      {access.data && (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat label="Showing" value={String(rows.length)} />
            <Stat label="New" value={String(rows.filter((r) => r.status === "new").length)} />
            <Stat label="Avg rating" value={avg ? avg.toFixed(1) : "—"} />
          </div>

          <div className="panel mt-6 flex flex-wrap items-end gap-3 p-4">
            <label className="text-xs text-muted-foreground">
              From
              <input type="date" className={`${field} mt-1 block`} value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
            </label>
            <label className="text-xs text-muted-foreground">
              To
              <input type="date" className={`${field} mt-1 block`} value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
            </label>
            <label className="text-xs text-muted-foreground">
              Rating
              <select className={`${field} mt-1 block`} value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: e.target.value })}>
                <option value="">All</option>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} ★</option>
                ))}
                <option value="none">No rating</option>
              </select>
            </label>
            <label className="text-xs text-muted-foreground">
              Status
              <select className={`${field} mt-1 block`} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                <option value="">All</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <button onClick={() => setFilters({ from: "", to: "", rating: "", status: "" })} className="rounded-full border border-border px-4 py-2 text-sm hover:border-lime-deep">
              Clear
            </button>
          </div>

          {feedback.isLoading && <p className="mt-6 text-muted-foreground">Loading…</p>}
          {feedback.isError && <p className="mt-6 text-destructive">Couldn't load feedback.</p>}
          {feedback.data && rows.length === 0 && (
            <p className="mt-6 text-muted-foreground">No feedback matches these filters.</p>
          )}

          <ul className="mt-6 space-y-3">
            {rows.map((r) => (
              <li key={r.id} className="panel p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {r.name}{" "}
                      {r.email && (
                        <a href={`mailto:${r.email}`} className="text-sm font-normal text-muted-foreground underline">
                          {r.email}
                        </a>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()} · {r.rating ? `${r.rating} ★` : "No rating"}
                    </p>
                  </div>
                  <select
                    aria-label={`Status for ${r.name}`}
                    value={r.status}
                    onChange={(e) => setStatus(r.id, e.target.value as Status)}
                    className={`${field} ${r.status === "new" ? "bg-accent text-accent-foreground" : ""}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm">{r.message}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-2xl">{value}</p>
    </div>
  );
}
