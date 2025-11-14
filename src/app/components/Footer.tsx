'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      
      {/* CONTENT WRAPPER */}
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Bloc 1 — Branding */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Studio DR</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Développement web fullstack — React, Next.js, Node.js  
            Solutions modernes, rapides et sur-mesure.
          </p>
        </div>

        {/* Bloc 2 — Informations légales */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Informations</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/mentions-legales" className="hover:text-white transition">Mentions légales</a></li>
            <li><a href="/confidentialite" className="hover:text-white transition">Politique de confidentialité</a></li>
            <li><a href="/conditions-vente" className="hover:text-white transition">Conditions générales de vente</a></li>
          </ul>
        </div>

        {/* Bloc 3 — Partenaires / Portfolios */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Partenaires</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="https://portfolio-david.test" className="hover:text-white transition">Portfolio David</a></li>
            <li><a href="https://portfolio-rahmoun.test" className="hover:text-white transition">Portfolio Rahmoun</a></li>
            {/* Ajouter d'autres liens plus tard */}
          </ul>
        </div>

        {/* Bloc 4 — Accès admin */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Administration</h4>
          <a
            href="/admin"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Espace administrateur
          </a>
        </div>

      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Studio DR — Tous droits réservés.
      </div>
    </footer>
  );
}
