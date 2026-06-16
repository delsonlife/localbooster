"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Header({ 
  email, 
  companyName 
}: { 
  email: string | null;
  companyName: string;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/dashboard/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-10 bg-[#f6f8fa] px-6 py-4 md:px-10 md:py-5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left side: Breadcrumb / Title */}
          <div className="hidden md:block">
            <p className="text-xs font-medium uppercase tracking-wider text-[#8d96a8]">
              Dashboard
            </p>
          </div>

          {/* Right side: User info + Déconnexion */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Avatar + Nom de l'entreprise */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#f0f4f9] flex items-center justify-center text-xs font-medium text-[#5a6478] ring-1 ring-[#eef2f8]">
                {companyName?.charAt(0).toUpperCase() || "?"}
              </div>
              <span className="hidden sm:block text-sm font-medium text-[#0c1628]">
                {companyName}
              </span>
            </div>

            {/* Bouton Déconnexion */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#5a6478] transition-colors hover:bg-[#f0f4f9] hover:text-[#0c1628]"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
