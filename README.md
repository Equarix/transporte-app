# Monorepo Setup — transporte

## Estructura

```
transporte/
├── api/              ← NestJS
├── dashboard/        ← Vite
├── web/              ← Next.js
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── .env.example
```

---

## Archivos de configuración raíz

### `pnpm-workspace.yaml`

```yaml
packages:
  - "api"
  - "dashboard"
  - "web"
```

### `package.json` raíz

```json
{
  "name": "transporte",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "dotEnv": [".env"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "dotEnv": [".env"]
    },
    "lint": {}
  }
}
```

---

## Variables de entorno

Cada app tiene su propio `.env` — no hay `.env` global compartido.

```
transporte/
├── api/.env
├── dashboard/.env
├── web/.env
└── .env.example    ← en la raíz, documenta todas las variables del proyecto
```

### Convención de prefijos

| Prefijo        | Framework | Accesible en       |
| -------------- | --------- | ------------------ |
| Sin prefijo    | NestJS    | Solo servidor      |
| `NEXT_PUBLIC_` | Next.js   | Servidor + browser |
| `VITE_`        | Vite      | Solo browser       |

### `.env.example` (raíz)

```bash
# === API (NestJS) ===
DATABASE_URL=postgres://user:password@localhost:5432/transporte
JWT_SECRET=supersecret
PORT=3000

# === WEB (Next.js) ===
NEXT_PUBLIC_API_URL=http://localhost:3000

# === DASHBOARD (Vite) ===
VITE_API_URL=http://localhost:3000
```

### Configuración por framework

**NestJS** — lee `api/.env` automáticamente:

```typescript
// api/src/app.module.ts
ConfigModule.forRoot({
  isGlobal: true,
});
```

**Next.js** — lee `web/.env` automáticamente, sin configuración extra.

**Vite** — lee `dashboard/.env` automáticamente, sin configuración extra.

---

## Package.json de cada app

```json
// api/package.json
{
  "name": "@transporte/api",
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "lint": "eslint src"
  }
}
```

```json
// web/package.json
{
  "name": "@transporte/web",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint"
  }
}
```

```json
// dashboard/package.json
{
  "name": "@transporte/dashboard",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint src"
  }
}
```

---

## Comandos frecuentes

```bash
# Levantar todo en paralelo
pnpm dev

# Levantar solo una app
pnpm turbo run dev --filter=@transporte/api
pnpm turbo run dev --filter=@transporte/web
pnpm turbo run dev --filter=@transporte/dashboard

# Instalar un paquete en una app específica
pnpm add <paquete> --filter=@transporte/api
pnpm add <paquete> --filter=@transporte/web
pnpm add <paquete> --filter=@transporte/dashboard

# Instalar como devDependency
pnpm add <paquete> -D --filter=@transporte/api

# Buildear solo lo que cambió
pnpm turbo run build --filter="[HEAD^1]"

# Reinstalar todo desde cero
rm -rf api/node_modules dashboard/node_modules web/node_modules
pnpm install
```

---

## .gitignore recomendado

```bash
# raíz
node_modules
.turbo

# envs — nunca commitear
api/.env
web/.env
dashboard/.env

# builds
api/dist
web/.next
dashboard/dist
```
