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
    <aside className="border-b border-gray-100 bg-white sm:w-60 sm:flex-shrink-0 sm:border-b-0 sm:border-r">
      <div className="px-4 py-4 sm:px-4 sm:py-6">
        <p className="mb-3 truncate text-sm font-semibold text-gray-900 sm:mb-8">
          {companyName}
        </p>

        <nav className="flex gap-1 overflow-x-auto pb-1 sm:flex-col sm:overflow-visible sm:pb-0">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-gray-100 font-medium text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
