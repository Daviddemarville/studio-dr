"use server";

import { cache } from "react";
import { createPublicClient } from "@/lib/supabase-public";

export interface NavSection {
  slug: string;
  title: string;
  position: number;
}

/**
 * Récupère les sections actives pour la navigation
 * Cache automatique via React cache() pour dédupliquer les requêtes pendant le rendu
 */
export const getActiveSections = cache(async (): Promise<NavSection[]> => {
  const supabase = createPublicClient();

  const { data: sections } = await supabase
    .from("site_sections")
    .select("slug, title, position")
    .eq("is_active", true)
    .eq("show_in_nav", true)
    .order("position", { ascending: true });

  return sections || [];
});
