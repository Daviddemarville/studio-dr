'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AdminDashboard() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchSections = async () => {
      // ⚠️ récupérer le client Supabase (client-side)
      const supabase = supabaseBrowser()

      const { data, error } = await supabase
        .from('content_sections')
        .select('id')

      if (!error) {
        setCount(data?.length ?? 0)
      }
    }

    fetchSections()
  }, [])

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>

      <div className="bg-gray-800 p-4 rounded shadow text-center">
        <p className="text-lg">
          Nombre de sections : <b>{count}</b>
        </p>
      </div>

      <div className="mt-6 flex gap-4">
        <a href="/admin/profil" className="bg-blue-600 px-3 py-2 rounded text-white">
          Profil
        </a>
        <a href="/admin/sections" className="bg-green-600 px-3 py-2 rounded text-white">
          Sections
        </a>
      </div>
    </section>
  )
}
