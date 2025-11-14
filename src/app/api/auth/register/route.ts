import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();
    const { email, password, firstname, lastname } = await req.json();

    // --- Vérification basique ---
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe obligatoires." },
        { status: 400 }
      );
    }

    // format email minimal
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit faire au moins 6 caractères." },
        { status: 400 }
      );
    }

    // --- Création dans Auth ---
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstname: firstname ?? "",
          lastname: lastname ?? "",
        },
      },
    });

    // ⚠️ Ne pas révéler la raison exacte
    if (authError) {
      return NextResponse.json(
        {
          error:
            "Impossible de créer le compte. Si l'adresse est déjà utilisée, vérifiez vos emails.",
        },
        { status: 400 }
      );
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Erreur inattendue lors de la création du compte." },
        { status: 500 }
      );
    }

    // --- Insertion table users ---
    const { error: dbError } = await supabase.from("users").insert({
      id: userId,
      email,
      firstname,
      lastname,
      is_approved: false,
      role: "developer",
    });

    if (dbError) {
      // rollback : supprimer le user Auth
      await supabase.auth.admin.deleteUser(userId);

      return NextResponse.json(
        { error: "Erreur interne. Veuillez réessayer plus tard." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Compte créé. Vérifiez vos emails pour confirmer puis attendre la validation.",
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Erreur serveur : " + e.message },
      { status: 500 }
    );
  }
}
