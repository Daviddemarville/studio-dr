"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

// Mapping Template -> Table
const TEMPLATE_TABLE_MAP: Record<string, string> = {
  section_nos_tarifs: "content_pricing",
  section_nos_offres: "content_offers",
  section_comment_travaillons_nous: "content_workflow_steps",
  section_notre_travail: "content_work",
  section_faq: "content_custom_sections",
  section_simple_text: "content_custom_sections",
  section_temoignages: "content_custom_sections",
  section_logos_confiance: "content_custom_sections",
  section_cards: "content_custom_sections",
  section_cards_with_image: "content_custom_sections",
  section_qui_sommes_nous: "content_work", // Should be handled carefully or mapped to users if applicable, but keeping as is for now based on user input (users table is separate)
};

export async function createSection(
  title: string,
  templateSlug: string,
  position: number = 0,
  icon: string = "FileText",
) {
  const supabase = await createClient();

  if (!title || !templateSlug) {
    return { success: false, error: "Titre et modèle requis" };
  }

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const tableName =
    TEMPLATE_TABLE_MAP[templateSlug] || "content_custom_sections";

  const { error } = await supabase.from("site_sections").insert({
    title,
    slug,
    template_slug: templateSlug,
    table_name: tableName,
    is_active: true,
    position: position,
    icon: icon,
  });

  if (error) {
    console.error("Error creating section:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/(admin)/admin/newsection");
  return { success: true };
}

export async function deleteSection(id: number) {
  const supabase = await createClient();

  // 1. Get section details to know which table to clean and check for system protection
  const { data: section, error: fetchError } = await supabase
    .from("site_sections")
    .select("slug, table_name, is_system")
    .eq("id", id)
    .single();

  if (fetchError || !section) {
    return { success: false, error: "Section introuvable" };
  }

  // Check if system section
  if (section.is_system) {
    return {
      success: false,
      error:
        "Impossible de supprimer une section système. Vous pouvez la désactiver (rendre invisible) si nécessaire.",
    };
  }

  // 2. Delete content from the associated table
  // We use section_slug to identify content belonging to this section
  if (section.table_name && section.slug) {
    const { error: deleteContentError } = await supabase
      .from(section.table_name)
      .delete()
      .eq("section_slug", section.slug);

    if (deleteContentError) {
      console.error("Error deleting content:", deleteContentError);
      // We continue even if content deletion fails, or we could stop here.
      // Let's continue to at least remove the section entry.
    }
  }

  // 3. Delete the section entry
  const { error } = await supabase.from("site_sections").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/(admin)/admin/newsection");
  return { success: true };
}

export async function updateSectionPosition(id: number, position: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_sections")
    .update({ position })
    .eq("id", id);

  if (error) {
    console.error("Error updating position:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/(admin)/admin/newsection");
  return { success: true };
}
