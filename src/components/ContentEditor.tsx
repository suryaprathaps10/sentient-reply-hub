import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHero, SiteSections } from "@/components/SiteSections";
import {
  defaultContent, newCard, newSection,
  type BoxStyle, type Card, type Section, type SiteContent,
} from "@/lib/site-content";
import type { Json } from "@/integrations/supabase/types";

const field = "w-full rounded-lg border border-border bg-card px-2 py-1.5 text-sm outline-none focus:border-lime-deep";
const btn = "rounded-full border border-border px-3 py-1 text-xs hover:border-lime-deep";

function Text({ label, value, onChange, area }: { label: string; value: string; onChange: (v: string) => void; area?: boolean }) {
  return (
    <label className="block text-xs text-muted-foreground">
      {label}
      {area ? (
        <textarea rows={4} className={`${field} mt-1`} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={`${field} mt-1`} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function StyleEditor({ value, onChange }: { value: BoxStyle; onChange: (v: BoxStyle) => void }) {
  const color = (k: "bg" | "text", label: string) => (
    <label className="flex items-center gap-1 text-xs text-muted-foreground">
      {label}
      <input type="color" value={value[k] || "#ffffff"} onChange={(e) => onChange({ ...value, [k]: e.target.value })} className="h-7 w-9 cursor-pointer rounded border border-border" />
      {value[k] && <button type="button" className="underline" onClick={() => onChange({ ...value, [k]: "" })}>reset</button>}
    </label>
  );
  const num = (k: "padding" | "radius", label: string) => (
    <label className="flex items-center gap-1 text-xs text-muted-foreground">
      {label}
      <input type="number" min={0} max={200} className={`${field} w-16`} value={value[k] ?? ""} placeholder="auto"
        onChange={(e) => onChange({ ...value, [k]: e.target.value === "" ? undefined : Number(e.target.value) })} />
    </label>
  );
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg bg-secondary/50 p-2">
      {color("bg", "Background")}
      {color("text", "Text")}
      {num("padding", "Padding px")}
      {num("radius", "Corners px")}
    </div>
  );
}

function move<T>(arr: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  return copy;
}

export function ContentEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.from("site_content").select("content").eq("id", 1).maybeSingle().then(({ data }) => {
      setContent((data?.content as unknown as SiteContent) ?? structuredClone(defaultContent));
    });
  }, []);

  if (!content) return <p className="mt-6 text-muted-foreground">Loading editor…</p>;

  const setSection = (i: number, s: Partial<Section>) =>
    setContent({ ...content, sections: content.sections.map((x, j) => (j === i ? { ...x, ...s } : x)) });
  const setCard = (si: number, ci: number, c: Partial<Card>) =>
    setSection(si, { cards: content.sections[si]!.cards.map((x, j) => (j === ci ? { ...x, ...c } : x)) });

  async function save() {
    setSaving(true);
    setMsg("");
    const { error } = await supabase
      .from("site_content")
      .upsert({ id: 1, content: content as unknown as Json, updated_at: new Date().toISOString() });
    setSaving(false);
    setMsg(error ? "Couldn't save. Please try again." : "Saved — live on your portfolio.");
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
      <div className="space-y-4 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2">
        <div className="panel sticky top-0 z-10 flex flex-wrap items-center gap-2 p-3">
          <button onClick={save} disabled={saving} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-ink-foreground disabled:opacity-50">
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button className={btn} onClick={() => confirm("Reset everything to the original resume content?") && setContent(structuredClone(defaultContent))}>
            Reset to original
          </button>
          {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
        </div>

        <details open className="panel p-4">
          <summary className="cursor-pointer font-semibold">Top banner</summary>
          <div className="mt-3 space-y-2">
            <Text label="Small heading" value={content.hero.eyebrow} onChange={(v) => setContent({ ...content, hero: { ...content.hero, eyebrow: v } })} />
            <Text label="Name" value={content.hero.name} onChange={(v) => setContent({ ...content, hero: { ...content.hero, name: v } })} />
            <Text area label="Intro text" value={content.hero.tagline} onChange={(v) => setContent({ ...content, hero: { ...content.hero, tagline: v } })} />
            <Text label="Tags (comma separated)" value={content.hero.chips} onChange={(v) => setContent({ ...content, hero: { ...content.hero, chips: v } })} />
            <StyleEditor value={content.hero.style} onChange={(v) => setContent({ ...content, hero: { ...content.hero, style: v } })} />
          </div>
        </details>

        <div className="panel flex items-center gap-2 p-4 text-sm">
          Page background
          <input type="color" value={content.pageBg || "#ffffff"} onChange={(e) => setContent({ ...content, pageBg: e.target.value })} className="h-7 w-9 rounded border border-border" />
          {content.pageBg && <button className="text-xs underline" onClick={() => setContent({ ...content, pageBg: "" })}>reset</button>}
        </div>

        {content.sections.map((s, si) => (
          <details key={s.id} className="panel p-4">
            <summary className="cursor-pointer font-semibold">{s.eyebrow || "Section"} — {s.title}</summary>
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                <button className={btn} onClick={() => setContent({ ...content, sections: move(content.sections, si, -1) })}>↑ Up</button>
                <button className={btn} onClick={() => setContent({ ...content, sections: move(content.sections, si, 1) })}>↓ Down</button>
                <button className={`${btn} text-destructive`} onClick={() => confirm("Delete this whole section?") && setContent({ ...content, sections: content.sections.filter((_, j) => j !== si) })}>Delete section</button>
              </div>
              <Text label="Small heading" value={s.eyebrow} onChange={(v) => setSection(si, { eyebrow: v })} />
              <Text label="Title" value={s.title} onChange={(v) => setSection(si, { title: v })} />
              <Text area label="Intro" value={s.intro} onChange={(v) => setSection(si, { intro: v })} />
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                Boxes per row
                <select className={`${field} w-20`} value={s.columns} onChange={(e) => setSection(si, { columns: Number(e.target.value) as 1 | 2 | 3 })}>
                  <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option>
                </select>
              </label>
              <StyleEditor value={s.style} onChange={(v) => setSection(si, { style: v })} />

              <div className="space-y-3 pt-2">
                {s.cards.map((c, ci) => (
                  <div key={c.id} className="rounded-xl border border-border p-3">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold">Box {ci + 1}</span>
                      <button className={btn} onClick={() => setSection(si, { cards: move(s.cards, ci, -1) })}>↑</button>
                      <button className={btn} onClick={() => setSection(si, { cards: move(s.cards, ci, 1) })}>↓</button>
                      <label className="flex items-center gap-1 text-xs">
                        <input type="checkbox" checked={c.wide} onChange={(e) => setCard(si, ci, { wide: e.target.checked })} /> Full width
                      </label>
                      <button className={`${btn} text-destructive`} onClick={() => setSection(si, { cards: s.cards.filter((_, j) => j !== ci) })}>Delete</button>
                    </div>
                    <div className="space-y-2">
                      <Text label="Label" value={c.tag} onChange={(v) => setCard(si, ci, { tag: v })} />
                      <Text label="Title" value={c.title} onChange={(v) => setCard(si, ci, { title: v })} />
                      <Text area label="Text (blank line = new paragraph)" value={c.body} onChange={(v) => setCard(si, ci, { body: v })} />
                      <Text area label="Bullet points (one per line)" value={c.bullets} onChange={(v) => setCard(si, ci, { bullets: v })} />
                      <StyleEditor value={c.style} onChange={(v) => setCard(si, ci, { style: v })} />
                    </div>
                  </div>
                ))}
                <button className={btn} onClick={() => setSection(si, { cards: [...s.cards, newCard()] })}>+ Add box</button>
              </div>
            </div>
          </details>
        ))}
        <button className="w-full rounded-xl border border-dashed border-border p-3 text-sm hover:border-lime-deep" onClick={() => setContent({ ...content, sections: [...content.sections, newSection()] })}>
          + Add section
        </button>
      </div>

      <div className="min-w-0">
        <p className="eyebrow mb-2 text-muted-foreground">Live preview</p>
        <div className="overflow-hidden rounded-3xl border border-border p-4" style={content.pageBg ? { background: content.pageBg } : undefined}>
          <SiteHero content={content} />
          <SiteSections content={content} />
        </div>
      </div>
    </div>
  );
}
