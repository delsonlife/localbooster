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
    <div className="flex flex-col gap-8 md:gap-10">
      {/* En-tête avec titre et sous-titre */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#0c1628] tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-sm md:text-base text-[#5a6478]">
          Suivez vos avis clients et votre réputation locale en temps réel.
        </p>
      </div>

      {/* Statistiques */}
      <div>
        <DashboardStats
          total={stats.total}
          average={stats.average}
          negative={stats.negative}
        />
      </div>

      {/* Graphique */}
      <div>
        <RatingChart data={stats.monthly} primaryColor={profile.license.primary_color} />
      </div>
    </div>
  );
}
