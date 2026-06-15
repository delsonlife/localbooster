import { headers } from "next/headers";
import { getDashboardProfile } from "@/lib/auth";
import SettingsForm from "@/components/SettingsForm";

export default async function SettingsPage() {
  const profile = await getDashboardProfile();

  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const reviewUrl = `${protocol}://${host}/r/${profile.license.license_key}`;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-gray-900">Paramètres</h1>

      <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-gray-100">
        <p className="text-sm text-gray-400">Votre lien d&apos;avis</p>
        <p className="mt-1 break-all text-sm font-medium text-gray-900">
          {reviewUrl}
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Code licence : {profile.license.license_key}
        </p>
      </div>

      <SettingsForm license={profile.license} />
    </div>
  );
}
