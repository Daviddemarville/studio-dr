"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function SectionWork() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const lang = "fr"; // TODO: dynamique plus tard

  useEffect(() => {
    const fetchData = async () => {
      const supabase = supabaseBrowser(); // ← CORRECTION

      const { data, error } = await supabase
        .from("content_sections")
        .select("*")
        .eq("slug", "notre-travail")
        .single();

      if (!error) {
        setData(data);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <SectionWorkSkeleton />;

  if (!data) {
    return (
      <section className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
        Impossible de charger la section.
      </section>
    );
  }

  return (
    <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-3 text-gray-900">
        {lang === "fr" ? data.title_fr : data.title_en}
      </h2>

      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {lang === "fr" ? data.body_fr : data.body_en}
      </p>
    </section>
  );
}

/* ---------------- Skeleton ---------------- */

export function SectionWorkSkeleton() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-4" />
      <div className="h-4 bg-gray-300 rounded w-full mb-2" />
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-2/3" />
    </div>
  );
}
