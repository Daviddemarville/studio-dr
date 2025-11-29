"use client";

interface Section {
    id: number;
    title: string;
    slug: string;
    table_name: string;
    position: number;
}

export default function SectionListItem({
    section,
    onDelete,
    onPositionUpdate,
}: {
    section: Section;
    onDelete: (id: number) => void;
    onPositionUpdate: (id: number, position: number) => void;
}) {
    return (
        <tr className="hover:bg-neutral-800/50">
            <td className="px-4 py-3">
                <input
                    type="number"
                    defaultValue={section.position}
                    onBlur={(e) =>
                        onPositionUpdate(
                            section.id,
                            parseInt(e.target.value, 10) || 0,
                        )
                    }
                    className="w-16 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-center"
                />
            </td>

            <td className="px-4 py-3 font-medium text-white">{section.title}</td>
            <td className="px-4 py-3">{section.slug}</td>
            <td className="px-4 py-3">{section.table_name}</td>

            <td className="px-4 py-3 text-right">
                <button
                    type="button"
                    onClick={() => onDelete(section.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                >
                    Supprimer
                </button>
            </td>
        </tr>
    );
}
