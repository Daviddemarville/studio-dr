"use client";

import Image from "next/image";
import type {
  PublicDBRow,
  PublicSection,
  PublicTemplate,
} from "@/types/public";

interface CardsWithImageProps {
  section: PublicSection;
  content: PublicDBRow[];
  template: PublicTemplate;
  lang: "fr" | "en";
  getLocalizedValue: (
    obj: Record<string, unknown>,
    field: string,
    lang: "fr" | "en",
  ) => string;
}

export default function CardsWithImage({
  section,
  content,
  lang,
  getLocalizedValue,
}: CardsWithImageProps) {
  return (
    <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">
          {section.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.map((row) => {
            const data = (row.content ?? {}) as Record<string, unknown>;

            const image = data.image as string | undefined;
            const title = getLocalizedValue(data, "title", lang);
            const body = getLocalizedValue(data, "body", lang);

            return (
              <div
                key={String(row.id)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* IMAGE */}
                {image && (
                  <div className="relative w-full h-48">
                    <Image
                      src={image}
                      alt={title || "Illustration"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-6 text-center">
                  {title && (
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {title}
                    </h3>
                  )}

                  {body && (
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {body}
                    </p>
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
