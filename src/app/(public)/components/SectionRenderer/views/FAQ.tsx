"use client";

import type { PublicDBRow, PublicRepeaterItem } from "@/types/public";

interface FAQProps {
  section: {
    id: number;
    slug: string;
    title: string;
  };
  content: Array<PublicDBRow | PublicRepeaterItem>;
}

export default function FAQ({ section, content }: FAQProps) {
  return (
    <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          {section.title}
        </h2>

        <div className="space-y-4 max-w-3xl mx-auto">
          {content.map((item: PublicDBRow | PublicRepeaterItem) => {
            const c = (item.content as Record<string, unknown>) ?? item;

            const question = c.question as string | undefined;
            const answer = c.answer as string | undefined;

            return (
              <details
                key={String(item.id)}
                className="bg-white p-6 rounded-lg shadow-sm group"
              >
                <summary className="text-xl font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{question ?? ""}</span>
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>

                <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
                  {answer ?? ""}
                </p>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
