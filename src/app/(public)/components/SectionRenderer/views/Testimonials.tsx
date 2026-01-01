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

export default function Testimonials({
  section,
  content,
  lang,
  getLocalizedValue,
}: ViewProps) {
  return (
    <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          {section.title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => {
            const c = item.content ?? {};

            const author = getLocalizedValue(c, "author", lang);
            const body = getLocalizedValue(c, "body", lang);
            const avatar = c.avatar as string | undefined;

            return (
              <div key={String(item.id)} className="bg-white p-6 rounded-lg">
                {avatar && (
                  <Image
                    src={avatar}
                    alt={author}
                    width={50}
                    height={50}
                    className="w-12 h-12 rounded-full mb-4"
                  />
                )}

                <p className="italic text-gray-700 mb-2">{body}</p>
                <p className="font-semibold text-gray-900">{author}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
