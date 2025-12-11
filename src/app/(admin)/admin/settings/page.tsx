"use client";

import Link from "next/link";

const cards = [
  {
    title: "Paramètres généraux",
    description: "Modifier le nom du site, logo, meta et réglages globaux.",
    href: "/admin/settings/general",
  },
  {
    title: "Mentions légales",
    description: "Éditeur, hébergeur, informations légales obligatoires.",
    href: "/admin/settings/mentions-legales",
  },
  {
    title: "Conditions générales de vente",
    description: "Texte légal concernant la vente de services ou produits.",
    href: "/admin/settings/conditions-vente",
  },
  {
    title: "Politique de confidentialité",
    description: "Protection des données personnelles et obligations RGPD.",
    href: "/admin/settings/politique-confidentialite",
  },
  {
    title: "Mode maintenance",
    description: "Activer / désactiver le mode maintenance et messages.",
    href: "/admin/settings/maintenance",
  },
  {
    title: "Informations entreprise",
    description: "Adresse, téléphone, SIRET, informations administratives.",
    href: "/admin/settings/company-info",
  },
];

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Paramètres du site</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block border border-neutral-700 bg-neutral-900 p-6 rounded-lg hover:bg-neutral-800 transition"
          >
            <h2 className="text-lg font-medium mb-2">{card.title}</h2>
            <p className="text-sm text-neutral-300">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
