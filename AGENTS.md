# AGENTS.md — clinical-saas-adm-frontend

Frontend administrativo para la gestión multi-tenant.
Stack: Next.js 16 · TypeScript · TailwindCSS v4 · Shadcn/ui · TanStack Query · Zustand

## Documentación de referencia

- `_plans/16-ADM_FRONTEND_PLAN.md` — Plan de implementación completo
- `_docs/01-DOMAIN_MAP.md` — Mapa de dominios y entidades
- `_plans/14-BFF_ROUTE_PLAN.md` — Endpoints del BFF

## Contexto del ecosistema

Este frontend consume el BFF (`clinical-saas-bff`, puerto 4000).
El BFF a su vez se comunica con 8 microservicios backend.

## Convenciones del proyecto

| Convención | Regla |
| :--- | :--- |
| Nombres de archivo | `kebab-case` |
| Componentes | `PascalCase.tsx` |
| Funciones/variables | `camelCase` |
| Server Components | Default. Sin `'use client'` a menos que sea necesario |
| Client Components | `'use client'` explícito al inicio |
| Fetching | TanStack Query en Client Components; fetch directo en Server Components |
| CSS | TailwindCSS utility classes. Sin CSS modules. |
| Estado global | Zustand. Sin Redux. |
| Rutas dinámicas | `[param]` siempre con `generateMetadata()` |
| Loading states | `loading.tsx` por ruta (skeleton) |
| Error states | `error.tsx` por ruta |
| Empty states | Componente `<EmptyState />` compartido |
| Env vars | `process.env.VAR || 'default'` — nunca cableadas |
