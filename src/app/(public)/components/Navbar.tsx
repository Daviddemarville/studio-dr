'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Accueil', href: '/' },
    { label: 'Qui sommes-nous?', href: '#qui-sommes-nous' },
    { label: 'Notre travail', href: '#notre-travail' },
    { label: 'Notre offre', href: '#nos-offres' },
    { label: 'Nos tarifs', href: '#nos-tarifs' },
    { label: 'Comment travaillons-nous', href: '#comment-travaillons-nous' },
    { label: 'Nous contacter', href: '#contact' },
  ];

  // 🔒 Désactive le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
  
      <nav className="relative">
        
        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* MOBILE BURGER */}
        <button
        type='button'
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* MOBILE MENU */}
        {open && (
          <>
            {/* OVERLAY FOND NOIR */}
            <button
              type="button"
              className="fixed inset-0 bg-black/30 z-40 cursor-default"
              onClick={() => setOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false);
              }}
              aria-label="Fermer le menu"
            />

            {/* MENU DÉROULANT */}
            <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg py-6 px-4 z-50 animate-slide-left">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-2 py-3 text-gray-700 text-base hover:bg-gray-100 rounded-md transition"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </>
        )}

      </nav>
  );
}
