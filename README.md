# Clinical SaaS Admin Frontend

Panel de administración multi-tenant. Next.js 16 + TypeScript + TailwindCSS + Shadcn/ui.

## Stack

| Herramienta | Versión | Propósito |
| :--- | :--- | :--- |
| Next.js | 16.x (App Router) | Framework con Server Components |
| React | 19.x | UI library |
| TailwindCSS | ^4.x | Utility-first CSS |
| Shadcn/ui | latest | Componentes UI accesibles |
| TanStack Query | ^5.x | Cache y fetching del servidor |
| Zustand | ^5.x | Estado global (auth, UI) |
| React Hook Form | ^7.x | Formularios |
| Zod | ^4.x | Validación de schemas |

## Puerto

**3011** — Configurado via `PORT` env var y script `dev`.

> El puerto 3011 está reservado para este frontend. NO usar 3000 (frontend cliente) ni 3001 (Document Engine). Ver `_docs/13-ENV_VARS_REFERENCE.md`.

### Importante

`npm run dev` ejecuta `next dev -p 3011`. No usar `next dev` sin puerto explícito — Next.js default es 3000, que colisiona con el frontend cliente y no coincide con `CORS_ORIGIN_ADM` del BFF.

## Convenciones

### Regla #1 — Sin valores cableados

Ninguna variable de entorno se cablea en el código. Siempre `process.env.VAR || 'default'`.

### Regla #2 — Comunicación exclusiva via BFF

El frontend SIEMPRE habla con el BFF (`http://localhost:4000/api`), NUNCA directamente con microservicios. El BFF es el único boundary de seguridad (ver `_docs/29-DECISION_LOG.md` D005).

### Regla #3 — Auth via cookies httpOnly

El login se hace POST `/api/auth/login` al BFF. El BFF devuelve `access_token` y `refresh_token` como cookies httpOnly. El frontend NO maneja JWT directamente — solo lee `user` y `tenantId` de la respuesta, y el browser envía las cookies automáticamente.

### Regla #4 — CORS

El BFF está configurado con `CORS_ORIGIN_ADM=http://localhost:3011`. Si el frontend no corre en 3011, el CORS se bloquea. El script `dev` ya usa `-p 3011`.

En Docker, el `NEXT_PUBLIC_BFF_URL` cambia a `http://bff:4000/api` (Docker network).

### Regla #5 — Client Components vs Server Components

- Server Components por default (sin `'use client'`)
- Client Components solo cuando se necesita `useState`, `useEffect`, `onClick`, etc.
- Auth forms, data tables, sidebar: Client Components
- Layouts, páginas de listado con fetch: Server Components

### Regla #6 — Puertos del ecosistema

| Puerto | Servicio |
| :----: | :------- |
| 3000 | Frontend cliente (Next.js) |
| 3001 | Document Engine |
| 3004 | Service Order |
| 3005 | Auth |
| 3006 | Inventory |
| 3007 | Service Catalog |
| 3008 | Service Provider |
| 3009 | Organization |
| 3010 | Access Control |
| **3011** | **Admin Frontend (este servicio)** |
| 4000 | BFF |
| 5432 | PostgreSQL |
| 9092 | Kafka |

## Variables de entorno

```env
# BFF (obligatoria)
NEXT_PUBLIC_BFF_URL=http://localhost:4000/api

# Next.js (obligatoria)
NEXT_PUBLIC_APP_URL=http://localhost:3011

# Auth server-side (Docker)
BFF_INTERNAL_URL=http://bff:4000/api

# Feature flags
NEXT_PUBLIC_ENABLE_SIGNUP=false
NEXT_PUBLIC_ENABLE_TENANT_CREATION=true
```

> Referencia completa: `_docs/13-ENV_VARS_REFERENCE.md`.

## Estructura del proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login, recovery, signup, select-tenant
│   ├── (dashboard)/        # Layout con TopBar + LeftSidebar + SettingsDrawer
│   └── api/                # Next.js API routes (solo proxy si necesario)
├── components/             # UI components (shadcn, layout, shared)
├── features/               # Feature modules por dominio
├── hooks/                  # Custom hooks (use-debounce, use-logout, use-media-query)
├── lib/
│   ├── api/client.ts       # HTTP client con auth headers
│   ├── api/queries/        # TanStack Query key factory
│   └── auth/               # Auth context
├── stores/auth.ts          # Zustand store (auth state + localStorage)
└── types/                  # Tipos globales
```

## Comandos

```bash
npm run dev          # Desarrollo en puerto 3011
npm run build        # Build de producción
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

## Docker

```bash
docker compose up --build                              # Build y start
docker compose --profile adm-frontend up               # Con perfil
```

## Documentación relevante

| Documento | Contenido |
| :--- | :--- |
| `_docs/00-INDICE.md` | Índice general del ecosistema |
| `_docs/13-ENV_VARS_REFERENCE.md` | Referencia completa de env vars |
| `_plans/16-ADM_FRONTEND_PLAN.md` | Plan de implementación completo (67 páginas) |
| `_plans/18-FRONTEND_AUTH_PLAN.md` | Plan de auth en frontends (cookies, guards) |
| `_docs/25-TECHNICAL_LIMITATIONS.md` | Limitaciones técnicas |
| `_docs/29-DECISION_LOG.md` | Decisiones arquitectónicas |
| `CLAUDE.md` | Instrucciones para agentes AI |