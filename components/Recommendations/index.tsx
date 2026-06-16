import type { RecommendationItem } from "@/types/dashboard";

interface RecommendationsProps {
  items: RecommendationItem[];
}

const PRIORITY_STYLES: Record<RecommendationItem["priority"], string> = {
  high: "bg-red-50 text-red-600",
  medium: "bg-amber-50 text-amber-600",
  low: "bg-gray-100 text-gray-500",
};

const PRIORITY_LABELS: Record<RecommendationItem["priority"], string> = {
  high: "Priorité haute",
  medium: "Priorité moyenne",
  low: "Priorité basse",
};

export default function Recommendations({ items }: RecommendationsProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-gray-100">
        <p className="text-sm text-gray-400">
          Aucune recommandation pour le moment, votre fiche est déjà bien optimisée.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-gray-100">
      <p className="mb-4 text-sm font-medium text-gray-900">Recommandations</p>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-gray-100 p-4">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${PRIORITY_STYLES[item.priority]}`}>
                {PRIORITY_LABELS[item.priority]}
              </span>
            </div>
            <p className="mb-2 text-sm text-gray-500">{item.description}</p>
            <p className="text-xs font-medium text-gray-400">{item.impact}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
