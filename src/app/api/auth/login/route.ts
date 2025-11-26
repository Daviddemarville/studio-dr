// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/lib/supabase-server";

// export async function POST(req: Request) {
//   try {
//     const supabase = await supabaseServer();

//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Identifiants invalides." }, // message neutre
//         { status: 400 },
//       );
//     }

//     // 1️⃣ Tentative de connexion
//     const { data: loginData, error: loginError } =
//       await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//     if (loginError || !loginData.user) {
//       return NextResponse.json(
//         { error: "Identifiants invalides." }, // message neutre
//         { status: 400 },
//       );
//     }

//     const userId = loginData.user.id;

//     // 2️⃣ Vérification dans la table users
//     const { data: userData, error: userError } = await supabase
//       .from("users")
//       .select("is_approved")
//       .eq("id", userId)
//       .single();

//     if (userError || !userData) {
//       return NextResponse.json(
//         { error: "Erreur interne. Réessayez plus tard." },
//         { status: 500 },
//       );
//     }

//     // 3️⃣ Compte non approuvé
//     if (!userData.is_approved) {
//       await supabase.auth.signOut();
//       return NextResponse.json(
//         { error: "Compte en attente de validation administrateur." },
//         { status: 403 },
//       );
//     }

//     // 4️⃣ OK : renvoyer les cookies de session
//     const response = NextResponse.json({ success: true });
//     const { data: sessionData } = await supabase.auth.getSession();

//     if (sessionData.session) {
//       response.cookies.set(
//         "sb-access-token",
//         sessionData.session.access_token,
//         { path: "/", httpOnly: true },
//       );
//       response.cookies.set(
//         "sb-refresh-token",
//         sessionData.session.refresh_token,
//         { path: "/", httpOnly: true },
//       );
//     }

//     return response;
//   } catch (e: any) {
//     return NextResponse.json(
//       { error: `Erreur serveur : ${e.message}` },
//       { status: 500 },
//     );
//   }
// }
