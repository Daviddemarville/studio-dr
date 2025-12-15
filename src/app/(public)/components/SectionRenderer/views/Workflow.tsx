"use client";

import type { PublicDBRow, PublicWorkflowStep } from "@/types/public";

interface WorkflowProps {
  section: {
    id: number;
    slug: string;
    title: string;
  };
  content: Array<PublicWorkflowStep | PublicDBRow>;
}

export default function Workflow({ section, content }: WorkflowProps) {
  return (
    <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          {section.title}
        </h2>

        <div className="space-y-8">
          {content.map((step: PublicWorkflowStep | PublicDBRow) => {
            // Compatibilité totale (Supabase + repeater)
            const stepNumber =
              (step.step_number as number | string | undefined) ??
              ((step.content as Record<string, unknown>)?.step_number as
                | number
                | string
                | undefined);

            const stepContent =
              (step.content as Record<string, unknown>) ?? step;

            const title = String(
              stepContent.step_title_fr ??
                stepContent.step_title_en ??
                stepContent.step_title ??
                "",
            );

            const body = String(
              stepContent.body_fr ??
                stepContent.body_en ??
                stepContent.body ??
                "",
            );

            return (
              <div key={String(step.id)} className="flex gap-6 items-start">
                <div className="shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {String(stepNumber ?? "")}
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2 text-gray-900">
                    Étape {String(stepNumber ?? "")} : {title}
                  </h3>

                  <p className="text-gray-700 leading-relaxed">{body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
