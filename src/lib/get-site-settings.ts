"use server";

import { cache } from "react";
import { createPublicClient } from "@/lib/supabase-public";

export interface SiteSettings {
  site_name: string | null;
  logo_url: string | null;
}

/**
 * Récupère les paramètres du site
 * Cache automatique via React cache() pour dédupliquer les requêtes pendant le rendu
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = createPublicClient();

  const { data } = await supabase
    .from("settings")
    .select("site_name, logo_url")
    .limit(1)
    .maybeSingle();

  return {
    site_name: data?.site_name ?? null,
    logo_url: data?.logo_url ?? null,
  };
});
