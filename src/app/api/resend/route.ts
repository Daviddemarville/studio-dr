import { createClient as createServerClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!RESEND_API_KEY) {
  console.error("manque le RESEND_API_KEY ");
}

if (!FROM_EMAIL) {
  console.error("manque le FROM_EMAIL");
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Variables Supabase manquantes");
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function POST(req: Request) {
  if (!resend || !FROM_EMAIL) {
    return NextResponse.json(
      { error: "Email service n'est pas configuré" },
      { status: 500 },
    );
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Configuration Supabase manquante" },
      { status: 500 },
    );
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "la requete body est invalide" },
        { status: 400 },
      );
    }

    const { id, email } = body as { id?: string; email?: string };

    // If we have an email, use it directly; otherwise fetch from database
    let userEmail = email;

    if (!userEmail && id) {
      // Use service role key to bypass RLS
      const supabase = createServerClient(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        },
      );

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("email")
        .eq("id", id)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: "utilisateur inconnue" },
          { status: 404 },
        );
      }

      userEmail = profile.email;
    }

    if (!userEmail) {
      return NextResponse.json({ error: "Email inconnue" }, { status: 400 });
    }

    // Send approval notification email
    const subject = "Votre compte a été créé et en attente d'approbation";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Bienvenue!</h1>
        <p>Votre compte a été créé avec succès.</p>
        <p>Votre demande est actuellement en attente d'approbation par l'administrateur. Nous vous notifierons dès que votre compte sera approuvé.</p>
        <br />
        <p>Cordialement,<br />L'équipe Studio DR</p>
      </div>
    `;

    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject,
      html,
    });

    if (response.error) {
      console.error("Resend error:", response.error);
      return NextResponse.json(
        { error: response.error.message || "Failed to send email" },
        { status: 500 },
      );
    }

    console.log("Email sent successfully to:", userEmail);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      id: response.data?.id,
    });
  } catch (err) {
    console.error("API error:", err);
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
