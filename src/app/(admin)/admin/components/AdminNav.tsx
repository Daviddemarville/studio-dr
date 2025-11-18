'use client'

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from 'next/navigation'

export default function AdminNav() {
  const router = useRouter()

  const links = [
    { label: 'Profil / Qui sommes nous?', href: '/admin/profil' },
    { label: 'Notre travail', href: '/admin/section/work' },
    { label: 'Notre offre', href: '/admin/section/offers' },
    { label: 'Nos tarifs', href: '/admin/section/offers' },
    { label: 'Comment travaillons-nous?', href: '/admin/section/workflow' },    
  ];

const supabase = supabaseBrowser();

  const [siteName, setSiteName] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Chargement dynamique des settings
  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("settings")
        .select("site_name, logo_url")
        .single();

      setSiteName(data?.site_name ?? null);
      setLogoUrl(data?.logo_url ??  null);
    }

    loadSettings();
  }, [supabase]);

  const logout = async () => {
    const supabase = supabaseBrowser() // ← IMPORTANT
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-56 bg-gray-800 h-screen p-4 flex flex-col gap-4 text-gray-300">
      {/* LOGO / NOM DU SITE */}
        <div className="flex items-center">
          {/*showLogo || title || fallback*/}
          {logoUrl && logoUrl.trim() !== "" ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-10 w-auto object-contain select-none"
            />
          ) : 
            siteName ? (
              <span className="text-xl font-semibold text-gray-900 tracking-tight select-none">
                <h2 className="text-xl font-bold mb-4 text-white">{siteName}</h2>
              </span>

            ) : (
                <span className="text-xl font-semibold text-gray-900 tracking-tight select-none">
                  <h2 className="text-xl font-bold mb-4 text-red-500">Studio DR</h2>
                </span>
              )}
        </div>      

      <div>
      <a href="/admin" className="hover:text-white">
        Tableau de bord
      </a>
      <p className="border-b border-gray-700 my-2 mt-6 mb-6"></p>
      <p className="text-gray-400 uppercase text-sm mb-2">Sections du site</p>
      <p className="text-gray-400 text-xs mb-6">cliquez pour modifier une section</p>

     <div className="flex flex-col gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className=" text-gray-300 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        </div>

        <div>
        <p className="border-b border-gray-700 my-2 mb-6"></p>
        <p className="text-gray-400 uppercase text-sm mb-6">Actions rapides</p>
        <div className="flex flex-col text-gray-300 gap-4">
          <a  href="/admin/section/newsection" className="hover:text-white">
            + Nouvelle section
          </a>
          <a href="/admin/valideusers" className="hover:text-white">
            Valider un utilisateur
          </a>
          <a href="/admin/message" className="hover:text-white">
            Administrer les mails reçus
          </a>
          <p className="border-b border-gray-700 my-2 mb-6"></p>
         </div> 

        </div>

      <button
      type="button"
        onClick={logout}
        className="mt-auto bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        Déconnexion
      </button>
    </aside>
  )
}
