"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function toggleUserApproval(userId: string, nextValue: boolean) {
    const supabase = await createClient();

    // Qui effectue l’action ?
    const {
        data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
        throw new Error("Non autorisé.");
    }

    // ❌ Sécurité : un admin ne peut PAS modifier son propre statut
    if (currentUser.id === userId) {
        throw new Error("Vous ne pouvez pas modifier votre propre statut.");
    }

    // Update en base
    const { error } = await supabase
        .from("users")
        .update({ is_approved: nextValue })
        .eq("id", userId);

    if (error) throw new Error("Erreur lors de la mise à jour du statut.");

    // Envoi email si on passe de NON approuvé → approuvé
    if (nextValue === true) {
        // await sendUserApprovedEmail(userId);  // si besoin
    }

    revalidatePath("/admin/validusers");
    return true;
}
