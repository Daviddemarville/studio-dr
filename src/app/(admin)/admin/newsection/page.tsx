'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from "@/lib/supabase-browser";

interface Section {
  id: string
  slug: string
  title_fr: string
  title_en: string
  body_fr: string
  body_en: string
}

export default function NewSection() {
  const [sections, setSections] = useState<Section[]>([])

  const loadSections = async () => {
    const supabase = supabaseBrowser() 
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .order('slug')

    if (!error) setSections(data ?? [])
  }

  const handleAdd = async () => {
    const supabase = supabaseBrowser() 
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
      <h1 className="text-2xl font-bold mb-4">Ajouter une section</h1>

      <button
      type='button'
        onClick={handleAdd}
        className="bg-blue-600 px-3 py-2 rounded text-white mb-4"
      >
        + Ajouter une section
      </button>

      
    </div>
  )
}
