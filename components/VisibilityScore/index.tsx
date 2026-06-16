import type { VisibilityScoreData } from "@/types/dashboard";

interface VisibilityScoreProps {
  data: VisibilityScoreData;
  primaryColor: string;
}

function scoreColor(score: number): string {
  if (score >= 70) return "#10b981";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

export default function VisibilityScore({ data, primaryColor }: VisibilityScoreProps) {
  const color = scoreColor(data.score);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (data.score / 100) * circumference;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-gray-100">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="relative flex-shrink-0">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="54" fill="none" stroke="#f3f4f6" strokeWidth="12" />
            <circle
              cx="70"
              cy="70"
              r="54"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 70 70)"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold text-gray-900">{data.score}</span>
            <span className="text-xs text-gray-400">/ 100</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="mb-1 text-sm font-medium text-gray-900">Score de visibilité</p>
          <p className="mb-4 text-sm text-gray-500">{data.insight}</p>

          <div className="flex flex-col gap-2.5">
            {data.breakdown.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-36 flex-shrink-0 text-xs text-gray-500">{item.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%`, backgroundColor: primaryColor }}
                  />
                </div>
                <span className="w-8 flex-shrink-0 text-right text-xs font-medium text-gray-700">
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
