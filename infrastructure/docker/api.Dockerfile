# ==============================================================================
# MonBilan+ API — Dockerfile Multi-Stage Non-Root
# ==============================================================================
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/api ./apps/api
COPY prisma ./prisma
RUN npm install && npx prisma generate

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S monbilan && adduser -S monbilan -G monbilan
COPY --from=builder --chown=monbilan:monbilan /app /app
USER monbilan
EXPOSE 3000
CMD ["npx", "tsx", "apps/api/src/main.ts"]
