// src/app/(admin)/admin/section/[slug]/page.tsx

import { createClient } from "@/lib/supabase-server";
import SectionEditorWrapper from "./SectionEditorWrapper";

// ---- Types ---- //

interface SiteSection {
  id: string;
  slug: string;
  title: string;
  table_name: string;
  is_active: boolean;
  icon: string | null;
  template_slug: string | null;
  position: number;
  created_at: string | null;
  updated_at: string | null;
  description: string | null;
  is_system: boolean;
}

// ---- Page ---- //

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const slug = (await params).slug;

  // 1) Récupérer la section
  const { data: section, error: sectionError } = await supabase
    .from("site_sections")
    .select("*")
    .eq("slug", slug)
    .single<SiteSection>();

  if (sectionError || !section) {
    return (
      <p className="text-red-500">
        Erreur : section introuvable ou inaccessible.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">{section.title}</h1>

      <SectionEditorWrapper slug={slug} />
    </div>
  );
}
