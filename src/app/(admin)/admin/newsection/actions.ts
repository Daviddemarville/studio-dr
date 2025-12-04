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
  section_qui_sommes_nous: "content_work",
};

// ---------------------------------------------------------
// UTILITAIRE : Appel RPC reindex
// ---------------------------------------------------------
async function reindex() {
  const supabase = await createClient();
  const { error } = await supabase.rpc("reindex_site_sections");

  if (error) {
    console.error("Erreur lors du reindex:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ---------------------------------------------------------
// CREATION D’UNE SECTION
// ---------------------------------------------------------
export async function createSection(
  title: string,
  templateSlug: string,
  position: number | null = null,
  icon: string = "FileText",
) {
  const supabase = await createClient();

  // ---------------------------------------------------------
  // 0. VALIDATION
  // ---------------------------------------------------------
  if (!title || !templateSlug) {
    return { success: false, error: "Titre et modèle requis" };
  }

  // ---------------------------------------------------------
  // 1. Génération du slug propre à partir du titre
  // ---------------------------------------------------------
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Mapping Template → table associée
  const tableName =
    TEMPLATE_TABLE_MAP[templateSlug] || "content_custom_sections";

  // ---------------------------------------------------------
  // Vérifier si un slug identique existe déjà
  // ---------------------------------------------------------
  const { data: slugExists, error: slugError } = await supabase
    .from("site_sections")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (slugError) {
    console.error("Erreur vérification slug :", slugError);
    return {
      success: false,
      error: "Erreur interne lors de la vérification du titre.",
    };
  }

  if (slugExists) {
    return {
      success: false,
      error: "Une section porte déjà ce titre. Veuillez en choisir un autre.",
    };
  }

  // ---------------------------------------------------------
  // 2. Récupérer les sections existantes triées par position
  // ---------------------------------------------------------
  const { data: existing, error: fetchError } = await supabase
    .from("site_sections")
    .select("id, position")
    .order("position", { ascending: true });

  if (fetchError) {
    console.error(fetchError);
    return {
      success: false,
      error: "Erreur lors du chargement des sections existantes.",
    };
  }

  // ---------------------------------------------------------
  // 3. Déterminer la position finale de la nouvelle section
  // ---------------------------------------------------------

  let finalPosition = position;

  /**
   * Cas 1 : Aucune position fournie (null, undefined, position <= 0)
   * → la nouvelle section doit être placée à la fin
   *   Exemple : 7 sections → nouvelle position = 8
   */
  if (!finalPosition || finalPosition <= 0) {
    finalPosition = (existing?.length || 0) + 1;
  }

  /**
   * Cas 2 : Position fournie et valide
   * → on va insérer au milieu
   * → toutes les sections ayant position >= finalPosition
   *   doivent être décalées de +1
   * Exemple :
   *   Sections : 1,2,3,4,5
   *   Nouvelle section demandée en position 3
   *   → avant insertion : on décale : 3→4, 4→5, 5→6
   *   → on insère à 3
   */
  if (existing && finalPosition <= existing.length) {
    for (const row of existing) {
      if (row.position >= finalPosition) {
        const { error: shiftError } = await supabase
          .from("site_sections")
          .update({ position: row.position + 1 })
          .eq("id", row.id);

        if (shiftError) {
          console.error("Erreur lors du décalage des positions :", shiftError);
          return {
            success: false,
            error:
              "Erreur lors du décalage des positions existantes avant insertion.",
          };
        }
      }
    }
  }

  // ---------------------------------------------------------
  // 4. Insérer la nouvelle section avec sa position calculée
  // ---------------------------------------------------------
  const { error: insertError } = await supabase.from("site_sections").insert({
    title,
    slug,
    template_slug: templateSlug,
    table_name: tableName,
    is_active: true,
    position: finalPosition,
    icon,
  });

  if (insertError) {
    console.error("Erreur insertion section :", insertError);
    return { success: false, error: insertError.message };
  }

  // ---------------------------------------------------------
  // 5. Re-indexation globale (sécurisation finale)
  //    → Assure des positions propres 1..N sans doublons
  // ---------------------------------------------------------
  const rpc = await reindex();
  if (!rpc.success) {
    return {
      success: false,
      error: "Erreur lors de la réindexation des sections.",
    };
  }

  // ---------------------------------------------------------
  // 6. Revalidation de la page Admin
  // ---------------------------------------------------------
  revalidatePath("/(admin)/admin/newsection");

  return { success: true };
}

// ---------------------------------------------------------
// SUPPRESSION D’UNE SECTION
// ---------------------------------------------------------
export async function deleteSection(id: number) {
  const supabase = await createClient();

  // 1. Récupérer la section
  const { data: section, error: fetchError } = await supabase
    .from("site_sections")
    .select("slug, table_name, is_system")
    .eq("id", id)
    .single();

  if (fetchError || !section) {
    return { success: false, error: "Section introuvable." };
  }

  // 2. Protection section système
  if (section.is_system) {
    return {
      success: false,
      error:
        "Impossible de supprimer une section système. Vous pouvez la rendre inactive si nécessaire.",
    };
  }

  // 3. Suppression du contenu lié — si erreur → rollback
  if (section.table_name && section.slug) {
    const { error: deleteContentError } = await supabase
      .from(section.table_name)
      .delete()
      .eq("section_slug", section.slug);

    if (deleteContentError) {
      console.error(
        "Erreur suppression contenu lié (rollback total) :",
        deleteContentError,
      );
      return {
        success: false,
        error:
          "La suppression a échoué (contenu lié non supprimé). Veuillez réessayer.",
      };
    }
  }

  // 4. Suppression de la section
  const { error: deleteSectionError } = await supabase
    .from("site_sections")
    .delete()
    .eq("id", id);

  if (deleteSectionError) {
    console.error(deleteSectionError);
    return {
      success: false,
      error: "Erreur lors de la suppression de la section.",
    };
  }

  // 5. Re-indexation
  await reindex();

  revalidatePath("/(admin)/admin/newsection");
  return { success: true };
}

// ---------------------------------------------------------
// MISE À JOUR MANUELLE DE POSITION
// ---------------------------------------------------------
export async function updateSectionPosition(id: number, position: number) {
  const supabase = await createClient();

  // 1. Mise à jour brute
  const { error } = await supabase
    .from("site_sections")
    .update({ position })
    .eq("id", id);

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  // 2. Re-indexation automatique
  await reindex();

  revalidatePath("/(admin)/admin/newsection");
  return { success: true };
}

// ---------------------------------------------------------
// DRAG & DROP DE POSITION
// Fonction dédiée au reorder dnd-kit
// ---------------------------------------------------------
export async function reorderSections(orderedIds: number[]) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("reorder_sections", {
    ids: orderedIds,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
