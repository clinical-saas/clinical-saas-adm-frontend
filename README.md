# clinical-saas-adm-frontend

Admin panel for multi-tenant platform management.
Next.js 16 + TypeScript + TailwindCSS + Shadcn/ui.

## Stack

| Tool | Purpose |
| :--- | :--- |
| Next.js 16 (App Router) | Framework React with Server Components |
| TypeScript | Static typing |
| TailwindCSS v4 | Utility-first CSS |
| Shadcn/ui | Accessible and customizable components |
| TanStack Query v5 | Client-side fetching and cache |
| Zustand v5 | Global state (auth, UI) |
| React Hook Form + Zod | Forms and validation |

## Prerequisites

- Node.js >= 20.x
- npm >= 10.x
- Docker + Docker Compose (optional)
- `clinical-saas-services/` running (BFF + microservices)

## Environment Variables

Copy `.env.example` to `.env.local` and adjust:

```env
NEXT_PUBLIC_BFF_URL=http://localhost:4000
BFF_INTERNAL_URL=http://bff:4000
NEXT_PUBLIC_APP_URL=http://localhost:3011
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3011
```

## Docker

```bash
# Build and start
docker compose up --build

# Or using the shared ecosystem network
docker compose --profile adm-frontend up
```

## Commands

```bash
npm run dev       # Development with hot-reload
npm run build     # Production build
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
npm run test      # Tests (upcoming)
```

## Conventions

See `_docs/18-ADM_FRONTEND_PLAN.md` for the full plan.
