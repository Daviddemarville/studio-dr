"use client";

import Image from "next/image";
import type { PublicDBRow, PublicRepeaterItem } from "@/types/public";

interface LogosProps {
  section: {
    id: number;
    slug: string;
    title: string;
  };
  content: Array<PublicDBRow | PublicRepeaterItem>;
}

export default function Logos({ section, content }: LogosProps) {
  return (
    <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          {section.title}
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-8">
          {content.map((item: PublicDBRow | PublicRepeaterItem) => {
            // Support repeater ou simple ligne
            const c = (item.content as Record<string, unknown>) ?? item;

            const logo = c.logo as string | undefined;
            const name = c.name as string | undefined;

            return (
              <div
                key={String(item.id)}
                className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
              >
                {logo && (
                  <Image
                    src={logo}
                    alt={name ?? "Logo partenaire"}
                    width={150}
                    height={80}
                    className="h-20 w-auto object-contain"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
