"use client";

export default function FilterBar({
    filter,
    setFilter,
}: {
    filter: "all" | "unread";
    setFilter: (v: "all" | "unread") => void;
}) {
    return (
        <div className="flex gap-4 mb-4">
            <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm transition ${filter === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
            >
                Tous
            </button>

            <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg text-sm transition ${filter === "unread"
                        ? "bg-blue-600 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
            >
                Non lus
            </button>
        </div>
    );
}
