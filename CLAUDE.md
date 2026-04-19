# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the repo root via the Makefile. The Next.js app lives in `src/`.

```bash
make setup          # Start Postgres (Docker), generate auth schema, push DB schema
make dev            # Start dev server (bun --bun next dev)
make build          # Build the application
make check          # TypeScript type check (tsc --noEmit)
make lint           # ESLint
make db-push        # Push schema changes to database
make db-studio      # Open Drizzle Studio
make clean          # Remove node_modules and .next
```

Formatting (run from `src/`):
```bash
bun run fmt         # Prettier write
bun run fmt:check   # Prettier check
```

## Architecture

**Next.js 16 App Router** with Bun runtime, Tailwind CSS v4, TypeScript (strict).

### Database (Drizzle ORM + PostgreSQL)

`src/lib/db/client.ts` selects the database driver at module load time based on `VERCEL=1`:
- **Production (Vercel):** `@neondatabase/serverless` via `drizzle-orm/neon-http`
- **Local dev:** `postgres-js` via `drizzle-orm/postgres-js` against Docker Postgres 17

Schema uses **push workflow** (`drizzle-kit push`), not migrations. The `src/scripts/push-schema.ts` script wraps this for non-interactive CI use.

### Auth (Better Auth)

Auth schema is **code-generated** — `bun run auth:generate` runs `better-auth/cli generate` to produce `src/lib/db/auth-schema.ts`. This must run before builds and schema pushes (automated in `make setup` and `vercel.json` build command).

- `src/lib/auth.ts` — server-side Better Auth config (Drizzle adapter, email/password)
- `src/lib/auth-client.ts` — client-side React hooks (`useSession`, `signIn`, `signUp`, `signOut`)
- `src/lib/auth-helpers.ts` — server-side session utilities (`getCurrentSession`, `requireAuth`)
- `src/app/api/auth/[...all]/route.ts` — Better Auth catch-all API handler

No middleware.ts protecting routes. Auth is checked client-side via `useSession()` in pages, or server-side via `requireAuth()` in API routes.

### Vercel URL Resolution

`src/lib/env.ts` resolves the app base URL with priority: `VERCEL_BRANCH_URL` > `VERCEL_URL` > `NEXT_PUBLIC_SITE_URL` > `localhost:3000`. This makes Better Auth work across preview deployments without manual URL config per branch. `getTrustedOrigins()` automatically includes the current deployment URL.

### App tables

Add application-specific Drizzle tables in `src/lib/db/schema.ts`. It re-exports the auth tables from `auth-schema.ts`.

## Environment Variables

See `src/.env.example`. Required: `POSTGRES_URL`, `BETTER_AUTH_SECRET`.
