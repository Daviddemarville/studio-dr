import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const action = url.searchParams.get("action");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  if (!id || !action) {
    return new Response("Paramètres manquants", { status: 400 });
  }

  const isApproved = action === "approve";
  const { error } = await supabase
    .from("users")
    .update({ is_approved: isApproved })
    .eq("id", id);

  if (error) {
    return new Response("Erreur de mise à jour", { status: 500 });
  }

  return new Response(
    `<html><body style="font-family:sans-serif;text-align:center;padding-top:50px;">
      <h2>✅ Utilisateur ${isApproved ? "approuvé" : "refusé"} avec succès.</h2>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
});
