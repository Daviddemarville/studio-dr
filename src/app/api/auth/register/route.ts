import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin"; // ← IMPORTANT
import { supabaseServer } from "@/lib/supabase-server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe obligatoires." },
        { status: 400 }
      );
    }

    // 1. Auth SIGNUP utilise le client ANON
    const supabase = await supabaseServer();

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError || !signupData.user) {
      return NextResponse.json(
        { error: signupError?.message ?? "Erreur inscription Auth" },
        { status: 400 }
      );
    }

    const userId = signupData.user.id;

    // 2. L'insertion dans public.users doit utiliser LE CLIENT ADMIN
    const { error: insertError } = await supabaseAdmin
      .from("users")
      .insert({
        id: userId,
        email,
        is_approved: false,
      });

    if (insertError) {
      console.error("Insert users error:", insertError);
      return NextResponse.json(
        { error: "Erreur insertion dans users" },
        { status: 500 }
      );
    }

    // 3. Notification admin
    try {
      await resend.emails.send({
        from: "Studio DR <onboarding@resend.dev>",
        to: process.env.ADMIN_NOTIFY_EMAIL!,
        subject: "Nouvelle inscription — validation requise",
        html: `
          <h3>Nouvel utilisateur à valider</h3>
          <p>Email : <strong>${email}</strong></p>
          <p>ID : ${userId}</p>
        `,
      });
    } catch (mailErr) {
      console.error("Erreur envoi mail admin:", mailErr);
    }

    return NextResponse.json({
      ok: true,
      message:
        "Compte créé. Vérifiez vos emails pour confirmer votre inscription. En attente de validation.",
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
