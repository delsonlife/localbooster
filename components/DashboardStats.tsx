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
    { label: "Avis totaux", value: total.toString() },
    {
      label: "Satisfaction moyenne",
      value: total > 0 ? `${average.toFixed(1)} / 5` : "—",
    },
    { label: "Feedbacks négatifs", value: negative.toString() },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-gray-100"
        >
          <p className="text-sm text-gray-400">{card.label}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
