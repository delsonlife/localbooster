import { headers } from "next/headers";
import { getDashboardProfile } from "@/lib/auth";
import QRCodeCard from "@/components/QRCodeCard";
import A5PosterCard from "@/components/A5PosterCard";
// import BusinessCardCard from "@/components/BusinessCardCard"; ← TEMPORAIREMENT COMMENTÉ
// import EmailSignatureCard from "@/components/EmailSignatureCard"; ← TEMPORAIREMENT COMMENTÉ

export default async function QrCodePage() {
  const profile = await getDashboardProfile();

  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const reviewUrl = `${protocol}://${host}/r/${profile.license.license_key}`;
  const pngQrUrl = `/api/qr?key=${profile.license.license_key}&format=png`;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">QR Code &amp; supports marketing</h1>

      <QRCodeCard licenseKey={profile.license.license_key} reviewUrl={reviewUrl} />

      <A5PosterCard
        licenseKey={profile.license.license_key}
        companyName={profile.license.company_name}
        primaryColor={profile.license.primary_color}
        pngQrUrl={pngQrUrl}
      />

      {/* BusinessCardCard temporairement retiré */}
      {/* 
      <BusinessCardCard
        licenseKey={profile.license.license_key}
        companyName={profile.license.company_name}
        primaryColor={profile.license.primary_color}
        pngQrUrl={pngQrUrl}
      />
      */}

      {/* EmailSignatureCard temporairement retiré */}
      {/*
      <EmailSignatureCard
        companyName={profile.license.company_name}
        primaryColor={profile.license.primary_color}
        reviewUrl={reviewUrl}
      />
      */}

      {/* Message informatif (optionnel) */}
      <div className="rounded-xl border border-[#eef2f8] bg-[#fafcff] p-4 text-center">
        <p className="text-sm text-[#5a6478]">
          🔧 Supports supplémentaires disponibles prochainement.
        </p>
        <p className="text-xs text-[#8d96a8] mt-1">
          (Carte de visite et signature email)
        </p>
      </div>
    </div>
  );
}
