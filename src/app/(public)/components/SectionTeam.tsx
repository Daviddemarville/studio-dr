"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function SectionTeam() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const lang = "fr";

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = supabaseBrowser(); 

      const { data, error } = await supabase
        .from("users")
        .select("firstname, lastname, bio_fr, bio_en, avatar_url")
        .eq("is_public", true);

      if (!error) setTeam(data || []);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) return <SectionTeamSkeleton />;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        Qui sommes-nous ?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((u, i) => (
          <div
            key={i}
            className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
          >
            <img
              src={u.avatar_url ?? "/avatar.png"}
              alt={`${u.firstname} ${u.lastname}`}
              className="w-20 h-20 rounded-full mb-4 object-cover shadow"
            />

            <h3 className="font-semibold text-gray-900 text-lg">
              {u.firstname} {u.lastname}
            </h3>

            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {lang === "fr" ? u.bio_fr : u.bio_en}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Skeleton ---------------- */

export function SectionTeamSkeleton() {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        Qui sommes-nous ?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-4" />
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-2" />
            <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    </section>
  );
}
