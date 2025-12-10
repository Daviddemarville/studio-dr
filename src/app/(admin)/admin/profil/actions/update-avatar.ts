"use server";

import { createClient } from "@/lib/supabase-server";
import { avatarUrlSchema } from "@/lib/zod/user-fields";

const MAX_FILE_SIZE = 1_000_000; // 1 Mo
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

/**
 * Upload un avatar en écrasant l'ancien.
 *
 * Règles :
 * - Chaque user ne possède qu’un seul avatar.
 * - Le fichier s'enregistre sous : avatars/{userId}.{ext}
 * - Tous les anciens formats (jpg/png/webp) sont supprimés avant upload.
 * - Retourne l’URL publique finale.
 */
export async function uploadAvatar(file: File, userId: string) {
  const supabase = await createClient();

  // ----------- 1) Sécurité : vérifier l'utilisateur connecté -----------
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return { error: "Utilisateur non authentifié." };
  if (authData.user.id !== userId) return { error: "Permission refusée." };

  // ----------- 2) Sécurité fichier : taille maximale -----------
  if (file.size > MAX_FILE_SIZE) {
    return { error: "Le fichier dépasse la taille maximale de 1 Mo." };
  }

  // ----------- 3) Sécurité fichier : type MIME autorisé -----------
  if (!ALLOWED_MIME.includes(file.type)) {
    return { error: "Format non supporté. (jpg, png, webp)" };
  }

  // ----------- 4) Déterminer l’extension cible -----------
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg"; // fallback JPEG

  const filePath = `${userId}.${ext}`;

  // ----------- 5) Supprimer toutes les anciennes versions -----------
  // Exemple : userId.jpg, userId.png, userId.webp
  const possibleOldFiles = [`${userId}.jpg`, `${userId}.png`, `${userId}.webp`];

  const { error: removeError } = await supabase.storage
    .from("avatars")
    .remove(possibleOldFiles);

  if (removeError) {
    console.warn(
      "Aucun ancien avatar à supprimer ou erreur mineure :",
      removeError,
    );
  }

  // ----------- 6) Upload en écrasant le fichier précédent -----------
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true, // écrase automatiquement
      cacheControl: "0",
      contentType: file.type,
    });

  if (uploadError) {
    console.error(uploadError);
    return { error: "Impossible d’uploader l’avatar." };
  }

  // ----------- 7) Récupérer l’URL publique -----------
  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

  return {
    success: true,
    url: data.publicUrl,
    path: filePath,
  };
}

/**
 * Met à jour le champ avatar_url dans la DB.
 * Appelé après upload ou après suppression.
 */
export async function updateAvatarUrl(userId: string, url: string | null) {
  const supabase = await createClient();

  // ----------- 1) Vérifier utilisateur -----------
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return { error: "Utilisateur non authentifié." };
  if (authData.user.id !== userId) return { error: "Permission refusée." };

  // ----------- 2) Valider l’URL via Zod -----------
  const parsed = avatarUrlSchema.safeParse(url);
  if (!parsed.success) {
    return { error: "URL d’avatar invalide." };
  }

  // ----------- 3) Mise à jour DB -----------
  const { error } = await supabase
    .from("users")
    .update({
      avatar_url: parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error(error);
    return { error: "Impossible de mettre à jour l’avatar." };
  }

  return { success: true };
}
