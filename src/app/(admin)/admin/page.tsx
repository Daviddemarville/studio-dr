'use client'

import { useEffect, useState, useRef } from 'react'
import { supabaseBrowser } from "@/lib/supabase-browser";
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0)
  const [sectionsCount, setSectionsCount] = useState(0) // content_sections + workflowstep + offers
  const [now, setNow] = useState(new Date())
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const user = useCurrentUser();
  const firstname = user?.firstname ?? 'Administrateur'

  useEffect(() => {
    const fetchCounts = async () => {
      const supabase = supabaseBrowser()

      const [rUsers, rSections, rWorkflow, rOffers] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('content_sections').select('*', { count: 'exact', head: true }),
        supabase.from('workflowstep').select('*', { count: 'exact', head: true }),
        supabase.from('offers').select('*', { count: 'exact', head: true }),
      ])

      if (rUsers.error) console.error('users count error:', rUsers.error)
      if (rSections.error) console.error('content_sections count error:', rSections.error)
      if (rWorkflow.error) console.error('workflowstep count error:', rWorkflow.error)
      if (rOffers.error) console.error('offers count error:', rOffers.error)

      const users = rUsers.count ?? 0
      const sectionsTotal = (rSections.count ?? 0) + (rWorkflow.count ?? 0) + (rOffers.count ?? 0)

      setUsersCount(users)
      setSectionsCount(sectionsTotal)
    }

    fetchCounts()

    const timer = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(timer)
  }, [])

  // Formatage date/heure
  const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(now)
  const day = now.getDate().toString().padStart(2, '0')
  const month = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(now)
  const year = now.getFullYear()
  const hour = now.getHours().toString()
  const minute = now.getMinutes().toString().padStart(2, '0')
  const formatted = `Nous sommes ${weekday} ${day} ${month} ${year} et il est ${hour}h${minute}`

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>

      <div className="mb-4 text-white">
        <p className="mb-1">Bienvenue {firstname} dans le panneau d'administration.</p>
        <p className="text-sm opacity-80">{formatted}</p>
      </div>

      {/* Cartes de compteurs */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded shadow w-48">
          <p className="text-sm text-gray-300">Nombre total de sections</p>
          <p className="text-2xl font-bold">{sectionsCount}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded shadow w-48">
          <p className="text-sm text-gray-300">Nombre d'utilisateurs</p>
          <p className="text-2xl font-bold">{usersCount}</p>
        </div>
      </div>

      {/* Aperçu du site — masqué sur mobile */}
      <div className="hidden sm:block">
        <div className="mb-2 text-sm text-gray-400">Aperçu en direct</div>

        {/* conteneur relatif pour overlay */}
        <div className="relative rounded shadow border overflow-hidden">
          <iframe
            ref={iframeRef}
            id="preview-iframe"
            title="Aperçu du site"
            src="/"
            className="w-full h-[70vh] min-h-[400px] block"
          />

          {/* voile noir 30% (tailwind JIT: bg-black/50) ; pointer-events-none pour laisser l'iframe interactif */}
          <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        </div>
      </div>

      {/* Liens d'action */}
      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={() => iframeRef.current?.contentWindow?.location.reload()}
          className="bg-blue-600 px-3 py-2 rounded text-white hidden sm:block"
        >
          Actualiser la page
        </button>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 px-3 py-2 rounded text-white"
        >
          Ouvrir dans un nouvel onglet
        </a>
      </div>
    </section>
  )
}
