import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Code retourné par Supabase (email link OU OAuth)
  const code = url.searchParams.get("code");

  // Provider OAuth (discord, github, google…)
  const provider = url.searchParams.get("provider");

  // Type d'événement Supabase (signup, recovery, magiclink…)
  const type = url.searchParams.get("type");

  const supabase = await supabaseServer();

  /**
   * ────────────────────────────────────────────────────────────────────────────────
   * 1. EXCHANGE DU CODE → SESSION SUPABASE
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
   * 2. RÉCUPÉRATION UTILISATEUR AUTH
   * ────────────────────────────────────────────────────────────────────────────────
   */
  const { data, error: getUserError } = await supabase.auth.getUser();
  if (getUserError || !data.user) {
    return NextResponse.redirect(`${url.origin}/auth/error`);
  }

  const user = data.user;

  /**
   * ────────────────────────────────────────────────────────────────────────────────
   * 3. RESET PASSWORD (type = "recovery")
   * ────────────────────────────────────────────────────────────────────────────────
   */
  if (type === "recovery") {
    return NextResponse.redirect(`${url.origin}/reset-confirm`);
  }

  /**
   * ────────────────────────────────────────────────────────────────────────────────
   * 4. AUTHENTIFICATION VIA PROVIDER OAUTH
   * ────────────────────────────────────────────────────────────────────────────────
   */
  if (provider) {
    // Détection d'un nouvel utilisateur OAuth
    const isNewOAuthUser = user.created_at === user.last_sign_in_at;

    if (isNewOAuthUser) {
      /**
       * ────────────────────────────────────────────────────────────────────────────
       * 4.1 NOUVEL UTILISATEUR OAUTH → INSERT public.users
       * ────────────────────────────────────────────────────────────────────────────
       */

      // LOGGING utile en prod/debug
      console.log("OAuth NEW USER — provider =", provider);
      console.log("OAuth metadata =", user.user_metadata);

      const meta = user.user_metadata;

      // Champs récupérés depuis GitHub / Google / Discord
      const email = user.email;
      const firstname = meta.full_name ?? null;
      const lastname = meta.family_name ?? null; // Google only
      const pseudo = meta.preferred_username ?? null; // Optionnel
      const avatar = meta.avatar_url ?? null; // Avatar auto

      // Insertion identique à ton REGISTER
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
        console.error("Insert OAuth user error:", insertError);
        return NextResponse.redirect(`${url.origin}/auth/error`);
      }

      // Email admin : nouvel utilisateur OAuth
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
            <p>Avatar : ${avatar ? `<img src="${avatar}" width="48"/>` : "—"}</p>
            <p>Provider : ${provider}</p>
          `,
        });
      } catch (mailErr) {
        console.error("Erreur email admin:", mailErr);
      }

      // Redirection identique au register
      return NextResponse.redirect(`${url.origin}/email-confirmed`);
    }

    /**
     * ────────────────────────────────────────────────────────────────────────────
     * 4.2 UTILISATEUR OAUTH EXISTANT
     * ────────────────────────────────────────────────────────────────────────────
     */
    if (user.user_metadata?.is_approved) {
      return NextResponse.redirect(`${url.origin}/admin`);
    }

    return NextResponse.redirect(`${url.origin}/login`);
  }

  /**
   * ────────────────────────────────────────────────────────────────────────────────
   * 5. SIGNUP EMAIL / MAGIC LINK (SANS PROVIDER)
   * ────────────────────────────────────────────────────────────────────────────────
   */

  const isNewEmailUser = user.created_at === user.last_sign_in_at;

  if (isNewEmailUser) {
    return NextResponse.redirect(`${url.origin}/email-confirmed`);
  }

  if (user.user_metadata?.is_approved) {
    return NextResponse.redirect(`${url.origin}/admin`);
  }

  return NextResponse.redirect(`${url.origin}/login`);
}

/**
 * ────────────────────────────────────────────────────────────────────────────────
 * Fallback POST (non utilisé)
 * ────────────────────────────────────────────────────────────────────────────────
 */
export function POST() {
  return NextResponse.json({
    message: "Validation en cours...",
  });
}
