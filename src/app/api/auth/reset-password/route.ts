// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/lib/supabase-server";

// export async function POST(req: Request) {
//   try {
//     const supabase = await supabaseServer();
//     const { email } = await req.json();

//     if (!email) {
//       return NextResponse.json(
//         { error: "Adresse email obligatoire." },
//         { status: 400 },
//       );
//     }

//     // Toujours renvoyer la même réponse pour éviter l'énumération d'emails
//     await supabase.auth.resetPasswordForEmail(email);

//     return NextResponse.json({
//       success: true,
//       message:
//         "Si un compte existe, un email de réinitialisation a été envoyé.",
//     });
//   } catch (e: any) {
//     return NextResponse.json(
//       { error: `Erreur serveur : ${e.message}` },
//       { status: 500 },
//     );
//   }
// }
