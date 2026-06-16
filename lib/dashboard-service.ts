import { getPlaceDetails } from "@/lib/google-places";
import { resolveLicensePlaceId, detectBusinessCategory, findCompetitors } from "@/lib/competitors";
import { computeVisibilityScore, buildRecommendations, CURRENT_SCORING_VERSION } from "@/lib/scoring";
import { getCachedVisibility, setCachedVisibility } from "@/lib/cache";
import type { VisibilityIntelligenceData, VisibilityIntelligenceError } from "@/types/dashboard";

export class VisibilityIntelligenceServiceError extends Error {
  code: VisibilityIntelligenceError["code"];

  constructor(code: VisibilityIntelligenceError["code"], message: string) {
    super(message);
    this.code = code;
  }
}

function toServiceError(error: unknown): VisibilityIntelligenceServiceError {
  const message = error instanceof Error ? error.message : "UNKNOWN";

  const knownCodes: VisibilityIntelligenceError["code"][] = [
    "PLACE_NOT_FOUND",
    "GOOGLE_API_ERROR",
    "MISSING_API_KEY",
    "NO_CATEGORY_DETECTED",
  ];

  const code = knownCodes.includes(message as VisibilityIntelligenceError["code"])
    ? (message as VisibilityIntelligenceError["code"])
    : "UNKNOWN";

  const friendlyMessages: Record<VisibilityIntelligenceError["code"], string> = {
    PLACE_NOT_FOUND:
      "Impossible de retrouver votre fiche Google. Vérifiez le lien Google Avis dans Paramètres.",
    GOOGLE_API_ERROR: "Le service Google est momentanément indisponible.",
    MISSING_API_KEY: "La clé API Google n'est pas configurée.",
    NO_CATEGORY_DETECTED:
      "Impossible de déterminer votre catégorie d'activité depuis votre fiche Google.",
    UNKNOWN: "Une erreur inattendue est survenue.",
  };

  return new VisibilityIntelligenceServiceError(code, friendlyMessages[code]);
}

export async function getVisibilityIntelligence(
  licenseKey: string,
  companyName: string,
  googleReviewUrl: string,
  options: { forceRefresh?: boolean } = {}
): Promise<VisibilityIntelligenceData> {
  if (!options.forceRefresh) {
    const cached = await getCachedVisibility(licenseKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const placeId = await resolveLicensePlaceId(licenseKey, companyName, googleReviewUrl);
    const place = await getPlaceDetails(placeId);
    const category = detectBusinessCategory(place);
    const competitors = await findCompetitors(place, category);
    const visibility = computeVisibilityScore(place, competitors);
    const recommendations = buildRecommendations(place, visibility, competitors);

    const payload: Omit<VisibilityIntelligenceData, "fromCache"> = {
      visibility,
      competitors,
      recommendations: { items: recommendations },
    };

    await setCachedVisibility(licenseKey, payload, CURRENT_SCORING_VERSION);

    return { ...payload, fromCache: false };
  } catch (error) {
    throw toServiceError(error);
  }
}
