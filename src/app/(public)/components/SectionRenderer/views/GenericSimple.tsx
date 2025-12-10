"use client";

import type { PublicTemplate } from "@/types/public";

interface GenericSimpleProps {
  section: {
    id: number;
    title: string;
    slug: string;
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

export default function GenericSimple({
  section,
  content,
  lang,
  getLocalizedValue,
}: GenericSimpleProps) {
  const item = content[0];
  const itemContent = (item?.content as Record<string, unknown>) ?? item ?? {};

  const body = getLocalizedValue(itemContent, "body", lang);

  return (
    <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          {section.title}
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}
