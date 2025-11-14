'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'

export default function ProfileEditor() {
  const [profile, setProfile] = useState<any>({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const supabase = supabaseBrowser() // ← IMPORTANT
      const { data } = await supabase.auth.getUser()

      if (data.user) {
        const { data: info, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (!error) setProfile(info)
      }
    }
    load()
  }, [])

  const save = async () => {
    const supabase = supabaseBrowser() // ← IMPORTANT

    const { error } = await supabase
      .from('users')
      .update({
        firstname: profile.firstname,
        lastname: profile.lastname,
        bio_fr: profile.bio_fr,
        bio_en: profile.bio_en,
        avatar_url: profile.avatar_url
      })
      .eq('id', profile.id)

    setMessage(error ? error.message : 'Profil sauvegardé.')
  }

  return (
    <div className="bg-gray-800 p-4 rounded">
      <div className="grid gap-2">
        <input
          className="border p-2 rounded bg-gray-700 text-white"
          placeholder="Prénom"
          value={profile.firstname || ''}
          onChange={(e) => setProfile({ ...profile, firstname: e.target.value })}
        />
        <input
          className="border p-2 rounded bg-gray-700 text-white"
          placeholder="Nom"
          value={profile.lastname || ''}
          onChange={(e) => setProfile({ ...profile, lastname: e.target.value })}
        />
        <textarea
          className="border p-2 rounded bg-gray-700 text-white"
          placeholder="Bio FR"
          value={profile.bio_fr || ''}
          onChange={(e) => setProfile({ ...profile, bio_fr: e.target.value })}
        />
        <textarea
          className="border p-2 rounded bg-gray-700 text-white"
          placeholder="Bio EN"
          value={profile.bio_en || ''}
          onChange={(e) => setProfile({ ...profile, bio_en: e.target.value })}
        />
      </div>

      <button
        onClick={save}
        className="bg-blue-600 mt-4 px-3 py-2 rounded text-white"
      >
        Sauvegarder
      </button>

      {message && <p className="mt-2 text-green-400">{message}</p>}
    </div>
  )
}
