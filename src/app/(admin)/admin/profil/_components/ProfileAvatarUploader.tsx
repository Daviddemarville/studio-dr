"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import type { UserProfile } from "@/types/user-profile";
import { uploadAvatar } from "../actions";

export default function ProfileAvatarUploader({
  profile,
  setProfile,
}: {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  // -------------------------------------------
  // 1) Gestion upload fichier → server action
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
        toast.success("Avatar mis à jour !");
        setProfile({ ...profile, avatar_url: result.url ?? null });
      }
    } catch (err) {
      console.error(err);
      toast.error("Échec de l'upload.");
    }

    setIsUploading(false);
  }

  // -------------------------------------------
  // 2) Gestion via URL externe
  // -------------------------------------------
  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProfile({
      ...profile,
      avatar_url: e.target.value,
    });
  }

  return (
    <div className="bg-neutral-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Avatar</h2>

      <div className="flex items-center gap-6">
        {/* Preview avatar */}
        <picture>
          <img
            src={
              profile.avatar_url && profile.avatar_url.length > 0
                ? profile.avatar_url
                : "/default-avatar.png"
            }
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border border-neutral-700"
          />
        </picture>

        <div className="flex flex-col gap-4 w-full">
          {/* URL externe */}
          <div>
            <label
              htmlFor="url"
              className="block text-sm mb-1 text-neutral-300"
            >
              URL d’un avatar externe
            </label>
            <input
              id="url"
              type="url"
              value={profile.avatar_url || ""}
              onChange={handleUrlChange}
              className="w-full bg-neutral-800 border border-neutral-700 p-2 rounded"
              placeholder="https://exemple.com/avatar.jpg"
            />
          </div>

          {/* Ligne séparation */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-neutral-700" />
            <span className="text-neutral-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-neutral-700" />
          </div>

          {/* Upload fichier */}
          <div>
            <label
              htmlFor="file"
              className="block text-sm mb-1 text-neutral-300"
            >
              Importer un fichier
            </label>
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-neutral-400"
            />

            {isUploading && (
              <p className="text-sm text-blue-400 mt-1">Upload...</p>
            )}
          </div>

          {/* FUTUR : Zone de glisser-déposer */}
          <div className="border border-neutral-700 rounded p-3 text-neutral-400 text-sm mt-2 opacity-50">
            <p className="">
              Zone Drag & Drop (à activer dans une prochaine branche)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
