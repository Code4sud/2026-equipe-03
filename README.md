# Équipe 03 — MonBilan+ (Hackathon Azuréen #3)

Projet réalisé à Nice les 18, 19 et 20 novembre 2026, sur le thème **« L'orientation et l'employabilité grâce à l'IA »**, organisé par [Code4Sud](https://code4sud.fr).

**Équipe :** Bastien Ozil, Mathilde Poirier, Saidou Yaya Diallo, Enzo Sarfati, Farimzhara Dambly, William Baghdadi.  
**Écoles :** 42 Nice, Centrale Méditerranée

## Le projet

**« Ton bilan d'orientation, enfin facile à comprendre. »**  
*Signature : « Comprends ton bilan. Explore tes possibles. »*

- **Constat & Problème :** Le jeune ou l'étudiant (15-25 ans) repart avec un rapport PDF dense de 17 pages de graphiques (RIASEC, aptitudes cognitives, HEXACO, métiers par zones) et le souvenir d'un entretien de 15 minutes. Une semaine plus tard, l'essentiel est souvent oublié, en particulier chez les jeunes fâchés avec l'écrit.
- **Solution MonBilan+ :** Nous faisons en sorte que ce bilan soit un véritable tremplin interactif vers un projet professionnel qui a du sens. MonBilan+ transforme le rapport existant en une expérience audio et interactive avec explications simples, sources vérifiables aux pages du rapport et exploration sans pression de pistes de métiers.
- **Garantie Zéro-Hallucination & Supervision :** Le Centre des Possibles réalise l'orientation. MonBilan+ valorise et restitue le bilan existant. Chaque restitution est systématiquement vérifiée et validée par un professionnel avant mise à disposition du jeune.

## Lancer le projet

Avec le Makefile :

```bash
make          # installe les dépendances et lance la WebApp sur http://localhost:4200
make dev      # stack complète : Postgres/Redis (Docker) + DB + API + Worker + Web + Landing
make help     # toutes les commandes
```

Ou manuellement :

```bash
cp .env.example .env && npm install
docker-compose -f compose.dev.yaml up -d
npm run db:setup && npm run dev:api
npm run dev:landing   # Landing page Next.js sur http://localhost:3001
npm run dev:web       # WebApp Angular (Jeune & Conseiller) sur http://localhost:4200
```

## Architecture du Monorepo

Consultez [`ARCHITECTURE.md`](./ARCHITECTURE.md) et [`docs/architecture/DESIGN_SYSTEM.md`](./docs/architecture/DESIGN_SYSTEM.md) :
- **`apps/landing` (Next.js 14 App Router + TypeScript strict + Tailwind CSS)** : Landing page officielle alignée sur le Sujet 1, exportée statiquement à la racine `./dist/`.
- **`apps/web` (Angular 18 + Tailwind CSS)** :
  - **Espace Jeune (6 rubriques)** : *Accueil, Mon bilan, Explorer les métiers (les 22 métiers du rapport 2187 sur 5 zones), Mon parcours, Mes questions, Mes documents*.
  - **Espace Conseiller (8 rubriques)** : *Tableau de bord, Dossiers jeunes, Importation de rapport, Vérification des données, Validation et publication, Suivi et rendez-vous, Statistiques, Paramètres*.
- **`apps/api` (NestJS Modular Monolith)** : 12 modules Clean Architecture & DDD, isolation Multi-Tenant stricte via **PostgreSQL Row-Level Security (`FORCE RLS`)**.
- **`apps/worker` (BullMQ)** : Workers asynchrones d'extraction PDF, de génération LLM locale (`Ollama / Qwen`) et de synthèse vocale (`Piper TTS`).

## Publier sur le site du hackathon

1. Complétez `projet.json` (nom, pitch, description, écoles, technologies, liens).
2. Ajoutez vos captures dans `captures/` et listez-les dans `projet.json`.
3. Poussez sur `main` : votre fiche apparaît sur https://orientation.code4sud.fr/projets/equipe-03 en moins d'une minute.

Toute la doc : https://orientation.code4sud.fr/doc/

## Démo en ligne

À chaque push sur `main`, le workflow GitHub Pages exécute `npm ci && npm run build` et publie `./dist` :
- **Landing page Next.js** : `https://code4sud.github.io/2026-equipe-03/`
- **Application interactive (Espace Jeune & Conseiller — Rapport 2187)** : `https://code4sud.github.io/2026-equipe-03/app/`

## Licence

Projet développé dans le cadre du Hackathon Azuréen #3 sous licence MIT.
