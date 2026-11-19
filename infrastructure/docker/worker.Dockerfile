# ==============================================================================
# MonBilan+ Worker — Dockerfile Multi-Stage Non-Root
# ==============================================================================
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/worker ./apps/worker
COPY prisma ./prisma
RUN npm install && npx prisma generate

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S monbilan && adduser -S monbilan -G monbilan
COPY --from=builder --chown=monbilan:monbilan /app /app
USER monbilan
CMD ["npx", "tsx", "apps/worker/src/main.ts"]
