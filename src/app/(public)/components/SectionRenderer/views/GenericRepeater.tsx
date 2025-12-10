"use client";

import type { PublicTemplate } from "@/types/public";

interface GenericRepeaterProps {
  section: {
    id: number;
    title: string;
    slug: string;
    table_name: string;
  };
  content: Array<Record<string, unknown>>;
  template: PublicTemplate;
  lang: "fr" | "en";
  getLocalizedValue: (
    obj: Record<string, unknown>,
    field: string,
    lang: "fr" | "en",
  ) => string;
}

export default function GenericRepeater({
  section,
  content,
  lang,
  getLocalizedValue,
}: GenericRepeaterProps) {
  return (
    <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          {section.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => {
            const itemContent =
              (item.content as Record<string, unknown>) ?? item;

            const title = getLocalizedValue(itemContent, "title", lang);
            const subtitle = getLocalizedValue(itemContent, "subtitle", lang);
            const body = getLocalizedValue(itemContent, "body", lang);
            const price = item.price_ht as number | string | undefined;

            return (
              <div
                key={String(item.id)}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                {title && (
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {title}
                  </h3>
                )}

                {subtitle && (
                  <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
                )}

                {price != null && (
                  <p className="text-2xl font-bold text-blue-600 mb-3">
                    {String(price)} € HT
                  </p>
                )}

                {body && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {body}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
