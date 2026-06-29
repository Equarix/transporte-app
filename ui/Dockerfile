FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/dtos/package.json ./packages/dtos/
COPY ui/package.json ./ui/

RUN pnpm install --frozen-lockfile

COPY packages/dtos ./packages/dtos
COPY ui ./ui

RUN pnpm --filter=@transporte/dtos build

ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBikKXSiGiRSQW5UWgCHGfBrLQM9T__Dfg
ARG NEXT_PUBLIC_API_HOTEL=http://localhost:6060/api
ARG NEXT_PUBLIC_API_HOTEL_IMAGES=http://localhost:6060/static

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_API_HOTEL=$NEXT_PUBLIC_API_HOTEL
ENV NEXT_PUBLIC_API_HOTEL_IMAGES=$NEXT_PUBLIC_API_HOTEL_IMAGES

RUN pnpm --filter=ui build

FROM base AS runner
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/dtos/package.json ./packages/dtos/
COPY ui/package.json ./ui/

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/packages/dtos/dist ./packages/dtos/dist
COPY --from=builder /app/ui/.next ./ui/.next
COPY --from=builder /app/ui/public ./ui/public
COPY --from=builder /app/ui/next.config.ts ./ui/

EXPOSE 3000
WORKDIR /app/ui
CMD ["pnpm", "start"]
