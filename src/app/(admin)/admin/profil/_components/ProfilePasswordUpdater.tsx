"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { updatePassword } from "../actions";

export default function ProfilePasswordUpdater({ userId }: { userId: string }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdatePassword() {
    // 1) Validations client 💡
    if (!newPassword || newPassword.length < 6) {
      toast.error("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }

    if (newPassword !== confirm) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    // 2) Appel serveur
    setLoading(true);

    const result = await updatePassword(userId, newPassword);

    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Mot de passe mis à jour !");
    setNewPassword("");
    setConfirm("");
  }

  return (
    <div className="bg-neutral-900 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Changer le mot de passe</h2>

      <div className="flex flex-col gap-3 max-w-md">
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 p-2 rounded"
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 p-2 rounded"
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
