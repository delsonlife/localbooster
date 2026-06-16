"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Accueil" },
  { href: "/dashboard/reviews", label: "Avis" },
  { href: "/dashboard/feedbacks", label: "Feedbacks" },
  { href: "/dashboard/qr-code", label: "QR Code" },
  { href: "/dashboard/settings", label: "Paramètres" },
  { href: "/dashboard/billing", label: "Abonnement" },
];

export default function Sidebar({ companyName }: { companyName: string }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-[#eef2f8] bg-white md:flex">
      <div className="flex h-full flex-col px-4 py-6">
        {/* Logo / Brand */}
        <div className="px-3 pb-6">
          <p className="text-sm font-semibold tracking-tight text-[#0c1628]">
            LocalPlace<span className="text-[#1a56e8]">Maps</span>
          </p>
        </div>

        {/* Séparateur */}
        <div className="-mx-3 border-t border-[#eef2f8]" />

        {/* Nom de l'entreprise */}
        <div className="px-3 py-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#8d96a8]">
            Entreprise
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-[#0c1628]">
            {companyName}
          </p>
        </div>

        {/* Séparateur */}
        <div className="-mx-3 border-t border-[#eef2f8]" />

        {/* Navigation */}
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#f0f4f9] text-[#0c1628]"
                      : "text-[#5a6478] hover:bg-[#f6f8fa] hover:text-[#0c1628]"
                  }
                `}
              >
                {link.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#1a56e8]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="-mx-3 mt-2 border-t border-[#eef2f8] pt-4">
          <div className="px-3">
            <p className="text-[11px] text-[#8d96a8]">v1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
