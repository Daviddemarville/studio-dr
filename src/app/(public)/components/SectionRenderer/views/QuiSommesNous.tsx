"use client";

import Image from "next/image";
import type {
  PublicDBRow,
  PublicSection,
  PublicTemplate,
} from "@/types/public";

interface QuiSommesNousProps {
  section: PublicSection;
  content: PublicDBRow[];
  template: PublicTemplate;
  lang: "fr" | "en";
}

export default function QuiSommesNous({
  section,
  content,
  lang,
}: QuiSommesNousProps) {
  if (!content.length) return null;

  return (
    <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">
          {section.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.map((user) => {
            const avatar =
              (user.avatar_url as string | undefined) || "/default-avatar.png";

            const displayName =
              (user.pseudo as string | undefined) ||
              `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim();

            const bio =
              lang === "fr"
                ? (user.bio_fr as string | undefined)
                : (user.bio_en as string | undefined);

            return (
              <article
                key={String(user.id)}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="mb-6 flex justify-center">
                  <Image
                    src={avatar}
                    alt={displayName || "Avatar"}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover rounded-full"
                  />
                </div>

                {displayName && (
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {displayName}
                  </h3>
                )}

                {bio && (
                  <p className="text-gray-600 leading-relaxed text-sm">{bio}</p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
