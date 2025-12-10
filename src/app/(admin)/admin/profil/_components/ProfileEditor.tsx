"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { UserProfile } from "@/types/user-profile";
import Accordion from "../../components/ui/Accordion";
import AccordionItem from "../../components/ui/AccordionItem";
import { getCurrentUserProfile } from "../actions/get-current-profile";
import { updateUserProfile } from "../actions/update-user-profile";
import ProfileAvatarUploader from "./ProfileAvatarUploader";
import ProfileBioFields from "./ProfileBioFields";
import ProfileIdentityFields from "./ProfileIdentityFields";
import ProfilePasswordUpdater from "./ProfilePasswordUpdater";
import ProfileSocialLinks from "./ProfileSocialLinks";

export default function ProfileEditor() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [authEmail, setAuthEmail] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  // Charger profil
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
  // 2) Sauvegarde du profil (hors avatar)
  // ---------------------------------------
  async function handleSave() {
    if (!profile) return;
    setIsSaving(true);

    const updates = {
      firstname: profile.firstname || "",
      lastname: profile.lastname || "",
      pseudo: profile.pseudo || null,
      email: profile.email || "",
      bio_fr: profile.bio_fr || null,
      bio_en: profile.bio_en || null,
      url_portfolio: profile.url_portfolio || null,
      url_linkedin: profile.url_linkedin || null,
      url_github: profile.url_github || null,
    };

    const result = await updateUserProfile(updates);

    setIsSaving(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Profil mis à jour !");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Accordion type="multiple">
        <AccordionItem id="email" title="Email de connexion">
          <p className="text-neutral-400">{authEmail}</p>
        </AccordionItem>

        <AccordionItem id="avatar" title="Avatar" defaultOpen>
          <ProfileAvatarUploader profile={profile} setProfile={setProfile} />
        </AccordionItem>

        <AccordionItem id="identity" title="Identité">
          <ProfileIdentityFields profile={profile} setProfile={setProfile} />
        </AccordionItem>

        <AccordionItem id="biographies" title="Biographies">
          <ProfileBioFields profile={profile} setProfile={setProfile} />
        </AccordionItem>

        <AccordionItem id="socials" title="Réseaux Sociaux">
          <ProfileSocialLinks profile={profile} setProfile={setProfile} />
        </AccordionItem>

        {/* Panel dédié pour le bouton */}
        <AccordionItem id="save" title="Sauvegarde du profil">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
          >
            {isSaving ? "Enregistrement..." : "Sauvegarder"}
          </button>
        </AccordionItem>

        <AccordionItem id="password" title="Mot de passe">
          <ProfilePasswordUpdater userId={profile.id} />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
