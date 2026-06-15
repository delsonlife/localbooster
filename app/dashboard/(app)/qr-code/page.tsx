import { headers } from "next/headers";
import { getDashboardProfile } from "@/lib/auth";
import QRCodeCard from "@/components/QRCodeCard";

export default async function QrCodePage() {
  const profile = await getDashboardProfile();

  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const reviewUrl = `${protocol}://${host}/r/${profile.license.license_key}`;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">QR Code</h1>
      <QRCodeCard licenseKey={profile.license.license_key} reviewUrl={reviewUrl} />
    </div>
  );
}
