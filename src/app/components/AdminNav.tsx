'use client'

import { supabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from 'next/navigation'

export default function AdminNav() {
  const router = useRouter()

  const logout = async () => {
    const supabase = supabaseBrowser() // ← IMPORTANT
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-56 bg-gray-800 h-screen p-4 flex flex-col gap-4 text-gray-300">
      <h2 className="text-xl font-bold mb-4 text-white">Studio DR</h2>

      <a href="/admin" className="hover:text-white">
        Tableau de bord
      </a>

      <a href="/admin/profil" className="hover:text-white">
        Profil
      </a>

      <a href="/admin/sections" className="hover:text-white">
        Sections
      </a>

      <button
        onClick={logout}
        className="mt-auto bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        Déconnexion
      </button>
    </aside>
  )
}
