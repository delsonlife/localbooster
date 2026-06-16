"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function Header({ email }: { email: string | null }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/dashboard/login");
    router.refresh();
  };

  const handleToggle = () => setIsOpen(!isOpen);

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

          {/* Right side: User menu */}
          <div className="flex items-center gap-3 ml-auto">
            {/* User avatar + email (visible desktop) */}
            <div className="hidden items-center gap-3 sm:flex">
              <div className="h-8 w-8 rounded-full bg-[#f0f4f9] flex items-center justify-center text-xs font-medium text-[#5a6478] ring-1 ring-[#eef2f8]">
                {email?.charAt(0).toUpperCase() || "?"}
              </div>
              <span className="text-sm text-[#5a6478]">
                {email}
              </span>
            </div>

            {/* Dropdown button */}
            <button
              type="button"
              onClick={handleToggle}
              className="flex items-center gap-1 rounded-xl px-2 py-1.5 text-sm font-medium text-[#5a6478] transition-colors hover:bg-[#f0f4f9] hover:text-[#0c1628]"
            >
              <span className="hidden sm:inline">Compte</span>
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute right-6 mt-3 w-56 rounded-2xl border border-[#eef2f8] bg-white shadow-lg shadow-[#0c1628]/5 md:right-10">
            <div className="p-2">
              {/* Email affiché dans le dropdown */}
              <div className="px-3 py-2 border-b border-[#eef2f8]">
                <p className="text-xs font-medium uppercase tracking-wider text-[#8d96a8]">
                  Connecté en tant que
                </p>
                <p className="mt-1 text-sm font-medium text-[#0c1628] truncate">
                  {email}
                </p>
              </div>

              {/* Bouton déconnexion */}
              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#5a6478] transition-colors hover:bg-[#f6f8fa] hover:text-[#0c1628]"
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
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
