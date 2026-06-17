import { headers } from "next/headers";
import { getDashboardProfile } from "@/lib/auth";
import QRCodeCard from "@/components/QRCodeCard";
import A5PosterCard from "@/components/A5PosterCard";


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

      <BusinessCardCard
        licenseKey={profile.license.license_key}
        companyName={profile.license.company_name}
        primaryColor={profile.license.primary_color}
        pngQrUrl={pngQrUrl}
      />

      <EmailSignatureCard
        companyName={profile.license.company_name}
        primaryColor={profile.license.primary_color}
        reviewUrl={reviewUrl}
      />
    </div>
  );
}
