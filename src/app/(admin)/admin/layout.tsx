// src/app/(admin)/admin/layout.tsx

import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase-server";
import AdminNav from "./components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  // 1) Vérifier la session utilisateur
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signIn");
  }

  // 2) Vérifier si approuvé dans la table users
  const { data: userInfo, error } = await supabase
    .from("users")
    .select("is_approved")
    .eq("id", user.id)
    .single();

  if (error || !userInfo?.is_approved) {
    await supabase.auth.signOut();
    redirect("/auth/signIn");
  }

  // 3) Rendu normal si tout est OK
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      <AdminNav />

      {/* POINT 1 — FIX MOBILE OVERLAY */}
      <main
        className={`
          flex-1 p-6 
          transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]

          /* MOBILE: le contenu se décale de 80px quand la sidebar est fermée */
          ml-20

          /* DESKTOP: aucun décalage */
          md:ml-0
        `}
      >
        {children}
      </main>
    </div>
  );
}
