"use client";

import { createContext, useContext, useState } from "react";

type AccordionContextType = {
    openItems: string[];
    toggleItem: (id: string) => void;
    type: "single" | "multiple";
};

const AccordionContext = createContext<AccordionContextType | null>(null);

export function useAccordion() {
    const ctx = useContext(AccordionContext);
    if (!ctx) throw new Error("AccordionItem must be used inside <Accordion />");
    return ctx;
}

export default function Accordion({
    children,
    type = "multiple",
}: {
    children: React.ReactNode;
    type?: "single" | "multiple";
}) {
    const [openItems, setOpenItems] = useState<string[]>([]);

    function toggleItem(id: string) {
        setOpenItems((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            } else {
                return type === "single" ? [id] : [...prev, id];
            }
        });
    }

    return (
        <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
            <div
                className="
                flex flex-col gap-3 
                md:gap-0 md:divide-y md:divide-neutral-800 
                md:border md:border-neutral-800 md:rounded-lg md:overflow-hidden
            "
            >
                {children}
            </div>
        </AccordionContext.Provider>
    );
}
