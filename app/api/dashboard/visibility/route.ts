import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getVisibilityIntelligence, VisibilityIntelligenceServiceError } from "@/lib/dashboard-service";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("license_key")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }

  const { data: license, error: licenseError } = await supabase
    .from("licenses")
    .select("company_name, google_review_url")
    .eq("license_key", profile.license_key)
    .single();

  if (licenseError || !license) {
    return NextResponse.json({ error: "Licence introuvable" }, { status: 404 });
  }

  const forceRefresh = request.nextUrl.searchParams.get("refresh") === "1";

  try {
    const data = await getVisibilityIntelligence(
      profile.license_key,
      license.company_name,
      license.google_review_url,
      { forceRefresh }
    );
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof VisibilityIntelligenceServiceError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { error: { code: "UNKNOWN", message: "Une erreur inattendue est survenue." } },
      { status: 500 }
    );
  }
}
