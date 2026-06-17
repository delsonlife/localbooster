import { headers } from "next/headers";
import { getDashboardProfile } from "@/lib/auth";
import QRCodeCard from "@/components/QRCodeCard";
import A5PosterCard from "@/components/A5PosterCard";
import BusinessCardCard from "@/components/BusinessCardCard";
import EmailSignatureCard from "@/components/EmailSignatureCard";

export default async function QrCodePage() {
  const profile = await getDashboardProfile();

  const headersList = headers();
  const host = headersList.get("host") ?? "";

  const protocol = host.includes("localhost") ? "http" : "https";

  const reviewUrl = `${protocol}://${host}/r/${profile.license.license_key}`;
  const pngQrUrl = `/api/qr?key=${profile.license.license_key}&format=png`;

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* En-tête */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[#0c1628] md:text-3xl">
          QR Code &amp; supports marketing
        </h1>
        <p className="text-sm text-[#5a6478] md:text-base">
          Téléchargez vos supports pour collecter des avis facilement.
        </p>
      </div>

      <QRCodeCard
        licenseKey={profile.license.license_key}
        reviewUrl={reviewUrl}
      />

      <A5PosterCard
        licenseKey={profile.license.license_key}
        companyName={profile.license.company_name}
        primaryColor={profile.license.primary_color}
        pngQrUrl={pngQrUrl}
      />

      <BusinessCardCard
        licenseKey={profile.license.license_key}
        companyName={profile.license.company_name}
        primaryColor={profile.license.primary_color}
        pngQrUrl={pngQrUrl}
      />

      <EmailSignatureCard
        companyName={profile.license.company_name}
        primaryColor={profile.license.primary_color}
        reviewLink={reviewUrl}
      />
    </div>
  );
}
