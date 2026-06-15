import { getDashboardProfile } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getDashboardProfile();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-gray-50 sm:flex-row">
      <Sidebar companyName={profile.license.company_name} />

      <div className="flex flex-1 flex-col">
        <Header email={profile.email} />
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
