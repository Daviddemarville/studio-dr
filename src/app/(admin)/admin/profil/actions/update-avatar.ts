"use server";

import { createClient } from "@/lib/supabase-server";
import { avatarUrlSchema } from "@/lib/zod/user-fields";

const MAX_FILE_SIZE = 1_000_000; // 1 Mo
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

/**
 * Upload un avatar vers Supabase Storage
 * Retourne l'URL publique + path final
 */
export async function uploadAvatar(file: File, userId: string) {
    const supabase = await createClient();

    // ----------- 1) Sécurité : vérifier l'utilisateur -----------
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { error: "Utilisateur non authentifié." };
    if (authData.user.id !== userId) return { error: "Permission refusée." };

    // ----------- 2) Sécurité fichier : taille -----------
    if (file.size > MAX_FILE_SIZE) {
        return { error: "Le fichier dépasse la taille maximale de 1 Mo." };
    }

    // ----------- 3) Sécurité fichier : MIME type -----------
    if (!ALLOWED_MIME.includes(file.type)) {
        return { error: "Format de fichier non supporté. (jpg, png, webp)" };
    }

    // ----------- 4) Extension sécurisée -----------
    const ext = file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
            ? "webp"
            : "jpg"; // JPEG / JPG

    const filePath = `avatar-${userId}-${Date.now()}.${ext}`;

    // ----------- 5) Upload vers Storage -----------
    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
            upsert: false,
            cacheControl: "0",
            contentType: file.type,
        });

    if (uploadError) {
        console.error(uploadError);
        return { error: "Impossible d’uploader l’avatar." };
    }

    // ----------- 6) URL publique -----------
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return {
        success: true,
        url: data.publicUrl,
        path: filePath,
    };
}

/**
 * Met à jour uniquement l'avatar_url en DB
 * Utilisé après upload OU URL externe
 */
export async function updateAvatarUrl(userId: string, url: string | null) {
    const supabase = await createClient();

    // ----------- 1) Vérifier utilisateur connecté -----------
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { error: "Utilisateur non authentifié." };
    if (authData.user.id !== userId) return { error: "Permission refusée." };

    // ----------- 2) Valider l'URL externe (ou null) via Zod -----------
    const parsed = avatarUrlSchema.safeParse(url);
    if (!parsed.success) {
        return { error: "URL d’avatar invalide." };
    }

    // ----------- 3) Mise à jour DB -----------
    const { error } = await supabase
        .from("users")
        .update({
            avatar_url: parsed.data, // string | null validé par Zod
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

    if (error) {
        console.error(error);
        return { error: "Impossible de mettre à jour l’avatar." };
    }

    return { success: true };
}
