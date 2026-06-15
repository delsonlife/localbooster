"use client";

import { useState, type FormEvent, type CSSProperties } from "react";

interface FeedbackFormProps {
  licenseKey: string;
  rating: number;
  primaryColor: string;
  onSubmitted: () => void;
}

export default function FeedbackForm({
  licenseKey,
  rating,
  primaryColor,
  onSubmitted,
}: FeedbackFormProps) {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const ringStyle = {
    "--tw-ring-color": primaryColor,
  } as CSSProperties;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!comment.trim()) {
      setError("Merci d'ajouter un commentaire.");
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
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        }),
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-center text-base font-medium text-gray-900">
        Votre retour nous aide à nous améliorer
      </p>

      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Titre (optionnel)"
        maxLength={80}
        style={ringStyle}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0"
      />

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Votre commentaire"
        rows={4}
        maxLength={1000}
        style={ringStyle}
        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        style={{ backgroundColor: primaryColor }}
        className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white shadow-soft transition-opacity disabled:opacity-60"
      >
        {submitting ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}
