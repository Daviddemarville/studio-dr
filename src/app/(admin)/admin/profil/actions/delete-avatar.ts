"use server";

import { createClient } from "@/lib/supabase-server";

/**
 * Supprime complètement l’avatar d’un user :
 * - Efface les fichiers du storage (jpg, png, webp)
 * - Remet avatar_url = null dans la DB
 */
export async function deleteAvatar(userId: string) {
  const supabase = await createClient();

  // ----------- 1) Vérification utilisateur -----------
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return { error: "Utilisateur non authentifié." };
  if (authData.user.id !== userId) return { error: "Permission refusée." };

  // ----------- 2) Supprimer toutes les versions possibles -----------
  const filePaths = [`${userId}.jpg`, `${userId}.png`, `${userId}.webp`];

  await supabase.storage.from("avatars").remove(filePaths);

  // ----------- 3) Mettre avatar_url = null -----------
  const { error: dbError } = await supabase
    .from("users")
    .update({
      avatar_url: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (dbError) {
    console.error(dbError);
    return { error: "Impossible de supprimer l’avatar en base." };
  }

  return { success: true };
}
