import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase côté serveur uniquement.
 * Utilise la clé "service role" : NE JAMAIS importer ce fichier
 * dans un composant client ni l'exposer au navigateur.
 */
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
