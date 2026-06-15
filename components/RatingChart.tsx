"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyPoint } from "@/lib/stats";

interface RatingChartProps {
  data: MonthlyPoint[];
  primaryColor: string;
}

export default function RatingChart({ data, primaryColor }: RatingChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-gray-100">
        <p className="text-sm text-gray-400">
          Pas encore assez de données pour afficher l&apos;évolution.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-gray-100">
      <p className="mb-4 text-sm font-medium text-gray-900">
        Évolution mensuelle
      </p>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 5]}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            formatter={(value) => [`${value} / 5`, "Moyenne"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #f3f4f6" }}
          />
          <Line
            type="monotone"
            dataKey="average"
            stroke={primaryColor}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
