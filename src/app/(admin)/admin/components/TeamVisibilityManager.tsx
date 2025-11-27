"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createClient } from "@/lib/supabase-browser";

interface User {
  id: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  pseudo: string | null;
  avatar_url: string | null;
  bio_fr: string | null;
  bio_en: string | null;
  is_public: boolean;
  is_approved: boolean;
}

export default function TeamVisibilityManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Erreur lors du chargement des utilisateurs");
        console.error(error);
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    };

    loadUsers();
  }, []);

  const toggleVisibility = async (
    userId: string,
    currentVisibility: boolean,
  ) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .update({ is_public: !currentVisibility })
      .eq("id", userId);

    if (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    } else {
      toast.success(currentVisibility ? "Profil masqué" : "Profil affiché");
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, is_public: !currentVisibility } : u,
        ),
      );
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6">
        <p className="text-sm">
          💡 <strong>Gestion de l'équipe :</strong> Activez/désactivez la
          visibilité des profils sur la page publique "Qui sommes‑nous". Pour
          modifier votre propre profil, allez dans{" "}
          <a href="/admin/profil" className="underline font-semibold">
            Mon Profil
          </a>
          .
        </p>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun utilisateur approuvé
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${user.is_public ? "bg-white border-green-200" : "bg-gray-50 border-gray-300 opacity-60"}`}
            >
              {/* Avatar */}
              <div className="shrink-0">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.pseudo || user.firstname || "Avatar"}
                    width={60}
                    height={60}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
                    {(user.pseudo || user.firstname || "?")[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {user.pseudo ||
                    `${user.firstname || ""} ${user.lastname || ""}`.trim()}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                {user.bio_fr && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {user.bio_fr}
                  </p>
                )}
              </div>

              {/* Toggle */}
              <button
                type="button"
                onClick={() => toggleVisibility(user.id, user.is_public)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${user.is_public ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-400 text-white hover:bg-gray-500"}`}
              >
                {user.is_public ? "✓ Visible" : "✗ Masqué"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
