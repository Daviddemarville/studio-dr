"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function SectionContact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      token: formData.get("cf-turnstile-response"),
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "❌ Une erreur est survenue");
      return;
    }

    toast.success("✔ Message envoyé avec succès !");
    form.reset(); // reset propre
  };

  return (
    <section className="mb-16 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-semibold mb-2 text-gray-900">
        Envie d’en savoir plus ?
      </h2>
      <p className="text-gray-600 mb-6">
        Contactez-nous, notre équipe vous répondra rapidement.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="firstname"
            placeholder="Prénom"
            className="border rounded-lg p-3 bg-gray-50"
            required
          />
          <input
            name="lastname"
            placeholder="Nom"
            className="border rounded-lg p-3 bg-gray-50"
            required
          />
        </div>

        <input
          name="email"
          placeholder="Adresse email"
          type="email"
          className="border rounded-lg p-3 bg-gray-50"
          required
        />

        <input
          name="subject"
          placeholder="Objet"
          className="border rounded-lg p-3 bg-gray-50"
          required
        />

        <textarea
          name="message"
          placeholder="Votre message..."
          className="border rounded-lg p-3 bg-gray-50 min-h-[120px]"
          required
        />

        {/* CAPTCHA TURNSTILE */}
        <div
          className="cf-turnstile"
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        ></div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {loading ? "Envoi en cours..." : "Envoyer le message"}
        </button>
      </form>
    </section>
  );
}
