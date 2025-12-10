"use client";

import Image from "next/image";
import type { PublicDBRow, PublicRepeaterItem } from "@/types/public";

interface TestimonialsProps {
  section: {
    id: number;
    slug: string;
    title: string;
  };
  content: Array<PublicDBRow | PublicRepeaterItem>;
}

export default function Testimonials({ section, content }: TestimonialsProps) {
  return (
    <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          {section.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item: PublicDBRow | PublicRepeaterItem) => {
            // Charge depuis repeater ou depuis la ligne elle-même
            const c = (item.content as Record<string, unknown>) ?? item;

            const avatar = c.avatar as string | undefined;
            const author = c.author as string | undefined;
            const body = c.body as string | undefined;

            return (
              <div
                key={String(item.id)}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  {avatar && (
                    <Image
                      src={avatar}
                      alt={author ?? "Témoignage"}
                      width={50}
                      height={50}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}

                  <h3 className="text-lg font-semibold text-gray-900">
                    {author ?? ""}
                  </h3>
                </div>

                <p className="text-gray-700 leading-relaxed whitespace-pre-line italic">
                  {body ?? ""}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
