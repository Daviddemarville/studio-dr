"use client";

import { useState } from "react";

export default function SettingsForm({
  initialValues,
}: {
  initialValues: { site_name?: string; logo_url?: string };
}) {
  const [siteName, setSiteName] = useState(initialValues?.site_name ?? "");
  const [logoUrl, setLogoUrl] = useState(initialValues?.logo_url ?? "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/admin/settings/update", {
      method: "POST",
      body: JSON.stringify({ siteName, logoUrl }),
    });

    if (res.ok) setMessage("Paramètres mis à jour ✔");
    else setMessage("Erreur lors de la mise à jour ❌");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg"
    >
      <div>
        <label className="block text-sm text-gray-300 mb-1">
          Nom du site
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full rounded-lg p-2 bg-gray-900 border border-gray-700 text-gray-200 mt-1"
          />
        </label>
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-1">
          Logo (URL)
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full rounded-lg p-2 bg-gray-900 border border-gray-700 text-gray-200 mt-1"
          />
        </label>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Sauvegarder
      </button>

      {message && <p className="text-sm text-green-400 mt-2">{message}</p>}
    </form>
  );
}
