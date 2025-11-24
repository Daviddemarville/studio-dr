// src/app/(admin)/admin/section/[slug]/page.tsx

import { supabaseServer } from "@/lib/supabase-server";
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

interface ContentBase {
  id: string;
  section_slug: string;
  is_active?: boolean;
  display_order?: number;
  last_modified_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Chaque table content_* a un champ JSON `content`
interface ContentItem extends ContentBase {
  content: Record<string, any>;
}

// ---- Page ---- //

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await supabaseServer();
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

  // 2) Charger le contenu dynamique depuis la table associée
  let items: ContentItem[] | null = null;
  let itemsError = null;

  // SPECIAL CASE: users table doesn't have section_slug
  if (section.table_name === "users") {
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: userRow, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userData.user.id)
        .single();

      if (userRow) {
        items = [userRow as any];
      }
      itemsError = error;
    }
  } else {
    // STANDARD SECTIONS
    let query = supabase
      .from(section.table_name)
      .select("*")
      .eq("section_slug", slug);

    // On ne trie QUE si la table a un repeater (offers, pricing)
    if (["content_offers", "content_pricing"].includes(section.table_name)) {
      query = query.order("display_order", { ascending: true });
    }

    const result = await query.returns<ContentItem[]>();
    items = result.data;
    itemsError = result.error;
  }


  if (itemsError) {
    return (
      <p className="text-red-500">Erreur lors du chargement du contenu.</p>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">{section.title}</h1>

      <SectionEditorWrapper slug={slug} />

    </div>
  );
}
