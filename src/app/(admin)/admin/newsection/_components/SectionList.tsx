"use client";

import SectionListItem from "./SectionListItem";

interface Section {
    id: number;
    title: string;
    slug: string;
    table_name: string;
    position: number;
}

export default function SectionList({
    sections,
    onDelete,
    onPositionUpdate,
}: {
    sections: Section[];
    onDelete: (id: number) => void;
    onPositionUpdate: (id: number, position: number) => void;
}) {
    return (
        <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
            <h2 className="text-xl font-semibold mb-4 text-white">
                Sections existantes
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-400">
                    <thead className="bg-neutral-800 text-neutral-200 uppercase">
                        <tr>
                            <th className="px-4 py-3">Position</th>
                            <th className="px-4 py-3">Titre</th>
                            <th className="px-4 py-3">Slug</th>
                            <th className="px-4 py-3">Table</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-800">
                        {sections.length > 0 ? (
                            sections.map((section) => (
                                <SectionListItem
                                    key={section.id}
                                    section={section}
                                    onDelete={onDelete}
                                    onPositionUpdate={onPositionUpdate}
                                />
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-8 text-center text-neutral-500"
                                >
                                    Aucune section trouvée.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
