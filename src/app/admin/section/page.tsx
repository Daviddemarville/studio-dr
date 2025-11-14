'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from "@/lib/supabase-browser";
import SectionEditor from '../../components/SectionEditor'

interface Section {
  id: string
  slug: string
  title_fr: string
  title_en: string
  body_fr: string
  body_en: string
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([])

  const loadSections = async () => {
    const supabase = supabaseBrowser() // ← IMPORTANT
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .order('slug')

    if (!error) setSections(data ?? [])
  }

  const handleAdd = async () => {
    const supabase = supabaseBrowser() // ← IMPORTANT
    const slug = prompt('Nom de la nouvelle section ?')
    if (!slug) return

    await supabase
      .from('content_sections')
      .insert({ slug })

    loadSections()
  }

  useEffect(() => {
    loadSections()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestion des sections</h1>

      <button
        onClick={handleAdd}
        className="bg-blue-600 px-3 py-2 rounded text-white mb-4"
      >
        + Ajouter une section
      </button>

      <div className="flex flex-col gap-4">
        {sections.map((s) => (
          <SectionEditor key={s.id} section={s} reload={loadSections} />
        ))}
      </div>
    </div>
  )
}
