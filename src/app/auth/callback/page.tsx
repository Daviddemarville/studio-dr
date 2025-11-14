'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = supabaseBrowser();

    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/admin"); // ← page après login
      }
    });
  }, []);

  return (
    <div className="p-6 text-center">
      <p>Connexion en cours...</p>
    </div>
  );
}
