interface DashboardStatsProps {
  total: number;
  average: number;
  negative: number;
}

export default function DashboardStats({
  total,
  average,
  negative,
}: DashboardStatsProps) {
  const cards = [
    {
      label: "Avis totaux",
      value: total.toString(),
      description: "Nombre total d'avis reçus",
    },
    {
      label: "Satisfaction moyenne",
      value: total > 0 ? `${average.toFixed(1)}` : "—",
      subtext: total > 0 ? "/ 5" : "",
      description: "Moyenne des notes sur 5",
    },
    {
      label: "Feedbacks négatifs",
      value: negative.toString(),
      description: "Avis négatifs filtrés (1-3 étoiles)",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group rounded-3xl border border-[#eef2f8] bg-white p-6 md:p-8 transition-all duration-200 hover:shadow-lg hover:shadow-[#0c1628]/5"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-[#8d96a8]">
            {card.label}
          </p>
          <div className="mt-3 flex items-end gap-1">
            <p className="text-3xl md:text-4xl font-semibold text-[#0c1628] tracking-tight">
              {card.value}
            </p>
            {card.subtext && (
              <p className="text-sm font-medium text-[#8d96a8] pb-0.5">
                {card.subtext}
              </p>
            )}
          </div>
          <p className="mt-2 text-sm text-[#5a6478]">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}
