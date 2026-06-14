@AGENTS.md

This project is an admin panel for multi-tenant platform management.
Built with Next.js 16 App Router, TailwindCSS v4, Shadcn/ui.

Key paths:
- `_docs/18-ADM_FRONTEND_PLAN.md` — full implementation plan
- BFF at `NEXT_PUBLIC_BFF_URL` (default: http://localhost:4000/api)
- Port 3011 (configurable via ADM_PORT)

Commands:
- `npm run dev` — hot-reload dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx tsc --noEmit` — typecheck
