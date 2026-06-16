/**
 * Types pour l'intégration Google Places API (New).
 * Documentation : https://developers.google.com/maps/documentation/places/web-service
 */

export interface GooglePlaceLocation {
  latitude: number;
  longitude: number;
}

export interface GooglePlaceReviewSummary {
  rating: number;
  userRatingCount: number;
}

export interface GooglePlaceDetails {
  id: string;
  displayName?: { text: string; languageCode?: string };
  formattedAddress?: string;
  location?: GooglePlaceLocation;
  rating?: number;
  userRatingCount?: number;
  types?: string[];
  primaryType?: string;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  regularOpeningHours?: {
    openNow?: boolean;
    weekdayDescriptions?: string[];
  };
  photos?: { name: string }[];
}

export interface GooglePlaceSearchResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: GooglePlaceLocation;
  rating?: number;
  userRatingCount?: number;
  types?: string[];
  primaryType?: string;
}

export interface GoogleTextSearchResponse {
  places?: GooglePlaceSearchResult[];
}

export interface GoogleNearbySearchResponse {
  places?: GooglePlaceSearchResult[];
}

export const GENERIC_PLACE_TYPES = new Set([
  "point_of_interest",
  "establishment",
  "store",
  "premise",
  "geocode",
]);
