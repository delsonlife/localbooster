import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase pour les Server Components et Route Handlers.
 * Utilise la clé "anon" + les cookies de session de l'utilisateur
 * connecté : les requêtes respectent les policies RLS et ne
 * retournent que les données de sa licence.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll appelé depuis un Server Component : on peut ignorer,
            // le middleware se charge de rafraîchir la session.
          }
        },
      },
    }
  );
}
