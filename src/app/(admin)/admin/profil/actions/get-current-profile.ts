"use server";

import { createClient } from "@/lib/supabase-server";

export async function getCurrentUserProfile() {
    const supabase = await createClient();

    // 1) Récupération utilisateur auth
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
        console.error("Auth error:", authError);
        return null;
    }

    const authUser = authData.user;
    const authEmail = authUser.email ?? null;

    // 2) Récupération profil public
    const { data: publicProfile, error: publicError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

    if (publicError) {
        console.error("Erreur chargement profil public:", publicError);
        return {
            authEmail,
            publicProfile: null,
        };
    }

    return {
        authEmail,
        publicProfile,
    };
}
