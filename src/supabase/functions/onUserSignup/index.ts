import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  try {
    const payload = await req.json();
    const { record } = payload;

    const userEmail = record.email;
    const fullName = `${record.raw_user_meta_data?.firstname ?? ""} ${record.raw_user_meta_data?.lastname ?? ""}`.trim();

    const adminEmail = "de.marville.david@gmail.com";
    const projectRef = "sgzjttqaxufoslwjtewo";

    const subject = "Nouvelle demande d'accès à Studio DR";
    const body = `
      <h3>Nouvelle demande d'accès :</h3>
      <ul>
        <li><b>Nom :</b> ${fullName || "(non fourni)"}</li>
        <li><b>Email :</b> ${userEmail}</li>
      </ul>
      <p>
        <a href="https://${projectRef}.functions.supabase.co/approve-user?id=${record.id}&action=approve">✅ Valider</a> |
        <a href="https://${projectRef}.functions.supabase.co/approve-user?id=${record.id}&action=reject">❌ Refuser</a>
      </p>
    `;

    const mailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Studio DR <no-reply@studiodr.dev>",
        to: [adminEmail],
        subject,
        html: body,
      }),
    });

    console.log("Email envoyé:", mailRes.status);
    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("Erreur:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
