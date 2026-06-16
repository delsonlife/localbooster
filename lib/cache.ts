import { supabase } from "@/lib/supabase/admin";
import type { VisibilityIntelligenceData } from "@/types/dashboard";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface VisibilityCacheRow {
  license_key: string;
  data: Omit<VisibilityIntelligenceData, "fromCache">;
  scoring_version: string;
  created_at: string;
}

export async function getCachedVisibility(
  licenseKey: string
): Promise<VisibilityIntelligenceData | null> {
  const { data, error } = await supabase
    .from("visibility_cache")
    .select("data, created_at")
    .eq("license_key", licenseKey)
    .single<Pick<VisibilityCacheRow, "data" | "created_at">>();

  if (error || !data) {
    return null;
  }

  const age = Date.now() - new Date(data.created_at).getTime();
  if (age > CACHE_TTL_MS) {
    return null;
  }

  return { ...data.data, fromCache: true };
}

export async function setCachedVisibility(
  licenseKey: string,
  payload: Omit<VisibilityIntelligenceData, "fromCache">,
  scoringVersion: string
): Promise<void> {
  await supabase.from("visibility_cache").upsert({
    license_key: licenseKey,
    data: payload,
    scoring_version: scoringVersion,
    created_at: new Date().toISOString(),
  });
}

export async function getCachedPlaceId(
  licenseKey: string
): Promise<{ placeId: string; method: "direct" | "resolved" } | null> {
  const { data, error } = await supabase
    .from("license_place_ids")
    .select("place_id, resolution_method")
    .eq("license_key", licenseKey)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    placeId: data.place_id,
    method: data.resolution_method as "direct" | "resolved",
  };
}

export async function setCachedPlaceId(
  licenseKey: string,
  placeId: string,
  method: "direct" | "resolved"
): Promise<void> {
  await supabase.from("license_place_ids").upsert({
    license_key: licenseKey,
    place_id: placeId,
    resolution_method: method,
  });
}
