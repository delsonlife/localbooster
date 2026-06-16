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
    <div className="flex min-h-[100dvh] bg-[#f6f8fa]">
      <Sidebar companyName={profile.license.company_name} />

      <div className="flex flex-1 flex-col min-w-0">
        <Header 
          email={profile.email} 
          companyName={profile.license.company_name} 
        />
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
