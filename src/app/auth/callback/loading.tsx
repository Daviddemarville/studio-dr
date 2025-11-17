"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animation de progression (0 → 100 → 0 → 100…)
    const interval = setInterval(() => {
      setProgress((old) => (old >= 100 ? 0 : old + 2));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <h2 className="text-gray-800 text-lg font-medium mb-6">
        Validation en cours…
      </h2>

      <div className="w-full max-w-xs bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className="bg-blue-600 h-3 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-gray-500 text-sm mt-4">{progress}%</p>
    </div>
  );
}
