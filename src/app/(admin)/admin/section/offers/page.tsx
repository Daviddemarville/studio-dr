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

export default function SectionsOffers() {
  const [sections, setSections] = useState<Section[]>([])

  const loadSections = async () => {
    const supabase = supabaseBrowser() 
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('slug')

    if (!error) setSections(data ?? [])
  }

    useEffect(() => {
    loadSections()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestion section offers / Nos offres / Nos tarifs</h1>

      <div className="flex flex-col gap-4">
        {sections.map((s) => (
          <SectionEditor key={s.id} section={s} reload={loadSections} />
        ))}
      </div>
    </div>
  )
}
