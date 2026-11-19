# ==============================================================================
# MonBilan+ Web (Angular) — Dockerfile Multi-Stage Nginx Non-Root
# ==============================================================================
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/web ./apps/web
RUN npm install && npm run build

FROM nginxinc/nginx-unprivileged:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
