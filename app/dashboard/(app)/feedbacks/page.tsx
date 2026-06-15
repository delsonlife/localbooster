import { getDashboardProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import RecentFeedbacks from "@/components/RecentFeedbacks";
import RatingFilter from "@/components/RatingFilter";

interface FeedbacksPageProps {
  searchParams: Promise<{ rating?: string }>;
}

export default async function FeedbacksPage({ searchParams }: FeedbacksPageProps) {
  const { rating } = await searchParams;
  const profile = await getDashboardProfile();
  const supabase = await createClient();

  let query = supabase
    .from("feedbacks")
    .select("id, rating, title, comment, created_at")
    .eq("license_key", profile.license.license_key)
    .order("created_at", { ascending: false })
    .limit(100);

  if (rating && ["1", "2", "3"].includes(rating)) {
    query = query.eq("rating", Number(rating));
  }

  const { data: feedbacks } = await query;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">Feedbacks</h1>

      <RatingFilter
        basePath="/dashboard/feedbacks"
        current={rating}
        options={[3, 2, 1]}
      />

      <RecentFeedbacks feedbacks={feedbacks ?? []} />

      <p className="text-xs text-gray-400">
        Les 100 feedbacks les plus récents sont affichés.
      </p>
    </div>
  );
}
