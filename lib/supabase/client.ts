import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase pour les Client Components ("use client").
 * Utilise la clé "anon" (publique) — respecte les policies RLS
 * en fonction de l'utilisateur connecté.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
