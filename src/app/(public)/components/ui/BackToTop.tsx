'use client';

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToTopFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
    type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="
        fixed bottom-6 right-6 z-50
        p-3 rounded-full shadow-lg
        bg-blue-600 text-white 
        hover:bg-blue-700 
        transition
      "
    >
      <ArrowUp size={20} />
    </button>
  );
}
