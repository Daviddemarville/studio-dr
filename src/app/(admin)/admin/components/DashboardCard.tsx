import type { LucideIcon } from "lucide-react";

export default function DashboardCard({
  icon: Icon,
  title,
  value,
  sub,
}: {
  icon: LucideIcon;
  title: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div
      className="
        bg-gray-800/60 backdrop-blur-sm border border-gray-700/40 
        p-5 rounded-xl shadow-xl 
        hover:shadow-2xl hover:border-blue-400/40
        transition-all duration-300
      "
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="
            p-2 rounded-lg 
            bg-[#3EA1FF]/20 
            border border-[#3EA1FF]/30
          "
        >
          <Icon size={22} className="text-[#3EA1FF]" />
        </div>
        <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
      </div>

      <p className="text-2xl font-bold text-white">{value}</p>

      {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
