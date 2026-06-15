import { Resend } from "resend";

/**
 * Client Resend côté serveur uniquement.
 * NE JAMAIS importer ce fichier dans un composant client.
 */
export const resend = new Resend(process.env.RESEND_API_KEY);
