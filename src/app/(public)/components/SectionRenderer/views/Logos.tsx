"use client";

import Image from "next/image";

import type {
  PublicDBRow,
  PublicSection,
  PublicTemplate,
} from "@/types/public";

interface ViewProps {
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

export default function Logos({ section, content }: ViewProps) {
  return (
    <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          {section.title}
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {content.map((item) => {
            const c = item.content ?? {};

            const logo = c.logo as string | undefined;
            const name = c.name as string | undefined;

            if (!logo) return null;

            return (
              <Image
                key={String(item.id)}
                src={logo}
                alt={name ?? "Logo partenaire"}
                width={150}
                height={80}
                className="h-20 w-auto object-contain grayscale hover:grayscale-0"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
