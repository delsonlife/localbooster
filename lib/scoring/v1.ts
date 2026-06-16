import type { GooglePlaceDetails } from "@/types/google";
import type {
  CompetitorComparisonData,
  RecommendationItem,
  VisibilityScoreBreakdown,
  VisibilityScoreData,
} from "@/types/dashboard";

export const SCORING_VERSION = "v1";

function scoreReviewVolume(
  place: GooglePlaceDetails,
  competitors: CompetitorComparisonData
): VisibilityScoreBreakdown {
  const ownCount = place.userRatingCount ?? 0;
  const maxCount = Math.max(
    1,
    ...competitors.competitors.map((c) => c.reviewCount)
  );

  const ratio = Math.min(1, ownCount / maxCount);
  const score = Math.round(ratio * 100);

  return {
    label: "Volume d'avis",
    score,
    weight: 0.4,
    detail: `${ownCount} avis, contre ${maxCount} pour le concurrent le mieux noté du secteur.`,
  };
}

function scoreAverageRating(place: GooglePlaceDetails): VisibilityScoreBreakdown {
  const rating = place.rating ?? 0;
  const score = Math.round((rating / 5) * 100);

  return {
    label: "Note moyenne",
    score,
    weight: 0.3,
    detail:
      rating > 0
        ? `Votre note actuelle est de ${rating.toFixed(1)} / 5.`
        : "Aucune note disponible pour le moment.",
  };
}

function scoreLocalRanking(
  competitors: CompetitorComparisonData
): VisibilityScoreBreakdown {
  const total = competitors.totalFound;
  const rank = competitors.currentBusinessRank;

  if (!rank || total <= 1) {
    return {
      label: "Classement local",
      score: 50,
      weight: 0.2,
      detail: "Pas assez de concurrents identifiés pour calculer un classement fiable.",
    };
  }

  const score = Math.round(((total - rank) / (total - 1)) * 100);

  return {
    label: "Classement local",
    score,
    weight: 0.2,
    detail: `Vous êtes classé ${rank}ᵉ sur ${total} établissements similaires dans la zone.`,
  };
}

function scoreProfileCompleteness(place: GooglePlaceDetails): VisibilityScoreBreakdown {
  const checks = [
    Boolean(place.websiteUri),
    Boolean(place.nationalPhoneNumber),
    Boolean(place.regularOpeningHours?.weekdayDescriptions?.length),
    Boolean(place.photos?.length),
  ];

  const score = Math.round(
    (checks.filter(Boolean).length / checks.length) * 100
  );

  return {
    label: "Complétude de la fiche",
    score,
    weight: 0.1,
    detail: `${checks.filter(Boolean).length}/4 informations clés renseignées (site, téléphone, horaires, photos).`,
  };
}

function buildInsight(score: number, rank: number | null, total: number): string {
  if (rank && total > 0) {
    if (rank === 1) {
      return "Vous êtes en tête de votre zone locale, continuez sur cette lancée.";
    }
    if (rank <= Math.ceil(total / 3)) {
      return `Vous faites partie du groupe de tête (${rank}ᵉ sur ${total}) de votre zone.`;
    }
  }

  if (score >= 70) return "Votre visibilité locale est solide.";
  if (score >= 40) return "Votre visibilité locale est correcte mais peut progresser.";
  return "Votre visibilité locale est en retrait par rapport aux concurrents proches.";
}

export function computeVisibilityScoreV1(
  place: GooglePlaceDetails,
  competitors: CompetitorComparisonData
): VisibilityScoreData {
  const breakdown = [
    scoreReviewVolume(place, competitors),
    scoreAverageRating(place),
    scoreLocalRanking(competitors),
    scoreProfileCompleteness(place),
  ];

  const weightedScore = breakdown.reduce(
    (sum, b) => sum + b.score * b.weight,
    0
  );

  return {
    score: Math.round(weightedScore),
    scoringVersion: SCORING_VERSION,
    breakdown,
    insight: buildInsight(
      Math.round(weightedScore),
      competitors.currentBusinessRank,
      competitors.totalFound
    ),
    computedAt: new Date().toISOString(),
  };
}

export function buildRecommendationsV1(
  place: GooglePlaceDetails,
  visibility: VisibilityScoreData,
  competitors: CompetitorComparisonData
): RecommendationItem[] {
  const items: RecommendationItem[] = [];

  const reviewVolume = visibility.breakdown.find((b) => b.label === "Volume d'avis");
  if (reviewVolume && reviewVolume.score < 70) {
    items.push({
      id: "increase-review-volume",
      title: "Augmentez votre nombre d'avis",
      description:
        "Partagez votre QR Code en fin de prestation pour inciter vos clients satisfaits à laisser un avis Google.",
      priority: reviewVolume.score < 40 ? "high" : "medium",
      impact: `+${Math.round((100 - reviewVolume.score) * 0.4 * 0.3)} points potentiels`,
    });
  }

  const completeness = visibility.breakdown.find(
    (b) => b.label === "Complétude de la fiche"
  );
  if (completeness && completeness.score < 100) {
    const missing: string[] = [];
    if (!place.websiteUri) missing.push("site web");
    if (!place.nationalPhoneNumber) missing.push("téléphone");
    if (!place.regularOpeningHours?.weekdayDescriptions?.length) missing.push("horaires");
    if (!place.photos?.length) missing.push("photos");

    items.push({
      id: "complete-profile",
      title: "Complétez votre fiche Google",
      description: `Ajoutez les informations manquantes sur votre fiche Google Business Profile : ${missing.join(", ")}.`,
      priority: completeness.score < 50 ? "high" : "medium",
      impact: `+${Math.round((100 - completeness.score) * 0.1)} points potentiels`,
    });
  }

  const rating = visibility.breakdown.find((b) => b.label === "Note moyenne");
  if (rating && rating.score < 90) {
    items.push({
      id: "improve-rating",
      title: "Travaillez votre note moyenne",
      description:
        "Identifiez les retours négatifs récurrents via vos feedbacks internes et ajustez votre prestation en conséquence.",
      priority: rating.score < 60 ? "high" : "low",
      impact: `+${Math.round((100 - rating.score) * 0.3 * 0.2)} points potentiels`,
    });
  }

  if (items.length < 3 && competitors.currentBusinessRank && competitors.currentBusinessRank > 1) {
    items.push({
      id: "monitor-competitors",
      title: "Surveillez vos concurrents directs",
      description: `${competitors.totalFound - 1} établissements similaires sont actifs dans votre zone (${competitors.searchRadiusKm} km). Consultez régulièrement leurs avis récents.`,
      priority: "low",
      impact: "Veille concurrentielle",
    });
  }

  return items.slice(0, 3);
}
