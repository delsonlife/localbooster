"use client";

import { useState, type FormEvent, type CSSProperties, useRef, useEffect } from "react";

interface FeedbackFormProps {
  licenseKey: string;
  rating: number;
  primaryColor: string;
  businessName: string; // ← Dynamique : nom de l'entreprise
  onSubmitted: () => void;
  isMobile?: boolean; // ← Optionnel : forcer le mode mobile (sinon responsive)
}

export default function FeedbackForm({
  licenseKey,
  rating,
  primaryColor,
  businessName,
  onSubmitted,
  isMobile = false,
}: FeedbackFormProps) {
  const [comment, setComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(rating);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Détection automatique mobile/pc si non forcé
  const [isMobileView, setIsMobileView] = useState(isMobile);

  useEffect(() => {
    if (!isMobile) {
      const checkMobile = () => {
        setIsMobileView(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, [isMobile]);

  // Date automatique (mois / année)
  const getCurrentDate = () => {
    const now = new Date();
    const months = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const handleStarClick = (starValue: number) => {
    setSelectedRating(starValue);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files];
    setImages(newImages);

    // Créer les aperçus
    const newPreviews = [...imagePreviews];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPreviews.push(event.target?.result as string);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!comment.trim()) {
      setError("Merci de partager votre expérience.");
      return;
    }

    if (!selectedRating) {
      setError("Veuillez sélectionner une note.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Préparer FormData pour inclure les images
      const formData = new FormData();
      formData.append("license", licenseKey);
      formData.append("rating", selectedRating.toString());
      formData.append("comment", comment.trim());
      formData.append("date", getCurrentDate());
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      const response = await fetch("/api/feedback", {
        method: "POST",
        body: formData, // ← Changé de JSON à FormData
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      onSubmitted();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Voulez-vous vraiment annuler ? Les données seront perdues.")) {
      setComment("");
      setSelectedRating(rating);
      setImages([]);
      setImagePreviews([]);
      setError("");
    }
  };

  const ringStyle = {
    "--tw-ring-color": primaryColor,
  } as CSSProperties;

  // Version mobile (carte pleine largeur)
  if (isMobileView) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6">
          {/* Nom de l'entreprise */}
          <h2 className="text-2xl font-medium text-gray-900">{businessName}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 mb-4">
            <span>📢</span> Post public sur Google
          </div>

          {/* Étoiles */}
          <div className="mb-5">
            <div className="text-base font-medium text-gray-900 mb-2">Votre note</div>
            <div className="flex gap-2 flex-row-reverse justify-end">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="text-4xl transition-colors"
                  style={{ color: star <= selectedRating ? "#fbbc04" : "#dadce0" }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Champ avis */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience concernant ce lieu..."
            rows={4}
            maxLength={1000}
            style={ringStyle}
            className="w-full resize-none rounded-2xl border border-gray-200 px-5 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 mb-4"
          />

          {/* Upload images */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 cursor-pointer hover:bg-gray-100 transition mb-3"
          >
            <span className="text-3xl">📸</span>
            <span className="text-blue-600 font-medium">Ajouter des photos</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Aperçu images */}
          {imagePreviews.length > 0 && (
            <div className="flex gap-3 flex-wrap mb-4">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-black/60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Date auto */}
          <div className="text-sm text-gray-500 mb-4">{getCurrentDate()}</div>

          {/* Boutons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              Annuler
            </button>
            <button
              onClick={(e) => handleSubmit(e as any)}
              disabled={submitting}
              style={{ backgroundColor: primaryColor }}
              className="px-6 py-2 rounded-full text-sm font-medium text-white shadow-md transition-opacity disabled:opacity-60"
            >
              {submitting ? "Envoi..." : "Publier"}
            </button>
          </div>

          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
        </div>
      </div>
    );
  }

  // Version PC : Popup modal (à appeler depuis un bouton "Laisser un avis")
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-7">
          {/* Nom + badge */}
          <div className="mb-4">
            <h2 className="text-2xl font-medium text-gray-900">{businessName}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>⭐</span> Post public sur Google
            </div>
          </div>

          {/* Étoiles */}
          <div className="mb-5">
            <div className="text-sm font-medium text-gray-900 mb-2">Votre note</div>
            <div className="flex gap-2 flex-row-reverse justify-start">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="text-3xl transition-colors"
                  style={{ color: star <= selectedRating ? "#fbbc04" : "#dadce0" }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Champ avis */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience concernant ce lieu..."
            rows={4}
            maxLength={1000}
            style={ringStyle}
            className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 mb-4"
          />

          {/* Upload images */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 cursor-pointer hover:bg-gray-100 transition mb-3"
          >
            <span className="text-2xl">🖼️</span>
            <span className="text-blue-600 font-medium text-sm">Ajouter des photos</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Aperçu images */}
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-black/60 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              Annuler
            </button>
            <button
              onClick={(e) => handleSubmit(e as any)}
              disabled={submitting}
              style={{ backgroundColor: primaryColor }}
              className="px-5 py-2 rounded-full text-sm font-medium text-white shadow-md transition-opacity disabled:opacity-60"
            >
              {submitting ? "Envoi..." : "Publier"}
            </button>
          </div>

          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
        </div>
      </div>
    </div>
  );
}
