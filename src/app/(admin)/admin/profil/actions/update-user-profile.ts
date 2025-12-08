"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { userProfileSchema } from "@/lib/zod/user-profile-schema";

/**
 * Met à jour les informations du profil utilisateur
 * (PRÉNOM, NOM, BIO, LIENS, EMAIL, PSEUDO)
 */
export async function updateUserProfile(updates: Record<string, unknown>) {
    const supabase = await createClient();

    // Vérifier utilisateur connecté
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
        return { error: "Utilisateur non authentifié." };
    }

    const userId = authData.user.id;

    // Validation Zod (tous les champs du schéma sont optionnels)
    const parsed = userProfileSchema.partial().safeParse(updates);
    if (!parsed.success) {
        return {
            error: "Validation échouée.",
            issues: parsed.error.format(),
        };
    }

    const data = parsed.data;

    // Mise à jour
    const { error } = await supabase
        .from("users")
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

    if (error) {
        console.error(error);
        return { error: "Impossible de mettre à jour le profil." };
    }

    revalidatePath("/admin/profil");

    return { success: true };
}
