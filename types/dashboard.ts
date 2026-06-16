export interface VisibilityScoreBreakdown {
  label: string;
  score: number;
  weight: number;
  detail: string;
}

export interface VisibilityScoreData {
  score: number;
  scoringVersion: string;
  breakdown: VisibilityScoreBreakdown[];
  insight: string;
  computedAt: string;
}

export interface CompetitorEntry {
  placeId: string;
  name: string;
  rating: number | null;
  reviewCount: number;
  distanceKm: number;
  isCurrentBusiness: boolean;
}

export interface CompetitorComparisonData {
  searchCategory: string;
  searchRadiusKm: number;
  competitors: CompetitorEntry[];
  currentBusinessRank: number | null;
  totalFound: number;
}

export type RecommendationPriority = "high" | "medium" | "low";

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  impact: string;
}

export interface RecommendationsData {
  items: RecommendationItem[];
}

export interface VisibilityIntelligenceData {
  visibility: VisibilityScoreData;
  competitors: CompetitorComparisonData;
  recommendations: RecommendationsData;
  fromCache: boolean;
}

export interface VisibilityIntelligenceError {
  code:
    | "PLACE_NOT_FOUND"
    | "GOOGLE_API_ERROR"
    | "MISSING_API_KEY"
    | "NO_CATEGORY_DETECTED"
    | "UNKNOWN";
  message: string;
}
