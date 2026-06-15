import { getDashboardProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import StarsDisplay from "@/components/StarsDisplay";
import RatingFilter from "@/components/RatingFilter";
import { formatDateTime } from "@/lib/format";

interface ReviewsPageProps {
  searchParams: Promise<{ rating?: string }>;
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const { rating } = await searchParams;
  const profile = await getDashboardProfile();
  const supabase = await createClient();

  let query = supabase
    .from("ratings")
    .select("id, rating, created_at")
    .eq("license_key", profile.license.license_key)
    .order("created_at", { ascending: false })
    .limit(100);

  if (rating && ["1", "2", "3", "4", "5"].includes(rating)) {
    query = query.eq("rating", Number(rating));
  }

  const { data: ratings } = await query;
  const list = ratings ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">Avis</h1>

      <RatingFilter
        basePath="/dashboard/reviews"
        current={rating}
        options={[5, 4, 3, 2, 1]}
      />

      <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-gray-100">
        {list.length === 0 ? (
          <p className="p-5 text-sm text-gray-400">
            Aucun avis pour le moment.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {list.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 px-5 py-3"
              >
                <StarsDisplay rating={item.rating} />
                <span className="text-sm text-gray-400">
                  {formatDateTime(item.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Les 100 avis les plus récents sont affichés.
      </p>
    </div>
  );
}
