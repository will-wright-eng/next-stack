# next-stack

Full-stack Next.js starter template with auth, database, and Vercel deployment.

## Stack

Next.js 16 (App Router) | Bun | TypeScript | Tailwind CSS v4 | Better Auth | Drizzle ORM | PostgreSQL (Neon) | Vercel

## Getting Started

```bash
# Copy env file and set your secrets
cp src/.env.example src/.env.local

# Start Postgres and push schema
make setup

# Start dev server
make dev
```

## Commands

| Command | Description |
|---------|-------------|
| `make setup` | Start DB, push schema |
| `make dev` | Start dev server |
| `make build` | Build the application |
| `make db-push` | Push schema changes |
| `make db-studio` | Open Drizzle Studio |
| `make check` | Type check |
| `make lint` | Lint |
| `make clean` | Remove node_modules and .next |

## Environment Variables

See [`src/.env.example`](src/.env.example) for required variables. Vercel auto-sets `VERCEL`, `VERCEL_URL`, and `VERCEL_BRANCH_URL` for deployment.
