"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import PasswordField from "@/app/(public)/components/ui/PasswordField";
import { passwordUpdateSchema } from "@/lib/zod/passwordUpdateSchema";
import { updatePasswordUser } from "../actions/update-password-user";

/**
 * Composant de mise à jour du mot de passe utilisateur.
 *
 * Obligations Supabase :
 * - REAUTHENTIFICATION obligatoire → nécessite l'ancien mot de passe
 * - Validation stricte du nouveau mot de passe via Zod
 */
export default function ProfilePasswordUpdater({ userId }: { userId: string }) {
  const [oldPassword, setOldPassword] = useState(""); // 🔥 Champ ajouté
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdatePassword() {
    // -------------------------
    // 1) Validation client via Zod
    // -------------------------
    const parsed = passwordUpdateSchema.safeParse({
      oldPassword,
      password: newPassword,
      confirm,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Mot de passe invalide.");
      return;
    }

    setLoading(true);

    // -------------------------
    // 2) Appel de l'action serveur
    // -------------------------
    const result = await updatePasswordUser(userId, oldPassword, newPassword);

    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Mot de passe mis à jour !");
    setOldPassword("");
    setNewPassword("");
    setConfirm("");
  }

  return (
    <div className="bg-neutral-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Changer le mot de passe</h2>

      <div className="flex flex-col gap-4 max-w-md">

        {/* 🔥 Champ Ancien mot de passe (obligatoire en reauth) */}
        <PasswordField
          label="Ancien mot de passe"
          placeholder="********"
          value={oldPassword}
          onChange={setOldPassword}
        />

        <PasswordField
          label="Nouveau mot de passe"
          placeholder="********"
          value={newPassword}
          onChange={setNewPassword}
        />

        <PasswordField
          label="Confirmer le mot de passe"
          placeholder="********"
          value={confirm}
          onChange={setConfirm}
        />

        <button
          type="button"
          onClick={handleUpdatePassword}
          disabled={loading}
          className="bg-blue-600 px-5 py-2 rounded hover:bg-blue-500 disabled:opacity-50 w-fit"
        >
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </div>
    </div>
  );
}
