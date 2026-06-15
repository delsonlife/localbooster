export interface RatingPoint {
  rating: number;
  created_at: string;
}

export interface MonthlyPoint {
  month: string;
  average: number;
  count: number;
}

export interface DashboardStatsData {
  total: number;
  average: number;
  negative: number;
  monthly: MonthlyPoint[];
}

/**
 * Calcule les statistiques du dashboard à partir d'une liste de notes.
 * - total : nombre d'avis total
 * - average : note moyenne (sur 5)
 * - negative : nombre de notes <= 3 (ayant généré un feedback)
 * - monthly : moyenne et volume des 6 derniers mois
 */
export function computeStats(ratings: RatingPoint[]): DashboardStatsData {
  const total = ratings.length;
  const average =
    total > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  const negative = ratings.filter((r) => r.rating <= 3).length;

  const monthly = new Map<string, { sum: number; count: number }>();

  for (const r of ratings) {
    const date = new Date(r.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const entry = monthly.get(key) ?? { sum: 0, count: 0 };
    entry.sum += r.rating;
    entry.count += 1;
    monthly.set(key, entry);
  }

  const monthlyData: MonthlyPoint[] = Array.from(monthly.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, { sum, count }]) => ({
      month,
      average: Math.round((sum / count) * 10) / 10,
      count,
    }));

  return { total, average, negative, monthly: monthlyData };
}
