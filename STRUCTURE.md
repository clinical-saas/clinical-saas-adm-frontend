# Estructura — clinical-saas-adm-frontend

Frontend administrativo basado en **Next.js 15 App Router + shadcn/ui + Zustand**.

## Árbol de Directorios

```
src/
├── middleware.ts                  # Next.js middleware (auth, redirects)
├── app/                          # App Router (rutas + layouts)
│   ├── layout.tsx                # Layout raíz
│   ├── globals.css               # Estilos globales
│   ├── page.tsx                  # Página de inicio
│   ├── error.tsx                 # Error boundary global
│   ├── loading.tsx               # Loading global
│   ├── not-found.tsx             # 404
│   ├── (auth)/                   # Grupo de rutas públicas (sin sidebar)
│   │   ├── layout.tsx
│   │   ├── login/
│   │   ├── signup/
│   │   ├── recovery/
│   │   └── select-tenant/
│   └── (dashboard)/              # Grupo de rutas protegidas (con sidebar)
│       ├── layout.tsx
│       ├── dashboard/
│       ├── business-partners/
│       ├── catalog/
│       ├── document-engine/
│       ├── organization/
│       ├── service-orders/
│       └── settings/
├── components/                   # Componentes compartidos
│   ├── ui/                       # Atomicos shadcn/ui (button, dialog, form, table, etc.)
│   ├── layout/                   # left-sidebar, top-bar, settings-drawer
│   ├── shared/                   # confirm-dialog, empty-state, page-header, specialist-form
│   ├── auth/                     # auth-guard, root-redirect
│   ├── data-table/               # data-table genérico
│   ├── forms/                    # Formularios reutilizables
│   └── providers.tsx             # Providers globales
├── features/                     # Configuración por feature de dominio
│   ├── auth/
│   ├── business-partners/
│   │   └── sidebar-config.ts
│   ├── catalog/
│   │   └── sidebar-config.ts
│   ├── customers/
│   ├── document-engine/
│   │   └── sidebar-config.ts
│   ├── inventory/
│   ├── organization/
│   │   └── sidebar-config.ts
│   ├── service-catalog/
│   ├── service-orders/
│   │   └── sidebar-config.ts
│   ├── settings/
│   └── specialists/
├── hooks/                        # Custom hooks globales
│   ├── use-debounce.ts
│   ├── use-logout.ts
│   └── use-media-query.ts
├── lib/                          # Lógica de infraestructura
│   ├── utils.ts
│   ├── api/
│   │   ├── client.ts             # Cliente HTTP
│   │   ├── queries/              # React Query queries
│   │   └── mutations/            # React Query mutations
│   └── auth/                     # Helpers de autenticación
├── stores/                       # Estado global (Zustand)
│   └── auth.ts
└── types/                        # Tipos compartidos
    └── index.ts
```

## Guía de Referencia Rápida

| Quiero... | Voy a... |
|-----------|----------|
| Agregar/editar una vista/página | `src/app/(dashboard)/<ruta>/` (crear `page.tsx`) |
| Agregar una opción de menú (sidebar) | Editar `src/features/<dominio>/sidebar-config.ts` |
| Agregar un nuevo feature/dominio | Crear `src/app/(dashboard)/<feature>/` + `src/features/<feature>/sidebar-config.ts` |
| Agregar un componente de UI nuevo | `src/components/ui/` (shadcn) o `src/components/shared/` |
| Agregar un query/mutation de API | `src/lib/api/queries/` o `src/lib/api/mutations/` |
| Agregar un custom hook | `src/hooks/` |
| Modificar el store global | `src/stores/` |
| Modificar el layout del dashboard | `src/app/(dashboard)/layout.tsx` |
| Modificar guards de autenticación | `src/components/auth/` y `src/middleware.ts` |
| Tipos compartidos con la API | `src/types/` |
