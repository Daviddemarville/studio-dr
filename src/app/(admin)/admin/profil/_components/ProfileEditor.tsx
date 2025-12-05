"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCurrentUserProfile, updateUserProfile } from "../actions";
import ProfileAvatarUploader from "./ProfileAvatarUploader";
import ProfileBioFields from "./ProfileBioFields";
import ProfileIdentityFields from "./ProfileIdentityFields";
import ProfilePasswordUpdater from "./ProfilePasswordUpdater";
import ProfileSocialLinks from "./ProfileSocialLinks";

export default function ProfileEditor() {
  const [profile, setProfile] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getCurrentUserProfile();

      if (!data || !data.publicProfile) {
        toast.error("Impossible de charger le profil.");
        return;
      }

      setProfile(data.publicProfile);
      setAuthEmail(data.authEmail);
    };

    load();
  }, []);

  if (!profile) {
    return <p className="text-neutral-400">Chargement...</p>;
  }
  // ---------------------------------------
  // 2) Sauvegarde du profil
  // ---------------------------------------
  async function handleSave() {
    setIsSaving(true);

    const formData = new FormData();
    formData.append("firstname", profile.firstname || "");
    formData.append("lastname", profile.lastname || "");
    formData.append("pseudo", profile.pseudo || "");
    formData.append("email", profile.email || "");
    formData.append("bio_fr", profile.bio_fr || "");
    formData.append("bio_en", profile.bio_en || "");
    formData.append("avatar_url", profile.avatar_url || "");
    formData.append("url_portfolio", profile.url_portfolio || "");
    formData.append("url_linkedin", profile.url_linkedin || "");
    formData.append("url_github", profile.url_github || "");

    const result = await updateUserProfile(formData);

    setIsSaving(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Profil mis à jour !");
    }
  }
  return (
    <div className="flex flex-col gap-8">
      {/* Email Auth */}
      <div className="bg-neutral-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Email de connexion</h2>
        <p className="text-neutral-400">{authEmail}</p>
      </div>

      {/* Avatar */}
      <ProfileAvatarUploader profile={profile} setProfile={setProfile} />

      {/* Identité */}
      <ProfileIdentityFields profile={profile} setProfile={setProfile} />

      {/* Biographies */}
      <ProfileBioFields profile={profile} setProfile={setProfile} />

      {/* Réseaux */}
      <ProfileSocialLinks profile={profile} setProfile={setProfile} />

      {/* Mot de passe */}
      <ProfilePasswordUpdater userId={profile.id} />

      {/* Bouton Sauvegarder */}
      <div className="flex justify-start">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
        >
          {isSaving ? "Enregistrement..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}
