import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const supabase = await supabaseServer();

  // 1. On finalise la session si un code existe
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // 🔥 Gestion propre des liens expirés / invalides / déjà utilisés
    if (error) {
      return NextResponse.redirect(`${url.origin}/auth/error`);
    }
  }

  // 2. On récupère l'utilisateur et son état
  const { data, error: getUserError } = await supabase.auth.getUser();

  // Si getUser échoue → on envoie vers une page d'erreur cohérente
  if (getUserError) {
    return NextResponse.redirect(`${url.origin}/auth/error`);
  }

  // Si aucun user → rediriger login (cas normal)
  if (!data.user) {
    return NextResponse.redirect(`${url.origin}/login`);
  }

  // 3. Si email est confirmé → page dédiée
  if (data.user.email_confirmed_at) {
    return NextResponse.redirect(`${url.origin}/auth/confirmed`);
  }

  // 4. Sinon → redirection login par défaut
  return NextResponse.redirect(`${url.origin}/login`);
}

export default function Loading() {
  return <p className="text-center p-6 text-white">Validation en cours...</p>;
}
