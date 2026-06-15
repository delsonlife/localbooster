"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import FeedbackForm from "./FeedbackForm";

interface ReviewWidgetProps {
  licenseKey: string;
  companyName: string;
  googleReviewUrl: string;
  primaryColor: string;
}

type Step = "rating" | "feedback" | "thanks";

export default function ReviewWidget({
  licenseKey,
  companyName,
  googleReviewUrl,
  primaryColor,
}: ReviewWidgetProps) {
  const [step, setStep] = useState<Step>("rating");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const handleSelect = async (rating: number) => {
    setSelectedRating(rating);

    // Enregistrement de la note (best-effort, ne bloque pas l'expérience)
    fetch("/api/rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ license: licenseKey, rating }),
    }).catch(() => {});

    if (rating >= 4) {
      setRedirecting(true);
      window.location.href = googleReviewUrl;
    } else {
      setStep("feedback");
    }
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-white px-6 py-10">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-soft ring-1 ring-gray-100">
        {step === "rating" && (
          <div className="flex flex-col items-center gap-7 text-center">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold text-gray-900">
                Votre avis compte
              </p>
              {companyName && (
                <p className="text-sm text-gray-400">{companyName}</p>
              )}
            </div>

            <StarRating onSelect={handleSelect} disabled={redirecting} />

            {redirecting && (
              <p className="text-xs text-gray-400">Redirection...</p>
            )}
          </div>
        )}

        {step === "feedback" && selectedRating !== null && (
          <FeedbackForm
            licenseKey={licenseKey}
            rating={selectedRating}
            primaryColor={primaryColor}
            onSubmitted={() => setStep("thanks")}
          />
        )}

        {step === "thanks" && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <p className="text-lg font-semibold text-gray-900">Merci</p>
            <p className="text-sm text-gray-400">
              Votre retour a bien été transmis.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
