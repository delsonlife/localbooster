"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import type { License } from "@/types/license";

interface SettingsFormProps {
  license: License;
}

export default function SettingsForm({ license }: SettingsFormProps) {
  const [companyName, setCompanyName] = useState(license.company_name);
  const [companyEmail, setCompanyEmail] = useState(license.company_email);
  const [googleReviewUrl, setGoogleReviewUrl] = useState(license.google_review_url);
  const [primaryColor, setPrimaryColor] = useState(license.primary_color);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("licenses")
      .update({
        company_name: companyName.trim(),
        company_email: companyEmail.trim(),
        google_review_url: googleReviewUrl.trim(),
        primary_color: primaryColor,
      })
      .eq("license_key", license.license_key);

    if (error) {
      setMessage({
        type: "error",
        text: "Une erreur est survenue. Veuillez réessayer.",
      });
    } else {
      setMessage({ type: "success", text: "Modifications enregistrées." });
    }

    setSaving(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-gray-100"
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700" htmlFor="company_name">
          Nom de l&apos;entreprise
        </label>
        <input
          id="company_name"
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700" htmlFor="company_email">
          Email de réception des feedbacks
        </label>
        <input
          id="company_email"
          type="email"
          value={companyEmail}
          onChange={(event) => setCompanyEmail(event.target.value)}
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700" htmlFor="google_review_url">
          Lien Avis Google
        </label>
        <input
          id="google_review_url"
          type="url"
          value={googleReviewUrl}
          onChange={(event) => setGoogleReviewUrl(event.target.value)}
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700" htmlFor="primary_color">
          Couleur principale
        </label>
        <div className="flex items-center gap-3">
          <input
            id="primary_color"
            type="color"
            value={primaryColor}
            onChange={(event) => setPrimaryColor(event.target.value)}
            className="h-10 w-14 cursor-pointer rounded-lg border border-gray-200 p-1"
          />
          <span className="text-sm text-gray-400">{primaryColor}</span>
        </div>
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="self-start rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-opacity disabled:opacity-60"
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
