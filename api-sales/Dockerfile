FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/dtos/package.json ./packages/dtos/
COPY api-sales/package.json ./api-sales/

RUN pnpm install --frozen-lockfile

COPY packages/dtos ./packages/dtos
COPY api-sales ./api-sales

RUN pnpm --filter=@transporte/dtos build
RUN pnpm --filter=@transporte/sales build

FROM base AS runner
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/dtos/package.json ./packages/dtos/
COPY api-sales/package.json ./api-sales/

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/packages/dtos/dist ./packages/dtos/dist
COPY --from=builder /app/api-sales/dist ./api-sales/dist

WORKDIR /app/api-sales

EXPOSE 5001
CMD ["node", "dist/main"]
