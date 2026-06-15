import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { License } from "@/types/license";

export interface DashboardProfile {
  userId: string;
  email: string | null;
  role: string;
  license: License;
}

/**
 * À utiliser dans les Server Components / Route Handlers du dashboard.
 * Redirige vers /dashboard/login si l'utilisateur n'est pas connecté
 * ou n'a pas de profil associé à une licence.
 */
export async function getDashboardProfile(): Promise<DashboardProfile> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/dashboard/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("license_key, role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/dashboard/login");
  }

  const { data: license, error: licenseError } = await supabase
    .from("licenses")
    .select("*")
    .eq("license_key", profile.license_key)
    .single();

  if (licenseError || !license) {
    redirect("/dashboard/login");
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    role: profile.role,
    license: license as License,
  };
}
