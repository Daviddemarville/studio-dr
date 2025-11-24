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
    form.reset();
  };

  return (
    <section className="scroll-mt-24 py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Envie d'en savoir plus ?
        </h2>
        <p className="text-gray-700 mb-8 text-lg">
          Contactez-nous, notre équipe vous répondra rapidement.
        </p>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="firstname"
                placeholder="Prénom"
                className="border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                name="lastname"
                placeholder="Nom"
                className="border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <input
              name="email"
              placeholder="Adresse email"
              type="email"
              className="border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              name="subject"
              placeholder="Objet"
              className="border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <textarea
              name="message"
              placeholder="Votre message..."
              className="border border-gray-300 rounded-lg p-3 bg-gray-50 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
