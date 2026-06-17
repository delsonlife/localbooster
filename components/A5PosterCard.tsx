"use client";

import { useState } from "react";
import type { jsPDF } from "jspdf";

interface A5PosterCardProps {
  licenseKey: string;
  companyName: string;
  primaryColor: string;
  pngQrUrl: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

async function fetchAsDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function A5PosterCard({
  licenseKey,
  companyName,
  primaryColor,
  pngQrUrl,
}: A5PosterCardProps) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    setGenerating(true);

    try {
      const { jsPDF: JsPdfCtor } = await import("jspdf");
      const doc: jsPDF = new JsPdfCtor({ unit: "mm", format: "a5" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const centerX = pageWidth / 2;
      const [r, g, b] = hexToRgb(primaryColor);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(20, 20, 20);
      doc.text(companyName || "Votre entreprise", centerX, 24, { align: "center" });

      doc.setFontSize(22);
      doc.text("Votre avis", centerX, 56, { align: "center" });
      doc.text("compte pour nous", centerX, 67, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text("Scannez ce code et laissez votre avis", centerX, 78, { align: "center" });
      doc.text("en moins de 5 secondes", centerX, 84, { align: "center" });

      const qrSize = 62;
      const qrX = centerX - qrSize / 2;
      const qrY = 96;
      doc.setDrawColor(r, g, b);
      doc.setLineWidth(0.6);
      doc.roundedRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, 3, 3);

      const qrDataUrl = await fetchAsDataUrl(pngQrUrl);
      doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text("Scannez avec votre téléphone", centerX, qrY + qrSize + 10, { align: "center" });

      const stepsY = qrY + qrSize + 24;
      const steps = ["Scannez le QR Code", "Donnez votre note", "C'est terminé !"];
      const stepWidth = 38;
      const startX = centerX - (stepWidth * 1.5);

      steps.forEach((step, i) => {
        const x = startX + stepWidth * i + stepWidth / 2;
        doc.setFillColor(r, g, b);
        doc.circle(x, stepsY, 3.4, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(String(i + 1), x, stepsY + 1.1, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(80, 80, 80);
        doc.text(step, x, stepsY + 7, { align: "center", maxWidth: stepWidth - 2 });
      });

      doc.setDrawColor(180, 180, 180);
      doc.line(centerX - 12, 196, centerX + 12, 196);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Coordonnées de l'entreprise (à compléter)", centerX, 201, { align: "center" });

      doc.save(`affiche-A5-${licenseKey}.pdf`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-gray-100">
      <div>
        <p className="text-sm font-medium text-gray-900">Affiche A5</p>
        <p className="mt-1 text-sm text-gray-400">
          À imprimer et afficher en comptoir ou en vitrine.
        </p>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        disabled={generating}
        style={{ backgroundColor: primaryColor }}
        className="self-start rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-soft transition-opacity disabled:opacity-60"
      >
        {generating ? "Génération..." : "Télécharger le PDF"}
      </button>
    </div>
  );
}
