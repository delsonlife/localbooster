# SaaS Avis Google — V1

Collecte d'avis clients pour artisans et entreprises locales. Une licence = un lien
(`/r/VOTRE_CODE`) à mettre sur un QR Code ou une carte. 4-5★ redirige directement
vers l'avis Google, 1-3★ affiche un formulaire de feedback envoyé par email.

## 1. Installation

```bash
npm install
```

## 2. Variables d'environnement

Copier `.env.example` vers `.env.local` et compléter :

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `SUPABASE_URL` | URL du projet Supabase (Project Settings > API) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé "service_role" (Project Settings > API) — **secrète, jamais exposée au client** |
| `RESEND_API_KEY` | Clé API Resend (resend.com > API Keys) |
| `RESEND_FROM_EMAIL` | Adresse expéditeur vérifiée sur Resend |

## 3. Base de données Supabase

Dans le Dashboard Supabase > **SQL Editor**, exécuter le contenu de
`supabase/schema.sql`. Cela crée les tables `licenses`, `ratings`, `feedbacks`
et insère une licence de test (`ABC123`).

Pour créer une licence pour un nouveau client :

```sql
insert into licenses (license_key, company_name, company_email, google_review_url, primary_color)
values ('CODE_UNIQUE', 'Nom Entreprise', 'email@entreprise.fr', 'https://g.page/r/XXXX/review', '#2563eb');
```

Le lien à donner au client est alors : `https://votredomaine.com/r/CODE_UNIQUE`

## 4. Lancer en local

```bash
npm run dev
```

Tester sur : `http://localhost:3000/r/ABC123`

## 5. Déploiement sur Vercel

1. Pousser le projet sur un repo Git (GitHub/GitLab/Bitbucket).
2. Sur [vercel.com](https://vercel.com), cliquer **Add New > Project** et importer le repo.
3. Dans **Settings > Environment Variables**, ajouter les 4 variables listées
   ci-dessus (mêmes valeurs que `.env.local`).
4. Déployer.

Aucune configuration supplémentaire n'est nécessaire : Next.js 15 (App Router)
est détecté automatiquement par Vercel.

## Structure du projet

```
app/
├── r/[license]/page.tsx     # Page publique d'avis (server component)
├── api/license/route.ts     # GET  /api/license?key=XXX
├── api/rating/route.ts      # POST /api/rating
├── api/feedback/route.ts    # POST /api/feedback
├── layout.tsx                # Police Inter, layout global
└── page.tsx                  # Page racine (placeholder)

components/
├── ReviewWidget.tsx          # Orchestration étoiles → redirection ou formulaire
├── StarRating.tsx            # Composant étoiles réutilisable
└── FeedbackForm.tsx           # Formulaire de feedback (1-3★)

lib/
├── supabase.ts               # Client Supabase (service role, serveur uniquement)
└── resend.ts                 # Client Resend (serveur uniquement)

supabase/schema.sql           # Tables + index + licence de test
```

## Notes

- Le champ `primary_color` (table `licenses`) permet de personnaliser la
  couleur du bouton/focus du formulaire de feedback par entreprise, sans
  toucher au code.
- Les clés Supabase et Resend ne sont utilisées que côté serveur (Server
  Components et Route Handlers) et ne sont jamais envoyées au navigateur.
