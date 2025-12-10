"use client";

import Image from "next/image";
import type {
  PublicDBRow,
  PublicSection,
  PublicTemplate,
} from "@/types/public";

export default function QuiSommesNous({
  section,
  content,
}: {
  section: PublicSection;
  content: PublicDBRow[];
  template: PublicTemplate;
}) {
  return (
    <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">
          {section.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.map((user) => {
            const avatar = user.avatar_url as string | undefined;
            const pseudo = user.pseudo as string | undefined;
            const firstname = user.firstname as string | undefined;
            const lastname = user.lastname as string | undefined;
            const bioFr = user.bio_fr as string | undefined;
            const bioEn = user.bio_en as string | undefined;

            return (
              <div
                key={String(user.id)}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                {avatar && (
                  <div className="mb-6 flex justify-center">
                    <Image
                      src={avatar}
                      alt={String(pseudo || firstname || "Avatar")}
                      width={100}
                      height={100}
                      className="w-24 h-24 object-cover rounded-full"
                    />
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {pseudo || `${firstname ?? ""} ${lastname ?? ""}`.trim()}
                </h3>

                <p className="text-gray-600 leading-relaxed text-sm">
                  {bioFr ?? bioEn ?? ""}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
