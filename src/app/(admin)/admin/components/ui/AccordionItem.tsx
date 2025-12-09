"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { useAccordion } from "./Accordion";

export default function AccordionItem({
  id,
  title,
  children,
  defaultOpen = false,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const { openItems, toggleItem } = useAccordion();

  const isOpen = openItems.includes(id);

  // ouverture par défaut une seule fois
  // biome-ignore lint/correctness/useExhaustiveDependencies: <condition sur le montage>
  useEffect(() => {
    if (defaultOpen && !isOpen) toggleItem(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="
            bg-neutral-900 rounded-xl shadow-sm 
            md:rounded-none md:shadow-none
        "
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => toggleItem(id)}
        className="
                w-full flex items-center justify-between 
                px-3 py-3 md:px-4 md:py-4
                text-left hover:bg-neutral-800 transition-colors
            "
        aria-expanded={isOpen}
        aria-controls={`panel-${id}`}
      >
        <span className="font-semibold text-neutral-200">{title}</span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown className="text-neutral-400" />
        </motion.div>
      </button>

      {/* Panel animé */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`panel-${id}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-3 md:px-4 md:py-4 text-neutral-300">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
