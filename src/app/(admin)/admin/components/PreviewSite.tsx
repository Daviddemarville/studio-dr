"use client";

export default function PreviewSite() {
  return (
    <div
      className="
        bg-gray-800/60 border border-gray-700/40 rounded-xl 
        shadow-xl backdrop-blur-sm p-5
      "
    >
      <h3 className="text-lg font-semibold text-white mb-4">
        Aperçu du site
      </h3>

      <div className="relative rounded-lg overflow-hidden border border-gray-700/50">
        {/* IFRAME PREVIEW */}
        <iframe
          src="/"
          className="
            w-full h-[500px] 
            rounded-lg shadow-inner 
            bg-white
          "
          loading="lazy"
        />

        {/* OVERLAY Léger comme ton ancien code */}
        <div
          className="
            absolute inset-0 pointer-events-none 
            bg-linear-to-t from-gray-900/40 to-transparent
          "
        />
      </div>
    </div>
  );
}
