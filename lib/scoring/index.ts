import { computeVisibilityScoreV1, buildRecommendationsV1, SCORING_VERSION } from "./v1";
import type { GooglePlaceDetails } from "@/types/google";
import type { CompetitorComparisonData, RecommendationItem, VisibilityScoreData } from "@/types/dashboard";

export const CURRENT_SCORING_VERSION = SCORING_VERSION;

export function computeVisibilityScore(
  place: GooglePlaceDetails,
  competitors: CompetitorComparisonData
): VisibilityScoreData {
  return computeVisibilityScoreV1(place, competitors);
}

export function buildRecommendations(
  place: GooglePlaceDetails,
  visibility: VisibilityScoreData,
  competitors: CompetitorComparisonData
): RecommendationItem[] {
  return buildRecommendationsV1(place, visibility, competitors);
}
