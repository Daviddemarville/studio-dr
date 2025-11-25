import { supabaseServer } from "@/lib/supabase-server";
import { loadTemplates } from "@/templates/sections/loader.server";
import NewSectionClient from "./NewSectionClient";

export const dynamic = "force-dynamic";

export default async function NewSectionPage() {
  const supabase = await supabaseServer();

  // 1. Load Templates
  const templates = await loadTemplates();

  // 2. Load Sections
  const { data: sections } = await supabase
    .from("site_sections")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">
        Gestion des Sections
      </h1>
      <NewSectionClient templates={templates} sections={sections ?? []} />
    </div>
  );
}
