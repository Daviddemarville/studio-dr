'use client'
import { useState } from 'react'
import { supabaseBrowser } from "@/lib/supabase-browser";

interface Section {
  id: string
  slug: string
  title_fr: string
  title_en: string
  body_fr: string
  body_en: string
}

export default function SectionEditor({
  section,
  reload
}: {
  section: Section
  reload: () => void
}) {
  const [edit, setEdit] = useState(section)
  const [message, setMessage] = useState('')

  const save = async () => {
    const supabase = supabaseBrowser(); // ← IMPORTANT

    const { error } = await supabase
      .from('content_sections')
      .update({
        title_fr: edit.title_fr,
        title_en: edit.title_en,
        body_fr: edit.body_fr,
        body_en: edit.body_en
      })
      .eq('id', edit.id)

    setMessage(error ? error.message : 'Section sauvegardée.')
  }

  const del = async () => {
    const supabase = supabaseBrowser(); // ← IMPORTANT

    if (!confirm('Supprimer cette section ?')) return
    
    await supabase.from('content_sections').delete().eq('id', edit.id)
    
    reload()
  }

  return (
    <div className="bg-gray-800 p-4 rounded shadow">
      <div className="flex justify-between mb-2">
        <h3 className="font-semibold text-white">{edit.slug}</h3>
        <button
        type='button'
          onClick={del}
          className="text-sm text-red-400 hover:text-red-600"
        >
          Supprimer
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          className="border p-2 rounded bg-gray-700 text-white"
          placeholder="Titre FR"
          value={edit.title_fr || ''}
          onChange={(e) => setEdit({ ...edit, title_fr: e.target.value })}
        />

        <input
          className="border p-2 rounded bg-gray-700 text-white"
          placeholder="Titre EN"
          value={edit.title_en || ''}
          onChange={(e) => setEdit({ ...edit, title_en: e.target.value })}
        />

        <textarea
          className="border p-2 rounded col-span-2 bg-gray-700 text-white"
          rows={3}
          placeholder="Texte FR"
          value={edit.body_fr || ''}
          onChange={(e) => setEdit({ ...edit, body_fr: e.target.value })}
        />

        <textarea
          className="border p-2 rounded col-span-2 bg-gray-700 text-white"
          rows={3}
          placeholder="Texte EN"
          value={edit.body_en || ''}
          onChange={(e) => setEdit({ ...edit, body_en: e.target.value })}
        />
      </div>

      <button
      type='button'
        onClick={save}
        className="bg-blue-600 mt-3 px-3 py-2 rounded text-white"
      >
        Sauvegarder
      </button>

      {message && <p className="mt-2 text-green-400">{message}</p>}
    </div>
  )
}
