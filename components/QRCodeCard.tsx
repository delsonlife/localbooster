"use client";

import { useState } from "react";

interface QRCodeCardProps {
  licenseKey: string;
  reviewUrl: string;
}

export default function QRCodeCard({ licenseKey, reviewUrl }: QRCodeCardProps) {
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const pngUrl = `/api/qr?key=${licenseKey}&format=png`;
  const pngDownloadUrl = `/api/qr?key=${licenseKey}&format=png&download=1`;
  const svgDownloadUrl = `/api/qr?key=${licenseKey}&format=svg&download=1`;

  const handlePdfDownload = async () => {
    setGeneratingPdf(true);

    try {
      const { jsPDF } = await import("jspdf");

      const response = await fetch(pngUrl);
      const blob = await response.blob();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const qrSize = 100;
      const x = (pageWidth - qrSize) / 2;

      doc.setFontSize(16);
      doc.text("Votre avis compte", pageWidth / 2, 30, { align: "center" });
      doc.addImage(dataUrl, "PNG", x, 45, qrSize, qrSize);
      doc.setFontSize(11);
      doc.text(reviewUrl, pageWidth / 2, 45 + qrSize + 10, { align: "center" });

      doc.save(`qr-${licenseKey}.pdf`);
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-soft ring-1 ring-gray-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pngUrl}
        alt="QR Code vers la page d'avis"
        width={200}
        height={200}
        className="h-48 w-48 rounded-xl"
      />

      <p className="break-all text-center text-sm text-gray-400">{reviewUrl}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={pngDownloadUrl}
          download
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          PNG
        </a>

        <a
          href={svgDownloadUrl}
          download
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          SVG
        </a>

        <button
          type="button"
          onClick={handlePdfDownload}
          disabled={generatingPdf}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
        >
          {generatingPdf ? "Génération..." : "PDF"}
        </button>
      </div>
    </div>
  );
}
