import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Code retourné par Supabase (email link OU OAuth)
  const code = url.searchParams.get("code");

  // Provider retourné lors d’un login via OAuth (discord, github, google…)
  const provider = url.searchParams.get("provider");

  const supabase = await supabaseServer();

  /**
   * ────────────────────────────────────────────────────────────────────────────────
   * 1. EXCHANGE DU CODE POUR UNE SESSION (EMAIL LINK OU PROVIDER OAUTH)
   * ────────────────────────────────────────────────────────────────────────────────
   * - Supabase renvoie toujours un `code` (email signup / magic link / OAuth)
   * - On l'échange contre une session persistée côté server
   * - Si error → lien expiré, mauvais code, tentative frauduleuse, etc.
   * ────────────────────────────────────────────────────────────────────────────────
   */
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("OAuth/Email exchange error:", error);
      return NextResponse.redirect(`${url.origin}/auth/error`);
    }
  }

  /**
   * ────────────────────────────────────────────────────────────────────────────────
   * 2. RÉCUPÉRATION DU USER
   * ────────────────────────────────────────────────────────────────────────────────
   * Après un exchange réussi, Supabase place la session dans les cookies.
   * On récupère donc l’utilisateur immédiatement derrière.
   * ────────────────────────────────────────────────────────────────────────────────
   */
  const { data, error: getUserError } = await supabase.auth.getUser();

  if (getUserError || !data.user) {
    return NextResponse.redirect(`${url.origin}/auth/error`);
  }

  const user = data.user;

  /**
   * ────────────────────────────────────────────────────────────────────────────────
   * 3. CAS PARTICULIER : LOGIN VIA DISCORD / GITHUB / GOOGLE (OAUTH PROVIDERS)
   * ────────────────────────────────────────────────────────────────────────────────
   * Le paramètre `provider` est présent uniquement en OAuth.
   *
   * Ici on peut mettre la redirection finale après un login via réseau social :
   * - `/admin`      si accès direct admin
   * - `/dashboard`  si espace perso
   * - `/`           pour retour home
   *
   * Pour Studio DR, la logique standard : les admins validés vont dans /admin,
   * les autres retournent sur /login en attendant is_approved=true.
   * ────────────────────────────────────────────────────────────────────────────────
   */
  if (provider) {
    // Si l’admin a validé le compte → espace admin
    if (user.user_metadata?.is_approved) {
      return NextResponse.redirect(`${url.origin}/admin`);
    }

    // Sinon → retour login (compte en attente)
    return NextResponse.redirect(`${url.origin}/login`);
  }

  /**
   * ────────────────────────────────────────────────────────────────────────────────
   * 4. CAS EMAIL PASSWORD / MAGIC LINK
   * ────────────────────────────────────────────────────────────────────────────────
   * Si l'email est confirmé → page dédiée
   * Sinon → retour login
   * ────────────────────────────────────────────────────────────────────────────────
   */
  if (user.email_confirmed_at) {
    return NextResponse.redirect(`${url.origin}/email-confirmed`);
  }

  // Par défaut → login
  return NextResponse.redirect(`${url.origin}/login`);
}

/**
 * ────────────────────────────────────────────────────────────────────────────────
 * Composant affiché uniquement le temps de la validation sur /auth/callback
 * ────────────────────────────────────────────────────────────────────────────────
 *
 * ⚠️ Un route handler (route.ts) ne peut PAS contenir de JSX.
 *     On retourne donc une simple réponse texte côté serveur.
 *     Si tu veux un vrai composant React, on le place dans /app/auth/callback/loading/page.tsx
 */
export function POST() {
  return NextResponse.json({
    message: "Validation en cours...",
  });
}
