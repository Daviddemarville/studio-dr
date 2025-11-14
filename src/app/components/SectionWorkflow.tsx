"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function SectionWorkflow() {
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const lang = "fr";

  useEffect(() => {
    const fetchSteps = async () => {
      const supabase = supabaseBrowser(); // ← CORRECTION

      const { data, error } = await supabase
        .from("workflow_steps")
        .select("*")
        .eq("is_active", true)
        .order("step_number", { ascending: true });

      if (!error && data) {
        setSteps(data);
      }

      setLoading(false);
    };

    fetchSteps();
  }, []);

  if (loading) return <SectionWorkflowSkeleton />;

  if (!steps || steps.length === 0) {
    return (
      <section className="mb-12 bg-red-50 border border-red-200 p-4 rounded-xl text-red-700">
        Aucune étape trouvée.
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        Comment travaillons-nous ?
      </h2>

      <div className="space-y-6">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            {/* Étiquette Étape */}
            <div className="text-sm font-semibold text-blue-600 mb-1">
              Étape {step.step_number}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {lang === "fr" ? step.title_fr : step.title_en}
            </h3>

            {/* Ligne décorative */}
            <div className="h-1 w-10 bg-blue-500/60 rounded-full mb-4"></div>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {lang === "fr" ? step.text_fr : step.text_en}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Skeleton ---------------- */

export function SectionWorkflowSkeleton() {
  return (
    <section className="mb-12 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-6" />

      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="h-4 bg-gray-300 rounded w-20 mb-3" />
            <div className="h-5 bg-gray-300 rounded w-2/3 mb-2" />
            <div className="h-3 bg-gray-300 rounded w-full mb-2" />
            <div className="h-3 bg-gray-300 rounded w-4/6" />
          </div>
        ))}
      </div>
    </section>
  );
}
