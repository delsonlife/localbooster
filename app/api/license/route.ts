import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (!key) {
    return NextResponse.json(
      { error: "Paramètre 'key' manquant" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("licenses")
    .select("company_name, company_email, google_review_url, primary_color, active")
    .eq("license_key", key)
    .single();

  if (error || !data || !data.active) {
    return NextResponse.json(
      { error: "Licence introuvable ou inactive" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    company_name: data.company_name,
    company_email: data.company_email,
    google_review_url: data.google_review_url,
    primary_color: data.primary_color,
  });
}
