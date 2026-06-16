import {
  extractPlaceIdFromUrl,
  resolvePlaceIdByName,
  getPlaceDetails,
  searchNearbyByType,
  distanceKm,
} from "@/lib/google-places";
import { getCachedPlaceId, setCachedPlaceId } from "@/lib/cache";
import { GENERIC_PLACE_TYPES } from "@/types/google";
import type { GooglePlaceDetails } from "@/types/google";
import type { CompetitorComparisonData, CompetitorEntry } from "@/types/dashboard";

const RADIUS_STEPS_KM = [5, 10, 15];
const MIN_COMPETITORS_FOR_VALID_SAMPLE = 3;

export async function resolveLicensePlaceId(
  licenseKey: string,
  companyName: string,
  googleReviewUrl: string
): Promise<string> {
  const cached = await getCachedPlaceId(licenseKey);
  if (cached) {
    return cached.placeId;
  }

  const directPlaceId = extractPlaceIdFromUrl(googleReviewUrl);
  if (directPlaceId) {
    await setCachedPlaceId(licenseKey, directPlaceId, "direct");
    return directPlaceId;
  }

  const resolved = await resolvePlaceIdByName(companyName);
  if (!resolved) {
    throw new Error("PLACE_NOT_FOUND");
  }

  await setCachedPlaceId(licenseKey, resolved.id, "resolved");
  return resolved.id;
}

export function detectBusinessCategory(place: GooglePlaceDetails): string {
  if (place.primaryType && !GENERIC_PLACE_TYPES.has(place.primaryType)) {
    return place.primaryType;
  }

  const specificType = place.types?.find((t) => !GENERIC_PLACE_TYPES.has(t));
  if (specificType) {
    return specificType;
  }

  throw new Error("NO_CATEGORY_DETECTED");
}

export async function findCompetitors(
  place: GooglePlaceDetails,
  category: string
): Promise<CompetitorComparisonData> {
  if (!place.location) {
    throw new Error("PLACE_NOT_FOUND");
  }

  const { latitude, longitude } = place.location;

  let results: Awaited<ReturnType<typeof searchNearbyByType>> = [];
  let usedRadius = RADIUS_STEPS_KM[0];

  for (const radiusKm of RADIUS_STEPS_KM) {
    results = await searchNearbyByType(
      latitude,
      longitude,
      category,
      radiusKm * 1000
    );
    usedRadius = radiusKm;

    if (results.length >= MIN_COMPETITORS_FOR_VALID_SAMPLE) {
      break;
    }
  }

  const entries: CompetitorEntry[] = results.map((r) => ({
    placeId: r.id,
    name: r.displayName?.text ?? "Établissement",
    rating: r.rating ?? null,
    reviewCount: r.userRatingCount ?? 0,
    distanceKm: r.location
      ? distanceKm(latitude, longitude, r.location.latitude, r.location.longitude)
      : 0,
    isCurrentBusiness: r.id === place.id,
  }));

  if (!entries.some((e) => e.isCurrentBusiness)) {
    entries.push({
      placeId: place.id,
      name: place.displayName?.text ?? "Votre entreprise",
      rating: place.rating ?? null,
      reviewCount: place.userRatingCount ?? 0,
      distanceKm: 0,
      isCurrentBusiness: true,
    });
  }

  const ranked = [...entries].sort((a, b) => b.reviewCount - a.reviewCount);
  const rankIndex = ranked.findIndex((e) => e.isCurrentBusiness);

  return {
    searchCategory: category,
    searchRadiusKm: usedRadius,
    competitors: ranked.slice(0, 10),
    currentBusinessRank: rankIndex >= 0 ? rankIndex + 1 : null,
    totalFound: entries.length,
  };
}
