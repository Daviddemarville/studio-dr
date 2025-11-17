'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'

export default function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = supabaseBrowser()

  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      // récupère l'utilisateur via cookie
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      // Vérifier si approuvé dans la table users
      const { data: userInfo, error } = await supabase
        .from('users')
        .select('is_approved')
        .eq('id', user.id)
        .single()

      if (error || !userInfo?.is_approved) {
        await supabase.auth.signOut()
        router.replace('/login')
        return
      }

      // OK
      setAuthChecked(true)
    }

    checkAuth()
  }, [router, supabase])

  // pendant le check : éviter flash
  if (!authChecked) return null

  return <>{children}</>
}
