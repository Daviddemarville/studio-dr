"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type {Offer} from "./../../../../types/public"

export default function SectionPricing() {
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

  if (loading) return <SectionPricingSkeleton />;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Nos tarifs</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {lang === "fr" ? offer.title_fr : offer.title_en}
            </h3>

            <div className="h-1 w-10 bg-blue-500/70 rounded-full mt-2 mb-4"></div>

            <p className="text-gray-600 leading-relaxed flex-1">
              {lang === "fr" ? offer.short_fr : offer.short_en}
            </p>

            <div className="mt-6 pt-4 border-t text-right">
              <span className="text-xl font-bold text-gray-900">
                {offer.price_ht} €
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Skeleton ---------------- */

export function SectionPricingSkeleton() {
  return (
    <section className="mb-12 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/4 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="h-5 bg-gray-300 rounded w-2/3 mb-4" />
            <div className="h-3 bg-gray-300 rounded w-5/6 mb-3" />
            <div className="h-3 bg-gray-300 rounded w-3/4 mb-6" />

            <div className="border-t pt-4 mt-4">
              <div className="h-6 bg-gray-400 rounded w-1/3 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
