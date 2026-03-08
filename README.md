# CVpass — Optimisation de CV par IA

Optimisez votre CV pour les systèmes ATS en 4 étapes : uploadez votre CV, collez une offre d'emploi, acceptez les suggestions IA en 1 clic, téléchargez le PDF optimisé.

## Stack technique

| Composant | Technologie |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Auth | Clerk |
| Base de données | Supabase (PostgreSQL) |
| IA | OpenAI GPT-4o mini |
| PDF parsing | pdf-parse (PDF), mammoth (DOCX) |
| PDF generation | @react-pdf/renderer |
| Déploiement | Vercel |

## Démarrage local

### Prérequis

- Node.js 18+
- Comptes créés sur : [Clerk](https://clerk.com), [Supabase](https://supabase.com), [OpenAI](https://platform.openai.com)

### Installation

```bash
git clone <votre-repo>
cd app
npm install
cp .env.example .env.local
```

Remplissez `.env.local` avec vos clés API.

### Base de données Supabase

Dans le dashboard Supabase → SQL Editor, exécutez le contenu de :
```
supabase/migrations/001_analyses.sql
```

### Lancement

```bash
npm run dev
# Application disponible sur http://localhost:3000
```

### Tests

```bash
npm test
```

## Déploiement sur Vercel

1. Poussez votre code sur GitHub
2. Connectez le repo sur [vercel.com](https://vercel.com)
3. Configuration :
   - **Framework Preset** : Next.js
   - **Root Directory** : `app/`
4. Ajoutez toutes les variables d'environnement de `.env.example` dans les settings Vercel
5. Déployez

## Variables d'environnement

Voir `.env.example` pour la liste complète. Variables requises :

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` — Dashboard Clerk
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` — Dashboard Supabase → Settings → API
- `OPENAI_API_KEY` — platform.openai.com → API Keys

## Architecture RGPD

- Les CVs uploadés sont traités **en mémoire uniquement** (Zustand)
- **Aucun CV n'est stocké** en base de données
- Seules les métadonnées d'analyse (scores, nb suggestions) sont persistées dans Supabase
- Les CVs sont transmis à OpenAI API pour analyse (OpenAI n'utilise pas les données API pour l'entraînement)

## Structure du projet

```
app/
├── app/
│   ├── (auth)/login/      # Page connexion Clerk
│   ├── (auth)/signup/     # Page inscription Clerk
│   ├── dashboard/         # Upload CV + saisie offre
│   ├── results/           # Résultats + éditeur suggestions
│   ├── mentions-legales/  # Page légale RGPD
│   └── api/
│       ├── parse-cv/      # Extraction texte PDF/DOCX
│       ├── analyze/       # Analyse IA GPT-4o mini
│       ├── generate-pdf/  # Génération PDF optimisé
│       └── save-analysis/ # Sauvegarde métadonnées Supabase
├── components/
│   ├── ui/                # Button, Badge, Card
│   ├── pdf/               # CVDocument (@react-pdf/renderer)
│   ├── UploadZone.tsx
│   ├── ScoreCircle.tsx
│   ├── SuggestionCard.tsx
│   └── CVPreview.tsx
└── lib/
    ├── store.ts           # Zustand store (état global)
    ├── openai.ts
    ├── supabase.ts
    └── parse-document.ts
```
