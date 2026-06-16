import type { CompetitorComparisonData } from "@/types/dashboard";

interface CompetitorComparisonProps {
  data: CompetitorComparisonData;
}

export default function CompetitorComparison({ data }: CompetitorComparisonProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900">Concurrents locaux</p>
        <span className="text-xs text-gray-400">Rayon {data.searchRadiusKm} km</span>
      </div>

      {data.competitors.length === 0 ? (
        <p className="text-sm text-gray-400">Aucun concurrent identifié dans votre zone.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400">
                <th className="pb-2 font-medium">#</th>
                <th className="pb-2 font-medium">Établissement</th>
                <th className="pb-2 font-medium text-right">Note</th>
                <th className="pb-2 font-medium text-right">Avis</th>
                <th className="pb-2 font-medium text-right">Distance</th>
              </tr>
            </thead>
            <tbody>
              {data.competitors.map((competitor, index) => (
                <tr
                  key={competitor.placeId}
                  className={`border-t border-gray-50 ${competitor.isCurrentBusiness ? "bg-blue-50/50" : ""}`}
                >
                  <td className="py-2.5 text-gray-400">{index + 1}</td>
                  <td className="py-2.5">
                    <span className={competitor.isCurrentBusiness ? "font-semibold text-gray-900" : "text-gray-700"}>
                      {competitor.name}
                    </span>
                    {competitor.isCurrentBusiness && (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                        Vous
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-right text-gray-700">
                    {competitor.rating ? competitor.rating.toFixed(1) : "—"}
                  </td>
                  <td className="py-2.5 text-right text-gray-700">{competitor.reviewCount}</td>
                  <td className="py-2.5 text-right text-gray-400">{competitor.distanceKm} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.currentBusinessRank && (
        <p className="mt-4 text-xs text-gray-400">
          Vous êtes classé {data.currentBusinessRank}ᵉ sur {data.totalFound} établissements similaires trouvés.
        </p>
      )}
    </div>
  );
}
