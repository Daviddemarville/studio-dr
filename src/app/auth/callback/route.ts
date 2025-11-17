// ============================================================================
// AUTH CALLBACK — UNIQUE ENDPOINT POUR TOUS LES FLUX SUPABASE
// ============================================================================
//
// SOMMAIRE
// --------
// 1) Récupération des paramètres (code, provider, type, next)
// 2) Exchange du code OAuth/Email → session Supabase (PKCE)
// 3) Récupération du user Supabase
// 4) RESET PASSWORD ............................ type = "recovery"
// 5) AUTH PROVIDERS (OAuth) .................... Discord, GitHub, Google
//      5.1 Nouvel utilisateur OAuth → INSERT + email admin
//      5.2 Utilisateur OAuth existant → redirections
// 6) SIGNUP EMAIL / MAGIC LINK
// 7) Redirections finales (admin, login)
// ============================================================================

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";

export async function GET(request: Request) {
  const url = new URL(request.url);

  // ────────────────────────────────────────────────────────────────
  // 1. PARAMÈTRES FOURNIS PAR SUPABASE
  // ────────────────────────────────────────────────────────────────
  const code = url.searchParams.get("code");         // Code PKCE OAuth / Email
  const provider = url.searchParams.get("provider"); // Provider OAuth (github, discord, google)
  const type = url.searchParams.get("type");         // Type d’événement (recovery, magiclink, email_change, etc.)
  let next = url.searchParams.get("next") ?? "/";    // Pour une future utilisation
  if (!next.startsWith("/")) next = "/";

  const supabase = await supabaseServer();

  // ────────────────────────────────────────────────────────────────
  // 2. EXCHANGE DU CODE → SESSION SUPABASE
  // ────────────────────────────────────────────────────────────────
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("❌ Erreur exchangeCodeForSession:", exchangeError);
      return NextResponse.redirect(`${url.origin}/auth/error`);
    }
  }

  // ────────────────────────────────────────────────────────────────
  // 3. RÉCUPÉRATION DU USER AUTH SUPABASE
  // ────────────────────────────────────────────────────────────────
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    console.error("❌ Impossible de récupérer le user:", userError);
    return NextResponse.redirect(`${url.origin}/auth/error`);
  }

  const user = data.user;

  // ────────────────────────────────────────────────────────────────
  // 4. RESET PASSWORD (type = "recovery")
  // ────────────────────────────────────────────────────────────────
  if (type === "recovery") {
    return NextResponse.redirect(`${url.origin}/reset-confirm`);
  }

  // ────────────────────────────────────────────────────────────────
  // 5. CONNEXION VIA OAUTH (Discord, GitHub, Google)
  // ────────────────────────────────────────────────────────────────
  if (provider) {
    const isNewOAuthUser = user.created_at === user.last_sign_in_at;

    // ------------------------------------------------------------------
    // 5.1 NOUVEL UTILISATEUR OAUTH → INSERT public.users
    // ------------------------------------------------------------------
    if (isNewOAuthUser) {
      console.log("🆕 Nouveau user OAuth:", provider, user.user_metadata);

      const meta = user.user_metadata;

      const email = user.email;
      const firstname = meta.full_name ?? null;
      const lastname = meta.family_name ?? null; // Google
      const pseudo = meta.preferred_username ?? null;
      const avatar = meta.avatar_url ?? null;

      const { error: insertError } = await supabaseAdmin
        .from("users")
        .insert({
          id: user.id,
          email,
          firstname,
          lastname,
          pseudo,
          avatar,
          is_approved: false,
        });

      if (insertError) {
        console.error("❌ Insert OAuth user error:", insertError);
        return NextResponse.redirect(`${url.origin}/auth/error`);
      }

      // ---- Email admin ----
      try {
        await resend.emails.send({
          from: "Studio DR <onboarding@resend.dev>",
          to: process.env.ADMIN_NOTIFY_EMAIL!,
          subject: "Nouvelle inscription OAuth — validation requise",
          html: `
            <h3>Nouvel utilisateur (OAuth)</h3>
            <p>Email : <strong>${email}</strong></p>
            <p>Prénom : ${firstname || "—"}</p>
            <p>Nom : ${lastname || "—"}</p>
            <p>Pseudo : ${pseudo || "—"}</p>
            <p>Provider : ${provider}</p>
            ${avatar ? `<p><img src="${avatar}" width="48"/></p>` : ""}
          `,
        });
      } catch (mailErr) {
        console.error("❌ Erreur envoi mail admin:", mailErr);
      }

      return NextResponse.redirect(`${url.origin}/email-confirmed`);
    }

    // ------------------------------------------------------------------
    // 5.2 UTILISATEUR OAUTH EXISTANT
    // ------------------------------------------------------------------
    if (user.user_metadata?.is_approved) {
      return NextResponse.redirect(`${url.origin}/admin`);
    }

    return NextResponse.redirect(`${url.origin}/login`);
  }

  // ────────────────────────────────────────────────────────────────
  // 6. SIGNUP EMAIL / MAGIC LINK (pas provider)
  // ────────────────────────────────────────────────────────────────
  const isNewEmailUser = user.created_at === user.last_sign_in_at;

  if (isNewEmailUser) {
    return NextResponse.redirect(`${url.origin}/email-confirmed`);
  }

  // ────────────────────────────────────────────────────────────────
  // 7. REDIRECTIONS FINALES (login/admin)
  // ────────────────────────────────────────────────────────────────
  if (user.user_metadata?.is_approved) {
    return NextResponse.redirect(`${url.origin}/admin`);
  }

  return NextResponse.redirect(`${url.origin}/login`);
}

// ============================================================================
// POST — Fallback (peu utile ici)
// ============================================================================
export function POST() {
  return NextResponse.json({ message: "Validation en cours..." });
}
