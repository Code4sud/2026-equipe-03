# ==============================================================================
# MonBilan+ — Makefile de lancement
#   make            → installe si besoin et lance la WebApp (:4200) + la Landing (:3001)
#   make web        → WebApp Angular seule (http://localhost:4200)
#   make landing    → Landing Next.js seule (http://localhost:3001)
#   make dev        → stack complète : Postgres/Redis + DB + API + Web + Landing
#   make help       → liste de toutes les commandes
# ==============================================================================

SHELL := /bin/bash

# docker compose v2 si dispo, sinon docker-compose v1
COMPOSE := $(shell docker compose version >/dev/null 2>&1 && echo "docker compose" || echo "docker-compose")
COMPOSE_DEV := $(COMPOSE) -f compose.dev.yaml

.DEFAULT_GOAL := front

.PHONY: help check install env front web landing api worker infra infra-down db \
        dev stop build test typecheck docker-up docker-down docker-logs clean re

help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

# ------------------------------------------------------------------------------
# Prérequis & installation
# ------------------------------------------------------------------------------

check: ## Vérifie que Node (>= 20 recommandé) et npm sont installés
	@command -v node >/dev/null 2>&1 || { echo "❌ Node.js introuvable. Installe Node >= 20 (ex: nvm install 20)."; exit 1; }
	@command -v npm  >/dev/null 2>&1 || { echo "❌ npm introuvable (ex: sudo apt install npm, ou nvm install 20)."; exit 1; }
	@node -e 'const [M,m]=process.versions.node.split(".").map(Number); process.exit(M>18||(M===18&&m>=19)?0:1)' || \
		{ echo "❌ Node $$(node -v) trop ancien : minimum 18.19, recommandé 20 (nvm install 20)."; exit 1; }
	@node -e 'process.exit(+process.versions.node.split(".")[0] >= 20 ? 0 : 1)' || \
		echo "⚠️  Node $$(node -v) : le projet recommande Node >= 20 (nvm install 20). On continue…"
	@echo "✅ Node $$(node -v) / npm $$(npm -v)"

node_modules: package.json package-lock.json
	npm install
	@touch node_modules

install: check node_modules ## Installe les dépendances npm (monorepo)

env: ## Crée .env depuis .env.example s'il n'existe pas
	@test -f .env || { cp .env.example .env && echo "✅ .env créé depuis .env.example"; }

# ------------------------------------------------------------------------------
# Lancement individuel
# ------------------------------------------------------------------------------

front: install ## Lance la WebApp (:4200) + la Landing (:3001) en parallèle
	@echo "🚀 Landing http://localhost:3001 · Web http://localhost:4200 — Ctrl+C pour tout arrêter"
	@trap 'kill 0' INT TERM EXIT; 		npm run dev:web & 		npm run dev:landing & 		wait

web: install ## Lance la WebApp Angular (Jeune & Conseiller) sur :4200
	npm run dev:web

landing: install ## Lance la landing Next.js sur :3001
	npm run dev:landing

api: install env ## Lance l'API NestJS (nécessite `make infra db`)
	npm run dev:api

worker: install env ## Lance le worker BullMQ (nécessite `make infra`)
	npm run dev:worker

# ------------------------------------------------------------------------------
# Infrastructure locale (Postgres RLS + Redis)
# ------------------------------------------------------------------------------

infra: ## Démarre Postgres + Redis (compose.dev.yaml) et attend qu'ils soient prêts
	@command -v docker >/dev/null 2>&1 || { echo "❌ Docker introuvable."; exit 1; }
	$(COMPOSE_DEV) up -d --wait

infra-down: ## Arrête Postgres + Redis
	$(COMPOSE_DEV) down

db: install env ## Prisma generate + migrate + seed
	npm run db:setup

# ------------------------------------------------------------------------------
# Stack complète en local (Ctrl+C arrête tous les processus)
# ------------------------------------------------------------------------------

dev: install env infra db ## Lance infra + API + Worker + Web + Landing en parallèle
	@echo "🚀 API :3000 · Web http://localhost:4200 · Landing http://localhost:3001 — Ctrl+C pour tout arrêter"
	@trap 'kill 0' INT TERM EXIT; \
		npm run dev:api & \
		npm run dev:worker & \
		npm run dev:web & \
		npm run dev:landing & \
		wait

stop: infra-down ## Alias : arrête l'infra Docker locale

# ------------------------------------------------------------------------------
# Qualité & build
# ------------------------------------------------------------------------------

build: install ## Build landing + web dans ./dist
	npm run build

test: install ## Lance les tests Vitest
	npm test

typecheck: install ## Vérifie les types de tous les workspaces
	npm run typecheck

# ------------------------------------------------------------------------------
# Stack 100 % conteneurisée (compose.yaml)
# ------------------------------------------------------------------------------

docker-up: env ## Build et lance toute la stack en conteneurs (web sur :4200)
	$(COMPOSE) up -d --build

docker-down: ## Arrête la stack conteneurisée
	$(COMPOSE) down

docker-logs: ## Suit les logs de la stack conteneurisée
	$(COMPOSE) logs -f

# ------------------------------------------------------------------------------
# Nettoyage
# ------------------------------------------------------------------------------

clean: ## Supprime node_modules, dist et caches de build
	rm -rf node_modules apps/*/node_modules packages/*/node_modules \
		dist apps/*/dist apps/web/.angular apps/landing/.next

re: clean front ## Réinstalle tout puis relance WebApp + Landing
