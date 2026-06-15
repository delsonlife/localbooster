"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Header({ email }: { email: string | null }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/dashboard/login");
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4 sm:px-8">
      <p className="truncate text-sm text-gray-400">{email}</p>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-xl px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
      >
        Déconnexion
      </button>
    </header>
  );
}
