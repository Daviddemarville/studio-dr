"use client";

import Image from "next/image";
import { useState } from "react";
import type { TemplateType } from "@/types/public";

interface SectionRendererProps {
  section: {
    id: number;
    title: string;
    slug: string;
    template_slug: string | null;
    table_name: string;
  };
  content: Array<Record<string, unknown>>;
  template: TemplateType;
}

export default function SectionRenderer({
  section,
  content,
  template,
}: SectionRendererProps) {
  const [lang] = useState("fr");

  if (!template || !content || content.length === 0) {
    return null;
  }

  // Always returns a string
  const getLocalizedValue = (
    obj: Record<string, unknown>,
    fieldName: string,
  ): string => {
    const frField = `${fieldName}_fr`;
    const enField = `${fieldName}_en`;

    if (lang === "fr" && obj[frField]) return String(obj[frField]);
    if (obj[enField]) return String(obj[enField]);
    if (obj[frField]) return String(obj[frField]);
    return String(obj[fieldName] ?? "");
  };

  type TemplateField = {
    name?: string;
    label?: string;
    type?: string;
    [key: string]: unknown;
  };

  const repeaterField = template.fields?.find(
    (f: TemplateField) => f.type === "repeater",
  );

  if (repeaterField) {
    //
    // USERS (Qui sommes-nous)
    //
    if (section.table_name === "users") {
      return (
        <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-gray-900">
              {section.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.map((user) => (
                <div
                  key={user.id}
                  className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  {user.avatar_url && (
                    <div className="mb-6 flex justify-center">
                      <Image
                        src={user.avatar_url}
                        alt={String(user.pseudo || user.firstname || "Avatar")}
                        width={100}
                        height={100}
                        className="w-24 h-24 object-cover rounded-full"
                      />
                    </div>
                  )}

                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {String(
                      user.pseudo ||
                        `${user.firstname || ""} ${user.lastname || ""}`.trim(),
                    )}
                  </h3>

                  <p className="text-gray-600 leading-relaxed text-sm">
                    {lang === "fr" ? String(user.bio_fr) : String(user.bio_en)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    //
    // WORKFLOW STEPS
    //
    if (section.table_name === "content_workflow_steps") {
      return (
        <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              {section.title}
            </h2>

            <div className="space-y-8">
              {content.map((step) => {
                const stepContent: Record<string, unknown> =
                  step.content || step;

                return (
                  <div key={step.id} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {String(step.step_number)}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-2 text-gray-900">
                        Étape {String(step.step_number)} :{" "}
                        {getLocalizedValue(stepContent, "step_title")}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {getLocalizedValue(stepContent, "body")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    //
    // FAQ
    //
    if (section.template_slug === "section_faq") {
      return (
        <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              {section.title}
            </h2>

            <div className="space-y-4 max-w-3xl mx-auto">
              {content.map((item) => {
                const itemContent: Record<string, unknown> =
                  item.content || item;

                return (
                  <details
                    key={item.id}
                    className="bg-white p-6 rounded-lg shadow-sm group"
                  >
                    <summary className="text-xl font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                      <span>{getLocalizedValue(itemContent, "question")}</span>
                      <span className="text-blue-600 group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
                      {getLocalizedValue(itemContent, "answer")}
                    </p>
                  </details>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    //
    // LOGOS / PARTENAIRES
    //
    if (section.template_slug === "section_logos_confiance") {
      return (
        <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
              {section.title}
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-8">
              {content.map((item) => {
                const itemContent: Record<string, unknown> =
                  item.content || item;

                return (
                  <div
                    key={item.id}
                    className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
                  >
                    {Boolean(itemContent.logo) && (
                      <Image
                        src={String(itemContent.logo)}
                        alt={String(itemContent.name ?? "Logo partenaire")}
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

    //
    // TESTIMONIALS
    //
    if (section.template_slug === "section_temoignages") {
      return (
        <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              {section.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item) => {
                const itemContent: Record<string, unknown> =
                  item.content || item;

                return (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {Boolean(itemContent.avatar) && (
                        <Image
                          src={String(itemContent.avatar)}
                          alt={getLocalizedValue(itemContent, "author")}
                          width={50}
                          height={50}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getLocalizedValue(itemContent, "author")}
                      </h3>
                    </div>

                    <p className="text-gray-700 leading-relaxed whitespace-pre-line italic">
                      {getLocalizedValue(itemContent, "body")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    //
    // STANDARD REPEATER
    //
    return (
      <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            {section.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => {
              const itemContent: Record<string, unknown> = item.content || item;

              return (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {getLocalizedValue(itemContent, "title")}
                  </h3>

                  {Boolean(
                    itemContent.subtitle_fr || itemContent.subtitle_en,
                  ) && (
                    <p className="text-sm text-gray-600 mb-2">
                      {getLocalizedValue(itemContent, "subtitle")}
                    </p>
                  )}

                  {item.price_ht != null && (
                    <p className="text-2xl font-bold text-blue-600 mb-3">
                      {String(item.price_ht)} € HT
                    </p>
                  )}

                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {getLocalizedValue(itemContent, "body")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  //
  // SIMPLE SECTION
  //
  const item = content[0];
  const itemContent: Record<string, unknown> = item?.content || item || {};

  return (
    <section id={section.slug} className="scroll-mt-24 py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          {section.title}
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
            {getLocalizedValue(itemContent, "body")}
          </p>
        </div>
      </div>
    </section>
  );
}
