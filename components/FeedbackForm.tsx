
"use client";

import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type CSSProperties,
} from "react";

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function getYears(): number[] {
  const current = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => current - i);
}

interface FeedbackFormProps {
  licenseKey: string;
  rating: number;
  primaryColor: string;
  companyName?: string;
  onSubmitted: () => void;
  onCancel: () => void;
}

export default function FeedbackForm({
  licenseKey,
  rating,
  primaryColor,
  companyName = "Votre entreprise",
  onSubmitted,
  onCancel,
}: FeedbackFormProps) {
  const now = new Date();
  const [selectedRating, setSelectedRating] = useState(rating);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!comment.trim()) {
      setError("Merci de partager votre expérience.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          license: licenseKey,
          rating: selectedRating,
          comment: comment.trim(),
          visit_month: month + 1,
          visit_year: year,
        }),
      });
      if (!response.ok) throw new Error("failed");
      onSubmitted();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setSubmitting(false);
    }
  };

  const ringStyle = { "--tw-ring-color": primaryColor } as CSSProperties;

  // Étoiles façon Google : contour fin, remplissage jaune progressif
  const Stars = ({ large = false }: { large?: boolean }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((v) => {
        const isFilled = v <= (hoveredStar || selectedRating);
        return (
          <button
            key={v}
            type="button"
            onMouseEnter={() => setHoveredStar(v)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setSelectedRating(v)}
            className="transition-transform hover:scale-110 active:scale-95"
            aria-label={`${v} étoile${v > 1 ? "s" : ""}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isFilled ? "#fbbc04" : "none"}
              stroke={isFilled ? "#fbbc04" : "currentColor"}
              strokeWidth="1.5"
              className={`${large ? "h-8 w-8" : "h-7 w-7"} text-gray-400 transition-colors duration-100`}
            >
              <path
                strokeLinejoin="round"
                d="M12 3.5l2.45 4.97 5.48.8-3.97 3.87.94 5.46L12 16.1l-4.9 2.5.94-5.46L2.07 9.27l5.48-.8L12 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );

  // VERSION MOBILE
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        <div className="flex flex-shrink-0 items-center gap-2 border-b border-gray-100 px-3 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-shrink-0 rounded-full p-1.5 text-gray-500 active:bg-gray-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">
            {companyName}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form id="mobile-feedback-form" onSubmit={handleSubmit} className="flex flex-col gap-5 px-4 py-6">
            <div className="flex justify-center">
              <Stars large />
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience concernant ce lieu"
              rows={5}
              maxLength={1000}
              style={ringStyle}
              className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2"
            />

            <div>
              <p className="mb-2 text-xs font-medium text-gray-500">Date de la visite</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative rounded-xl border border-gray-200 px-4 py-3">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-gray-400">Mois</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="w-full appearance-none bg-transparent text-sm text-gray-900 focus:outline-none"
                  >
                    {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                  </select>
                </div>
                <div className="relative rounded-xl border border-gray-200 px-4 py-3">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-gray-400">Année</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full appearance-none bg-transparent text-sm text-gray-900 focus:outline-none"
                  >
                    {getYears().map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => mobileFileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-900/10 py-2.5 text-sm font-medium text-blue-700 active:bg-blue-900/15"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Ajouter des photos
              </button>
              <input ref={mobileFileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative h-16 w-16 overflow-hidden rounded-xl bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="preview" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] text-white">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        </div>

        <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 pb-8 pt-3">
          <button
            type="submit"
            form="mobile-feedback-form"
            disabled={submitting}
            style={{ backgroundColor: primaryColor }}
            className="w-full rounded-full py-3.5 text-sm font-semibold text-white shadow-md transition-opacity disabled:opacity-60"
          >
            {submitting ? "Envoi..." : "Publier"}
          </button>
        </div>
      </div>
    );
  }

  // VERSION PC — POPUP DARK
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[#1f1f1f] shadow-2xl">
        <form onSubmit={handleSubmit} className="p-5">
          <div className="relative mb-4 flex items-center justify-center">
            <p className="max-w-[85%] truncate text-center text-sm font-normal text-white">
              {companyName}
            </p>
            <button
              type="button"
              onClick={onCancel}
              className="absolute right-0 rounded-full p-1 text-gray-400 hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4 flex justify-center">
            <Stars />
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience concernant ce lieu"
            rows={4}
            maxLength={1000}
            className="mb-3 w-full resize-none rounded-xl border border-gray-600 bg-[#2a2a2a] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none"
          />

          <div className="mb-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-500/10 py-2.5 text-sm font-medium text-blue-300 transition-colors hover:bg-blue-500/15"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Ajouter des photos
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative h-16 w-16 overflow-hidden rounded-xl bg-gray-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="preview" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] text-white">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

          <div className="flex items-center justify-end gap-3 border-t border-gray-700 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-5 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{ backgroundColor: primaryColor }}
              className="rounded-full px-5 py-2 text-sm font-semibold text-white shadow-md transition-opacity disabled:opacity-60"
            >
              {submitting ? "Envoi..." : "Publier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
