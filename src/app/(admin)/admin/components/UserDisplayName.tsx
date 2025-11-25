import { supabaseServer } from "@/lib/supabase-server";

export default async function UserDisplayName() {
  const supabase = await supabaseServer();

  // Récupération du user (TS exige une protection même si layout le sécurise)
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    // Ne devrait jamais arriver grâce au layout, mais TS exige un fallback
    return "Utilisateur";
  }

  // Récup profil
  const { data: profile } = await supabase
    .from("users")
    .select("firstname, pseudo")
    .eq("id", user.id)
    .single();

  const firstName = profile?.firstname?.trim();
  const pseudo = profile?.pseudo?.trim();
  const emailName = user.email?.split("@")[0];

  const displayName = firstName || pseudo || emailName || "Utilisateur";

  return displayName;
}
