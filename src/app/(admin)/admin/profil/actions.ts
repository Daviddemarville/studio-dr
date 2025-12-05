"use server";

import { createClient } from "@/lib/supabase-server";
import { userProfileSchema } from "@/lib/zod/user-profile-schema";
import { revalidatePath } from "next/cache";

// RECUPERER EMAIL AUTH ET EMAIL PUBLIC
export async function getCurrentUserProfile() {
    const supabase = await createClient();

    // 1) Récupérer l'utilisateur authentifié
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) return null;

    const authUser = authData.user;
    const authEmail = authUser.email ?? null;

    // 2) Récupérer le profil public
    const { data: publicProfile, error: publicError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

    if (publicError) {
        console.error("Erreur chargement profil public:", publicError);
        return { authEmail, publicProfile: null };
    }

    return {
        authEmail,
        publicProfile,
    };
}

// METTRE A JOUR LE PROFIL PUBLIC
export async function updateUserProfile(formData: FormData) {
    const supabase = await createClient();

    // 1) Vérifier utilisateur connecté
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
        return { error: "Utilisateur non authentifié." };
    }

    const userId = authData.user.id;

    // 2) Lire les champs depuis formData
    const raw = {
        firstname: formData.get("firstname"),
        lastname: formData.get("lastname"),
        pseudo: formData.get("pseudo"),
        email: formData.get("email"),
        bio_fr: formData.get("bio_fr"),
        bio_en: formData.get("bio_en"),
        avatar_url: formData.get("avatar_url"),
        url_portfolio: formData.get("url_portfolio"),
        url_linkedin: formData.get("url_linkedin"),
        url_github: formData.get("url_github"),
    };

    // 3) Validation via Zod
    const parsed = userProfileSchema.safeParse(raw);
    if (!parsed.success) {
        return {
            error: "Validation échouée.",
            issues: parsed.error.format(),
        };
    }

    const data = parsed.data;

    // 4) Mise à jour du profil public
    const { error } = await supabase
        .from("users")
        .update({
            firstname: data.firstname,
            lastname: data.lastname,
            pseudo: data.pseudo,
            email: data.email,
            bio_fr: data.bio_fr,
            bio_en: data.bio_en,
            avatar_url: data.avatar_url,
            url_portfolio: data.url_portfolio,
            url_linkedin: data.url_linkedin,
            url_github: data.url_github,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

    if (error) {
        console.error("Erreur update user:", error);
        return { error: "Impossible de mettre à jour le profil." };
    }

    revalidatePath("/admin/profil");

    return { success: true };
}

// CHARGER UN AVATAR
export async function uploadAvatar(file: File, userId: string) {
    const supabase = await createClient();

    // 1. Récupération de l'extension
    const original = file.name.toLowerCase();

    let ext = "png";
    if (original.endsWith(".jpg")) ext = "jpg";
    else if (original.endsWith(".jpeg")) ext = "jpeg";
    else if (original.endsWith(".webp")) ext = "webp";
    else if (original.endsWith(".png")) ext = "png";
    else return { error: "Format de fichier non supporté." };

    // 2. Construire le chemin final
    const filePath = `avatar-${userId}-${Date.now()}.${ext}`;

    // 3. Upload vers Supabase
    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
            upsert: false,
            cacheControl: "0",
            contentType: file.type,
        });

    if (uploadError) {
        console.error("Erreur upload avatar:", uploadError);
        return { error: "Impossible d’uploader l’avatar." };
    }

    // 4. URL publique
    const {
        data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return {
        success: true,
        url: publicUrl,
        path: filePath,
    };
}

// CHANGER LE MOT DE PASSE
export async function updatePassword(userId: string, newPassword: string) {
    const supabase = await createClient();

    // Vérifier utilisateur authentifié
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
        return { error: "Utilisateur non authentifié." };
    }

    // Sécurité: empêcher un utilisateur d'en changer un autre
    if (authData.user.id !== userId) {
        return { error: "Permission refusée." };
    }

    // Mise à jour du mot de passe
    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        console.error("Erreur update password:", error);
        return { error: "Impossible de mettre à jour le mot de passe." };
    }

    return { success: true };
}
