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

export default function FAQ({
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

        <div className="space-y-4 max-w-3xl mx-auto">
          {content.map((item) => {
            const c = item.content ?? {};

            const question = getLocalizedValue(c, "question", lang);
            const answer = getLocalizedValue(c, "answer", lang);

            return (
              <details
                key={String(item.id)}
                className="bg-white p-6 rounded-lg shadow-sm group"
              >
                <summary className="text-xl font-semibold cursor-pointer flex justify-between">
                  <span>{question}</span>
                  <span className="text-blue-600 group-open:rotate-180">▼</span>
                </summary>

                <p className="mt-4 text-gray-700 whitespace-pre-line">
                  {answer}
                </p>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
