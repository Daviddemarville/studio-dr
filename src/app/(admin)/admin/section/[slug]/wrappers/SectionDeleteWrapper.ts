import { createClient } from "@/lib/supabase-browser";

/* --------------------------------------------------------------------------
 * DELETE WRAPPER : supprime un élément ou une section complète
 * -------------------------------------------------------------------------- */

/**
 * 🔹 Supprime un SEUL élément dans un repeater
 */
export async function deleteSectionItem({
    table,
    itemId,
    sectionSlug,
}: {
    table: string;
    itemId: string;
    sectionSlug: string;
}) {
    const supabase = createClient();

    const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", itemId)
        .eq("section_slug", sectionSlug);

    if (error) throw error;

    return true;
}

/**
 * 🔥 Supprime TOUTE une section (administration avancée)
 * ⚠️ À utiliser uniquement dans un "Supprimer section"
 */
export async function deleteEntireSection({
    slug,
    table,
}: {
    slug: string;
    table: string;
}) {
    const supabase = createClient();

    // 1. Delete all items linked to this section
    await supabase.from(table).delete().eq("section_slug", slug);

    // 2. Delete custom content row
    await supabase
        .from("content_custom_sections")
        .delete()
        .eq("slug", slug);

    // 3. Delete the section definition
    await supabase.from("site_sections").delete().eq("slug", slug);

    return true;
}
