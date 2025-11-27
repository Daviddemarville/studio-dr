"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import profileTemplate from "@/templates/sections/section_user_profile.json";
import renderDynamicField from "../section/renderDynamicField";

interface UserProfile {
  id?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  pseudo?: string;
  avatar_url?: string;
  bio_fr?: string;
  bio_en?: string;
  [key: string]: unknown;
}

export default function ProfileEditor() {
  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        const { data: info, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (!error) setProfile(info);
      }
      setLoading(false);
    };
    load();
  }, []);

  const save = async () => {
    const supabase = createClient();

    // Extract fields defined in the template
    const updates: Record<string, unknown> = {};
    profileTemplate.fields.forEach((field) => {
      if (profile[field.name] !== undefined) {
        updates[field.name] = profile[field.name];
      }
    });

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", profile.id);

    setMessage(error ? error.message : "Profil sauvegardé.");
  };

  if (loading) return <p className="text-neutral-400">Chargement...</p>;

  return (
    <div className="bg-neutral-900 p-6 rounded-lg flex flex-col gap-6">
      {profileTemplate.fields.map((field) => (
        <div key={field.name}>
          {renderDynamicField({
            field,
            value: profile[field.name],
            onChange: (newVal) =>
              setProfile({ ...profile, [field.name]: newVal }),
          })}
        </div>
      ))}

      <button
        type="button"
        onClick={save}
        className="bg-blue-600 mt-4 px-4 py-2 rounded text-white hover:bg-blue-500 self-start"
      >
        Sauvegarder
      </button>

      {message && <p className="mt-2 text-green-400">{message}</p>}
    </div>
  );
}
