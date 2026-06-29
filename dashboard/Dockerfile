FROM node:20-alpine AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/dtos/package.json ./packages/dtos/
COPY dashboard/package.json ./dashboard/

RUN pnpm install --frozen-lockfile

COPY packages/dtos ./packages/dtos
COPY dashboard ./dashboard

RUN pnpm --filter=@transporte/dtos build

ARG VITE_API_URL=http://localhost:5000/api
ARG VITE_API_GOOGLE_MAPS=AIzaSyBikKXSiGiRSQW5UWgCHGfBrLQM9T__Dfg
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_GOOGLE_MAPS=$VITE_API_GOOGLE_MAPS

RUN pnpm --filter=@transporte/dashboard build

FROM nginx:alpine
COPY --from=builder /app/dashboard/dist /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
