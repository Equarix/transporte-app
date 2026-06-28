FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/dtos/package.json ./packages/dtos/
COPY api/package.json ./api/

RUN pnpm install --frozen-lockfile

COPY packages/dtos ./packages/dtos
COPY api ./api

RUN pnpm --filter=@transporte/dtos build
RUN pnpm --filter=@transporte/api build

FROM base AS runner
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/dtos/package.json ./packages/dtos/
COPY api/package.json ./api/

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/packages/dtos/dist ./packages/dtos/dist
COPY --from=builder /app/api/dist ./api/dist

WORKDIR /app/api
RUN mkdir -p uploads

EXPOSE 5000
CMD ["node", "dist/main"]
