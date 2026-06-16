import type {
  GooglePlaceDetails,
  GooglePlaceSearchResult,
  GoogleTextSearchResponse,
  GoogleNearbySearchResponse,
} from "@/types/google";

const PLACES_API_BASE = "https://places.googleapis.com/v1";

function getApiKey(): string {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    throw new Error("MISSING_API_KEY");
  }
  return key;
}

export function extractPlaceIdFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const placeId = parsed.searchParams.get("placeid");
    if (placeId && placeId.startsWith("ChIJ")) {
      return placeId;
    }
    return null;
  } catch {
    return null;
  }
}

export async function resolvePlaceIdByName(
  companyName: string,
  context?: { lat?: number; lng?: number }
): Promise<GooglePlaceSearchResult | null> {
  const response = await fetch(`${PLACES_API_BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": getApiKey(),
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types,places.primaryType",
    },
    body: JSON.stringify({
      textQuery: companyName,
      ...(context?.lat && context?.lng
        ? {
            locationBias: {
              circle: {
                center: { latitude: context.lat, longitude: context.lng },
                radius: 20000,
              },
            },
          }
        : {}),
    }),
  });

  if (!response.ok) {
    throw new Error("GOOGLE_API_ERROR");
  }

  const json: GoogleTextSearchResponse = await response.json();
  return json.places?.[0] ?? null;
}

export async function getPlaceDetails(
  placeId: string
): Promise<GooglePlaceDetails> {
  const response = await fetch(`${PLACES_API_BASE}/places/${placeId}`, {
    method: "GET",
    headers: {
      "X-Goog-Api-Key": getApiKey(),
      "X-Goog-FieldMask":
        "id,displayName,formattedAddress,location,rating,userRatingCount,types,primaryType,websiteUri,nationalPhoneNumber,regularOpeningHours,photos",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("PLACE_NOT_FOUND");
    }
    throw new Error("GOOGLE_API_ERROR");
  }

  return response.json();
}

export async function searchNearbyByType(
  lat: number,
  lng: number,
  placeType: string,
  radiusMeters: number
): Promise<GooglePlaceSearchResult[]> {
  const response = await fetch(`${PLACES_API_BASE}/places:searchNearby`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": getApiKey(),
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types,places.primaryType",
    },
    body: JSON.stringify({
      includedTypes: [placeType],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: radiusMeters,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error("GOOGLE_API_ERROR");
  }

  const json: GoogleNearbySearchResponse = await response.json();
  return json.places ?? [];
}

export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
