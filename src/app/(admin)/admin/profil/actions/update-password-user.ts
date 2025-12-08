"use server";

import { createClient } from "@/lib/supabase-server";
import { passwordSchema } from "@/lib/zod/user-fields";

/**
 * Change le mot de passe de l'utilisateur connecté.
 * Supabase impose une REAUTHENTIFICATION récente pour les actions sensibles.
 * 
 * Process :
 * 1) Vérifier que l'utilisateur est authentifié
 * 2) Vérifier que c'est bien SON compte (sécurité)
 * 3) Re-auth via signInWithPassword (ancien mot de passe obligatoire)
 * 4) Valider le nouveau mot de passe (Zod)
 * 5) updateUser(password) → OK
 */
export async function updatePasswordUser(
  userId: string,
  oldPassword: string,
  newPassword: string
) {
  const supabase = await createClient();

  // ------------------------
  // 1) Vérifier l'utilisateur connecté
  // ------------------------
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return { error: "Utilisateur non authentifié." };

  if (authData.user.id !== userId) {
    return { error: "Permission refusée." };
  }

  const email = authData.user.email;
  if (!email) return { error: "Email utilisateur introuvable." };

  // ------------------------
  // 2) REAUTH OBLIGATOIRE : login avec l'ancien mot de passe
  // ------------------------
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password: oldPassword,
  });

  if (loginError) {
    console.error("❌ Erreur reauth :", loginError);
    return { error: "Ancien mot de passe incorrect." };
  }

  // ------------------------
  // 3) Validation du nouveau mot de passe via Zod
  // ------------------------
  const parsed = passwordSchema.safeParse(newPassword);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || "Nouveau mot de passe invalide.",
    };
  }

  const validPassword = parsed.data;
  console.log("🔎 Nouveau mot de passe validé :", validPassword);

  // ------------------------
  // 4) Mise à jour du mot de passe
  // ------------------------
  const { error } = await supabase.auth.updateUser({
    password: validPassword,
  });

  if (error) {
    console.error("❌ ERREUR SUPABASE updateUser :", error);
    return { error: "Impossible de mettre à jour le mot de passe." };
  }

  return { success: true };
}
