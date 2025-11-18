import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = await supabaseServer();
    const firstname = body.firstname?.trim();
    const lastname = body.lastname?.trim();
    const pseudo = body.pseudo?.trim() || null;
    const email = body.email?.trim();
    const password = body.password;
    
    // -----------------------------
    // VALIDATION MINIMALE
    // -----------------------------
    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires ne sont pas remplis." },
        { status: 400 }
      );
    }
    

    // ----------------------------------------------
    // 0) Vérification unicité du pseudo (si rempli)
    // ----------------------------------------------
    if (pseudo) {
      const { data: existingPseudo, error: pseudoError } = await supabase
        .from("users")
        .select("id")
        .eq("pseudo", pseudo)
        .maybeSingle();

      if (pseudoError) {
        console.error("Pseudo check error:", pseudoError);
        return NextResponse.json(
          { error: "Erreur lors de la vérification du pseudo." },
          { status: 500 }
        );
      }

      if (existingPseudo) {
        return NextResponse.json(
          { error: "Ce pseudo est déjà utilisé. Choisissez-en un autre." },
          { status: 400 }
        );
      }
    }

    // -----------------------------
    // 1) Inscription Auth (client public)
    // -----------------------------
    const { data: signupData, error: signupError } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstname,
            lastname,
            pseudo,
            is_approved: false,
          },
        },
      });

    if (signupError || !signupData.user) {
      return NextResponse.json(
        { error: signupError?.message ?? "Erreur lors de la création du compte." },
        { status: 400 }
      );
    }

    const userId = signupData.user.id;

    // -----------------------------
    // 2) Insérer dans table public.users (admin only)
    // -----------------------------
    const { error: insertError } = await supabase
      .from("users")
      .insert({
        id: userId,
        email,
        firstname,
        lastname,
        pseudo,
        is_approved: false,
      });

    if (insertError) {
      console.error("Insert users error:", insertError);
      return NextResponse.json(
        { error: "Erreur lors de l'insertion dans la base." },
        { status: 500 }
      );
    }

    // -----------------------------
    // 3) Notification admin
    // -----------------------------
    try {
      await resend.emails.send({
        from: "Studio DR <onboarding@resend.dev>",
        to: process.env.ADMIN_NOTIFY_EMAIL!,
        subject: "Nouvelle inscription — validation requise",
        html: `
          <h3>Nouvel utilisateur à valider</h3>
          <p>Email : <strong>${email}</strong></p>
          <p>Prénom : ${firstname}</p>
          <p>Nom : ${lastname}</p>
          <p>Pseudo : ${pseudo || "—"}</p>          
        `,
      });
    } catch (mailErr) {
      console.error("Erreur email admin:", mailErr);
    }

    return NextResponse.json({
      ok: true,
      message:
        "Compte créé ! Vérifiez vos emails. Votre accès doit être validé par un administrateur.",
    });

  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
