import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { computeStats } from "@/lib/stats";

export async function GET() {
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

  const { data: ratings } = await supabase
    .from("ratings")
    .select("rating, created_at")
    .eq("license_key", profile.license_key)
    .order("created_at", { ascending: true });

  return NextResponse.json(computeStats(ratings ?? []));
}
