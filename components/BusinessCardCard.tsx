"use client";

import { useState } from "react";
import type { jsPDF } from "jspdf";

interface BusinessCardCardProps {
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

export default function BusinessCardCard({
  licenseKey,
  companyName,
  primaryColor,
  pngQrUrl,
}: BusinessCardCardProps) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    setGenerating(true);

    try {
      const { jsPDF: JsPdfCtor } = await import("jspdf");
      const doc: jsPDF = new JsPdfCtor({
        unit: "mm",
        format: [85, 55],
        orientation: "landscape",
      });

      const [r, g, b] = hexToRgb(primaryColor);

      doc.setFillColor(r, g, b);
      doc.rect(0, 0, 2.4, 55, "F");

      doc.setDrawColor(210, 210, 210);
      doc.setLineWidth(0.3);
      doc.circle(17, 16, 6, "D");
      doc.setFontSize(4.5);
      doc.setTextColor(180, 180, 180);
      doc.text("LOGO", 17, 16.5, { align: "center" });

      doc.setFont("helvetica", "bolditalic");
      doc.setFontSize(13);
      doc.setTextColor(170, 170, 170);
      doc.text("[ Prénom Nom ]", 9, 32);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.text("[ Fonction ]", 9, 37);

      doc.setFont("helvetica", "bolditalic");
      doc.setFontSize(9.5);
      doc.text(companyName ? companyName.toUpperCase() : "[ NOM DE L'ENTREPRISE ]", 9, 42.5);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(90, 90, 90);
      doc.text("[ +33 0 00 00 00 00 ]", 9, 47.5);
      doc.text("[ contact@entreprise.fr ]", 9, 50.5);

      doc.addPage([85, 55], "landscape");

      const centerX = 42.5;
      const qrSize = 26;
      const qrX = centerX - qrSize / 2;
      const qrY = 8;

      doc.setDrawColor(r, g, b);
      doc.setLineWidth(0.5);
      doc.roundedRect(qrX - 1.5, qrY - 1.5, qrSize + 3, qrSize + 3, 2, 2);

      const qrDataUrl = await fetchAsDataUrl(pngQrUrl);
      doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(20, 20, 20);
      doc.text("Laissez-nous un avis", centerX, qrY + qrSize + 6, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(110, 110, 110);
      doc.text("Scannez ce code pour partager", centerX, qrY + qrSize + 10.5, { align: "center" });
      doc.text("votre expérience en quelques secondes", centerX, qrY + qrSize + 13.5, { align: "center" });

      doc.save(`carte-de-visite-${licenseKey}.pdf`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-gray-100">
      <div>
        <p className="text-sm font-medium text-gray-900">Carte de visite</p>
        <p className="mt-1 text-sm text-gray-400">
          Format standard 85×55mm, recto (coordonnées) et verso (QR Code avis).
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
