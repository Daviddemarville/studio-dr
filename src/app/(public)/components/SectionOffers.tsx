"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type {Offer} from "./../../../../types/public"
import type { language } from "./../../../../types/public";

export default function SectionOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const lang = "fr";

  useEffect(() => {
    const fetchOffers = async () => {
      const supabase = supabaseBrowser(); 

      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error) setOffers(data || []);
      setLoading(false);
    };

    fetchOffers();
  }, []);

  if (loading) return <SectionOffersSkeleton />;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Nos offres</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {lang === "fr" ? language.title_fr : language.title_en}
            </h3>

            <div className="h-1 w-12 bg-blue-500/60 rounded-full mb-4"></div>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {lang === "fr" ? language.long_fr : language.long_en}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------- Skeleton ----------- */

export function SectionOffersSkeleton() {
  return (
    <section className="mb-12 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/4 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="h-5 bg-gray-300 rounded w-2/3 mb-4" />
            <div className="h-3 bg-gray-300 rounded w-full mb-2" />
            <div className="h-3 bg-gray-300 rounded w-5/6 mb-2" />
            <div className="h-3 bg-gray-300 rounded w-4/6" />
          </div>
        ))}
      </div>
    </section>
  );
}
