import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { license, rating } = body as { license?: string; rating?: number };

  if (
    !license ||
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  const { data: licenseData, error: licenseError } = await supabase
    .from("licenses")
    .select("license_key, active")
    .eq("license_key", license)
    .single();

  if (licenseError || !licenseData || !licenseData.active) {
    return NextResponse.json({ error: "Licence invalide" }, { status: 404 });
  }

  const { error: insertError } = await supabase
    .from("ratings")
    .insert({ license_key: license, rating });

  if (insertError) {
    return NextResponse.json(
      { error: "Échec de l'enregistrement de la note" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
