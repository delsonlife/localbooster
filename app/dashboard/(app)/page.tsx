import { getDashboardProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { computeStats } from "@/lib/stats";
import DashboardStats from "@/components/DashboardStats";
import RatingChart from "@/components/RatingChart";

export default async function DashboardHomePage() {
  const profile = await getDashboardProfile();
  const supabase = await createClient();

  const { data: ratings } = await supabase
    .from("ratings")
    .select("rating, created_at")
    .eq("license_key", profile.license.license_key)
    .order("created_at", { ascending: true });

  const stats = computeStats(ratings ?? []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">Tableau de bord</h1>

      <DashboardStats
        total={stats.total}
        average={stats.average}
        negative={stats.negative}
      />

      <RatingChart data={stats.monthly} primaryColor={profile.license.primary_color} />
    </div>
  );
}
