import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("id");
    const action = url.searchParams.get("action");

    // 1️⃣ Vérification des paramètres
    if (!userId || !action) {
      return new Response(
        `
        <html><body style="font-family: sans-serif;">
          <h2>Paramètres manquants ❌</h2>
          <p>Les paramètres requis sont : id, action.</p>
        </body></html>
        `,
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return new Response(
        `
        <html><body style="font-family: sans-serif;">
          <h2>Action invalide ❌</h2>
          <p>Action autorisées : approve | reject</p>
        </body></html>
        `,
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }

    const isApproved = action === "approve";

    // 2️⃣ Vérifier si l’utilisateur existe
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("id, email, is_approved")
      .eq("id", userId)
      .single();

    if (fetchError || !existingUser) {
      return new Response(
        `
        <html><body style="font-family: sans-serif;">
          <h2>Utilisateur introuvable ❌</h2>
          <p>ID fourni : ${userId}</p>
        </body></html>
        `,
        { status: 404, headers: { "Content-Type": "text/html" } }
      );
    }

    // 3️⃣ Mise à jour si changement nécessaire
    if (existingUser.is_approved === isApproved) {
      return new Response(
        `
        <html><body style="font-family: sans-serif;">
          <h2>Aucun changement</h2>
          <p>L'utilisateur <strong>${existingUser.email}</strong> était déjà dans cet état.</p>
        </body></html>
        `,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ is_approved: isApproved })
      .eq("id", userId);

    if (updateError) {
      return new Response(
        `
        <html><body style="font-family: sans-serif;">
          <h2>Erreur lors de la mise à jour ❌</h2>
          <p>${updateError.message}</p>
        </body></html>
        `,
        { status: 500, headers: { "Content-Type": "text/html" } }
      );
    }

    // 4️⃣ Page de confirmation
    const statusText = isApproved ? "Compte validé ✔" : "Compte refusé ❌";
    const detailText = isApproved
      ? "L'utilisateur peut maintenant se connecter."
      : "L'utilisateur a été refusé et n’aura pas accès.";

    return new Response(
      `
      <html>
        <body style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: #fafafa;
          text-align: center;
        ">
          <h2>${statusText}</h2>
          <p style="margin-top: 10px;">${detailText}</p>

          <p style="color: #888; margin-top: 20px;">
            Utilisateur : <strong>${existingUser.email}</strong>
          </p>

          <a href="https://studiodr.dev" style="
            display: inline-block;
            margin-top: 30px;
            padding: 10px 20px;
            background: #4f46e5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          ">
            Retour au site
          </a>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (e: any) {
    return new Response(
      `
      <html><body style="font-family: sans-serif;">
        <h2>Erreur serveur ❌</h2>
        <p>${e.message}</p>
      </body></html>
      `,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}
