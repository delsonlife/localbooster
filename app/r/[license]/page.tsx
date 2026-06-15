import { supabase } from "@/lib/supabase";
import ReviewWidget from "@/components/ReviewWidget";

interface PageProps {
  params: Promise<{ license: string }>;
}

export default async function ReviewPage({ params }: PageProps) {
  const { license } = await params;

  const { data, error } = await supabase
    .from("licenses")
    .select("company_name, google_review_url, primary_color, active")
    .eq("license_key", license)
    .single();

  if (error || !data || !data.active) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-white px-6">
        <p className="text-center text-sm text-gray-400">
          Ce lien n&apos;est plus valide.
        </p>
      </main>
    );
  }

  return (
    <ReviewWidget
      licenseKey={license}
      companyName={data.company_name}
      googleReviewUrl={data.google_review_url}
      primaryColor={data.primary_color || "#2563eb"}
    />
  );
}
