# ---------------------------
# Stage 1: Dependencies (used for dev + build)
# ---------------------------
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile

# ---------------------------
# Stage 2: Build (qa / prod)
# ---------------------------
FROM deps AS builder
ARG BUILD_MODE=production
ENV NODE_ENV=production
COPY . .
RUN pnpm run build -- --mode "$BUILD_MODE"

# ---------------------------
# Stage 3: Serve (qa / prod) – nginx
# ---------------------------
FROM nginx:alpine AS serve
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
