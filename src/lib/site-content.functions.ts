import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { defaultContent, type SiteContent } from "./site-content";

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sb = createClient<Database>(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { data } = await sb.from("site_content").select("content").eq("id", 1).maybeSingle();
    return ((data?.content as unknown as SiteContent) ?? defaultContent) as SiteContent;
  } catch {
    return defaultContent;
  }
});
