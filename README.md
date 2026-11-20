# Équipe 03 — MonBilan+ (Hackathon Azuréen #3)

Projet réalisé à Nice les 18, 19 et 20 novembre 2026, sur le thème **« L'orientation et l'employabilité grâce à l'IA »**, organisé par [Code4Sud](https://code4sud.fr).

**Équipe :** Bastien Ozil, Mathilde Poirier, Saidou Yaya Diallo, Enzo Sarfati, Farimzhara Dambly, William Baghdadi.  
**Écoles :** 42 Nice, Centrale Méditerranée

## Le projet

**« Comprends ton bilan. Explore tes possibles. Passe à l'action. »**  
*MonBilan+ aide les jeunes à mieux se connaître et à construire leur avenir. Grâce à des audios de 2 minutes, ils comprennent leur bilan d'orientation, explorent les métiers et passent à l'action, à leur rythme, seuls ou accompagnés par un conseiller.*

- **Constat & Problème :** Au Centre des Possibles, un jeune reçoit un Rapport des Possibles de 17 pages présentant sa personnalité, ses centres d'intérêt, ses aptitudes et différentes pistes professionnelles. Malgré la richesse de ce document et l'entretien de 15 minutes avec un professionnel, certaines données restent difficiles à retenir, à comprendre ou à transformer en démarches concrètes. Le défi n'est donc pas seulement de produire un bilan : c'est de permettre au jeune de se l'approprier et de passer à l'action.
- **Solution MonBilan+ :** Une plateforme d'orientation qui accompagne le jeune de la compréhension de ses résultats jusqu'à la construction de ses prochaines étapes. Deux expériences complémentaires :
  1. **Comprendre son bilan** (pour les jeunes avec Rapport des Possibles) : audios courts de 2 min, vulgarisation bienveillante, transcriptions accessibles, références directes aux pages du rapport (dossier Emma Dubois, Rdv 2187), espace questions pour le conseiller, et validation obligatoire par un professionnel avant publication.
  2. **Explorer et passer à l'action** (avec ou sans rapport préalable) : découverte sans pression des métiers, immersion professionnelle locale (Côte d'Azur / 06), annuaire de support et suivi d'objectifs.
- **IA éthique & Supervision humaine :** L'IA est un outil pédagogique facilitant la reformulation et l'accessibilité. Elle ne réalise aucun nouveau diagnostic psychométrique et ne remplace ni le psychologue ni le conseiller. Zéro hallucination, traçabilité documentaire absolue et conformité RGPD stricte.

## Lancer le projet

**Prérequis :** Node.js ≥ 20 et npm. Docker est nécessaire uniquement pour la base de données, l'API et le worker (`make dev`, `make infra`, `make docker-up`).

### Avec le Makefile (recommandé)

```bash
make          # installe les dépendances si besoin, puis lance la WebApp + la Landing
make help     # affiche toutes les commandes disponibles
```

Une fois lancé : Landing page sur http://localhost:3001 · WebApp (Espace Jeune & Conseiller) sur http://localhost:4200. `Ctrl+C` arrête tout.

**Lancer une partie du projet**

| Commande | Ce qu'elle fait |
|---|---|
| `make` (ou `make front`) | WebApp (:4200) + Landing (:3001) en parallèle |
| `make web` | WebApp Angular seule (:4200) |
| `make landing` | Landing Next.js seule (:3001) |
| `make api` | API NestJS (nécessite `make infra db`) |
| `make worker` | Worker BullMQ (nécessite `make infra`) |
| `make dev` | Stack complète : Postgres/Redis (Docker) + base de données + API + Worker + WebApp + Landing |

**Infrastructure & base de données**

| Commande | Ce qu'elle fait |
|---|---|
| `make infra` | Démarre Postgres + Redis (`compose.dev.yaml`) |
| `make infra-down` (ou `make stop`) | Arrête Postgres + Redis |
| `make db` | Prisma : génération du client, migrations et données de démo |
| `make docker-up` | Lance toute la stack en conteneurs (`compose.yaml`) |
| `make docker-down` | Arrête la stack conteneurisée |
| `make docker-logs` | Suit les logs des conteneurs |

**Installation, qualité & build**

| Commande | Ce qu'elle fait |
|---|---|
| `make check` | Vérifie les versions de Node et npm |
| `make install` | Installe les dépendances npm du monorepo |
| `make env` | Crée `.env` à partir de `.env.example` s'il n'existe pas |
| `make build` | Build de la Landing + de la WebApp dans `./dist` |
| `make test` | Lance les tests Vitest |
| `make typecheck` | Vérifie les types de tous les workspaces |
| `make clean` | Supprime `node_modules`, `dist` et les caches de build |
| `make re` | Nettoie tout, réinstalle et relance WebApp + Landing |

### Sans Makefile (manuellement)

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
