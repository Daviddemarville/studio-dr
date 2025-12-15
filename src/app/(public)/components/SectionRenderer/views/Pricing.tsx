"use client";

import type { PublicDBRow, PublicSection } from "@/types/public";

interface PricingProps {
  section: PublicSection;
  content: PublicDBRow[];
  lang: "fr" | "en";
  getLocalizedValue: (
    obj: Record<string, unknown>,
    field: string,
    lang: "fr" | "en",
  ) => string;
}

export default function Pricing({
  section,
  content,
  lang,
  getLocalizedValue,
}: PricingProps) {
  return (
    <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">
          {section.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.map((row) => {
            const data = row.content ?? {};

            const title = getLocalizedValue(data, "title", lang);
            const subtitle = getLocalizedValue(data, "subtitle", lang);
            const body = getLocalizedValue(data, "body", lang);

            const priceHT = row.price_ht as number | undefined;
            const priceTTC = row.price_ttc as number | undefined;
            const tvaRate = row.tva_rate as number | undefined;

            return (
              <div
                key={String(row.id)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col"
              >
                <h3 className="text-xl font-semibold mb-1 text-gray-900">
                  {title}
                </h3>

                {subtitle && (
                  <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
                )}

                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  {body}
                </p>

                <div className="mt-auto">
                  {priceHT !== undefined && (
                    <div className="text-3xl font-bold text-gray-900">
                      {priceHT} € HT
                    </div>
                  )}

                  {priceTTC !== undefined && tvaRate !== undefined && (
                    <div className="text-sm text-gray-500 mt-1">
                      {priceTTC} € TTC (TVA {tvaRate}%)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
