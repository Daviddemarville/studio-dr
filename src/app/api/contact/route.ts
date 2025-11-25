import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseServer } from "@/lib/supabase-server";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstname, lastname, email, subject, message, token } = body;

    // 1 — Vérification champs
    if (!email || !subject || !message || !token) {
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
    }

    // 2 — Vérification CAPTCHA
    const captchaRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      },
    );

    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      return NextResponse.json(
        {
          error: "Captcha invalide.",
          details: captchaData["error-codes"] ?? null,
        },
        { status: 400 },
      );
    }

    const supabase = await supabaseServer();

    // 3 — Insert en BDD
    const { error: insertError } = await supabase
      .from("contact_messages")
      .insert([{ firstname, lastname, email, subject, message }]);

    if (insertError) {
      return NextResponse.json(
        { error: "Erreur lors de l’enregistrement." },
        { status: 500 },
      );
    }

    // 4 — Récup mails équipe
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("email")
      .eq("is_public", true);

    if (usersError) {
      return NextResponse.json(
        { error: "Erreur récupération emails équipe." },
        { status: 500 },
      );
    }

    const _recipients = users?.map((u: { email: string }) => u.email) ?? [];

    // 5 — Envoi email (test-mode → un seul destinataire)
    await resend.emails.send({
      from: "Studio DR <onboarding@resend.dev>",
      to: email, // en prod: [...recipients, email]
      subject: `[Studio DR] Nouveau message : ${subject}`,
      html: `
        <p><strong>De :</strong> ${firstname ?? ""} ${lastname ?? ""}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Sujet :</strong> ${subject}</p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="font-size:12px;color:#888">Copie envoyée automatiquement.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: `Erreur serveur : ${e.message}` },
      { status: 500 },
    );
  }
}
