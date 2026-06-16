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

  const Stars = () => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((v) => (
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
            fill="currentColor"
            className={`${isMobile ? "h-10 w-10" : "h-9 w-9"} transition-colors duration-100 ${
              v <= (hoveredStar || selectedRating)
                ? "text-amber-400"
                : isMobile
                ? "text-gray-300"
                : "text-gray-500"
            }`}
          >
            <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.6l-5.9 3.08 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z" />
          </svg>
        </button>
      ))}
    </div>
  );

  const PhotoBlock = () => (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-medium transition-colors ${
          isMobile
            ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
            : "border-gray-500 text-gray-300 hover:border-gray-300 hover:text-white"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        Ajouter des photos et vidéos
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
      {imagePreviews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {imagePreviews.map((src, idx) => (
            <div key={idx} className="relative h-16 w-16 overflow-hidden rounded-xl bg-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // VERSION MOBILE
  if (isMobile) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          <button type="button" onClick={onCancel} className="p-1 text-gray-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <p className="text-base font-semibold text-gray-900">{companyName}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
              V
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Votre avis</p>
              <p className="text-xs text-gray-400">Post public sur Google ⓘ</p>
            </div>
          </div>

          <div className="mb-5">
            <Stars />
          </div>

          <form id="feedback-form" onSubmit={handleSubmit}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience concernant ce lieu"
              rows={5}
              maxLength={1000}
              style={ringStyle}
              className="mb-4 w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2"
            />

            <div className="mb-5">
              <p className="mb-2 text-xs font-medium text-gray-500">Date de la visite</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative rounded-xl border border-gray-200 px-4 py-3">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-gray-400">
                    Mois
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="w-full appearance-none bg-transparent text-sm text-gray-900 focus:outline-none"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="relative rounded-xl border border-gray-200 px-4 py-3">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-gray-400">
                    Année
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full appearance-none bg-transparent text-sm text-gray-900 focus:outline-none"
                  >
                    {getYears().map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <PhotoBlock />

            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          </form>
        </div>

        <div className="border-t border-gray-100 bg-white px-4 pb-8 pt-3">
          <button
            type="submit"
            form="feedback-form"
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
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-[#1f1f1f] shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-lg font-semibold text-white">{companyName}</p>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                <span>⭐</span>
                <span>Post public sur Google ⓘ</span>
              </div>
            </div>
            <button type="button" onClick={onCancel} className="rounded-full p-1 text-gray-400 hover:text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-5 flex justify-center">
            <Stars />
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience concernant ce lieu"
            rows={4}
            maxLength={1000}
            className="mb-4 w-full resize-none rounded-xl border border-gray-600 bg-[#2a2a2a] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none"
          />

          <div className="mb-5">
            <PhotoBlock />
          </div>

          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

          <div className="flex items-center justify-end gap-3 border-t border-gray-700 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-5 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors"
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
