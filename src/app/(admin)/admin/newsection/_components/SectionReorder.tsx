"use client";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { SECTION_ICONS } from "@/lib/section-icons";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { useState } from "react";

type Section = {
    id: number;
    title: string;
    icon: string | null;
};

interface Props {
    sections: Section[];
    onReorder: (newIds: number[]) => void;
}

/* -------------------------------------------------------------------------- */
/*                            Carte sortable premium                           */
/* -------------------------------------------------------------------------- */
function SortableCard({ section }: { section: Section }) {
    const IconComponent =
        section.icon && SECTION_ICONS[section.icon]
            ? SECTION_ICONS[section.icon]
            : SECTION_ICONS["FileText"];

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
        isSorting,
    } = useSortable({ id: section.id });

    return (
        <motion.div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: isDragging ? 1.02 : 1,
                boxShadow: isDragging
                    ? "0 0 0 2px rgba(100, 149, 237, 0.35), 0 8px 24px rgba(0,0,0,0.45)"
                    : "0 1px 3px rgba(0,0,0,0.35)",
            }}
            transition={{
                type: "spring",
                stiffness: 350,
                damping: 28,
                mass: 0.4,
            }}
            className={`
        flex items-center justify-between
        w-full
        px-4 py-4
        rounded-lg
        border border-neutral-700
        bg-neutral-800
        text-neutral-200
        select-none
        cursor-grab
        transition-all
        ${!isDragging ? "hover:bg-neutral-700/60" : ""}
      `}
        >
            {/* Icône + titre */}
            <div className="flex items-center gap-3">
                <IconComponent className="w-5 h-5 text-neutral-300" />
                <span className="font-medium">{section.title}</span>
            </div>

            {/* Drag handle moderne */}
            <button
                {...attributes}
                {...listeners}
                className="p-1 text-neutral-500 hover:text-neutral-300 cursor-grab active:cursor-grabbing"
            >
                <GripVertical className="w-5 h-5" />
            </button>
        </motion.div>
    );
}

/* -------------------------------------------------------------------------- */
/*                            Composant principal                              */
/* -------------------------------------------------------------------------- */
export default function SectionReorder({ sections, onReorder }: Props) {
    const [items, setItems] = useState(sections);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    );

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const updated = arrayMove(items, oldIndex, newIndex);

        setItems(updated);
        onReorder(updated.map((s) => s.id));
    }

    return (
        <div className="space-y-3">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map((section) => (
                        <SortableCard key={section.id} section={section} />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
}
