"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import type { UserProfile } from "@/types/user-profile";
import { uploadAvatar, updateAvatarUrl } from "../actions/update-avatar";

// IMPORT ZOD POUR VALIDER LE LIEN AVANT ENVOI
import { avatarUrlSchema } from "@/lib/zod/user-fields";

export default function ProfileAvatarUploader({
  profile,
  setProfile,
}: {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  // -------------------------------------------
  // 1) Upload fichier → Storage → DB
  // -------------------------------------------
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const result = await uploadAvatar(file, profile.id);

      if (result.error) {
        toast.error(result.error);
      } else {
        const newUrl = result.url ?? null;

        // Mise à jour locale
        setProfile({ ...profile, avatar_url: newUrl });

        // Mise à jour DB
        const res = await updateAvatarUrl(profile.id, newUrl);

        if (res.error) {
          toast.error("Erreur lors de la sauvegarde de l'avatar.");
        } else {
          toast.success("Avatar mis à jour !");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Échec de l'upload.");
    }

    setIsUploading(false);
  }

  // -------------------------------------------
  // 2) URL externe → Validée + DB immédiate
  // -------------------------------------------
  async function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const url = e.target.value.trim();

    // Validation Zod AVANT envoi
    const parsed = avatarUrlSchema.safeParse(url);

    if (!parsed.success) {
      toast.error("URL d’avatar invalide ou non autorisée.");
      return;
    }

    const validUrl = parsed.data || null;

    // update UI
    setProfile({ ...profile, avatar_url: validUrl });

    // update DB
    const res = await updateAvatarUrl(profile.id, validUrl);

    if (res.error) {
      toast.error("Erreur lors de la mise à jour de l'URL.");
    } else {
      toast.success("Avatar mis à jour !");
    }
  }

  return (
    <div className="bg-neutral-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Avatar</h2>

      <div className="
        flex flex-col md:flex-row
        items-start 
        gap-4 md:gap-6 
        w-full
      ">
        {/* Preview avatar */}
        <img
          src={
            profile.avatar_url && profile.avatar_url.length > 0
              ? profile.avatar_url
              : "/default-avatar.png"
          }
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border border-neutral-700"
        />

        <div className="flex flex-col gap-4 w-full">
          {/* URL externe */}
          <div>
            <label className="block text-sm mb-1 text-neutral-300">
              URL d’un avatar externe
            </label>
            <input
              type="url"
              defaultValue={profile.avatar_url || ""}
              onBlur={handleUrlChange}
              className="
                w-full 
                max-w-full 
                min-w-0
                bg-neutral-800 
                border border-neutral-700 
                p-2 rounded 
                break-all 
                overflow-hidden
              "
              placeholder="https://exemple.com/avatar.jpg"
            />

            <p className="text-xs text-neutral-500 mt-1">
              http/https ou image data-uri autorisés
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center w-full">
            <div className="h-px bg-neutral-700 w-full sm:flex-1" />
            <span className="text-neutral-500 text-sm whitespace-nowrap">ou</span>
            <div className="h-px bg-neutral-700 w-full sm:flex-1" />
          </div>

          {/* Upload fichier */}
          <div>
            <label className="block text-sm mb-1 text-neutral-300">
              Importer un fichier
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-neutral-400"
            />

            {isUploading && (
              <p className="text-sm text-blue-400 mt-1">Upload...</p>
            )}
          </div>

          <div className="border border-neutral-700 rounded p-3 text-neutral-400 text-sm mt-2 opacity-50">
            <p>Zone Drag & Drop (prochainement)</p>
          </div>

          <p className="text-xs text-neutral-500 mt-1">
            Formats acceptés : .jpg, .jpeg, .webp, .png
          </p>
          <p className="text-xs text-neutral-500 mt-1">Taille max : 1 Mo</p>
        </div>
      </div>
    </div>
  );
}
