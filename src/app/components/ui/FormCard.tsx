"use client";

import { ReactNode } from "react";

export default function FormCard({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <div
      className="
        max-w-md 
        mx-4 md:mx-auto
        mt-16 
        rounded-2xl 
        bg-[#1A1C21] 
        p-8 
        shadow-xl 
        border 
        border-[#24262B] 
        text-white
      "
    >
      <h2 className="text-2xl font-semibold mb-1">{title}</h2>

      {subtitle && (
        <p className="text-sm text-gray-400 mb-6">
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}
