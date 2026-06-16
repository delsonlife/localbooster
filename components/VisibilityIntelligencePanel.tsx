"use client";

import { useEffect, useState } from "react";
import VisibilityScore from "@/components/VisibilityScore";
import CompetitorComparison from "@/components/CompetitorComparison";
import Recommendations from "@/components/Recommendations";
import type { VisibilityIntelligenceData } from "@/types/dashboard";

interface VisibilityIntelligencePanelProps {
  primaryColor: string;
}

interface ApiError {
  code: string;
  message: string;
}

export default function VisibilityIntelligencePanel({ primaryColor }: VisibilityIntelligencePanelProps) {
  const [data, setData] = useState<VisibilityIntelligenceData | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dashboard/visibility${forceRefresh ? "?refresh=1" : ""}`);
      const json = await response.json();

      if (!response.ok) {
        setError(json.error ?? { code: "UNKNOWN", message: "Erreur inconnue." });
        setData(null);
      } else {
        setData(json);
      }
    } catch {
      setError({ code: "UNKNOWN", message: "Impossible de charger les données." });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-gray-100">
        <p className="text-sm text-gray-400">Analyse de votre visibilité en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-gray-100">
        <p className="mb-1 text-sm font-medium text-gray-900">Visibilité indisponible</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-900">Visibility Intelligence</p>
        <button
          type="button"
          onClick={() => load(true)}
          disabled={refreshing}
          className="rounded-full px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-60"
        >
          {refreshing ? "Actualisation..." : "Actualiser"}
        </button>
      </div>

      <VisibilityScore data={data.visibility} primaryColor={primaryColor} />
      <CompetitorComparison data={data.competitors} />
      <Recommendations items={data.recommendations.items} />
    </div>
  );
}
