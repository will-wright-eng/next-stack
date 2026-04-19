#* Setup
.PHONY: $(shell sed -n -e '/^$$/ { n ; /^[^ .\#][^ ]*:/ { s/:.*$$// ; p ; } ; }' $(MAKEFILE_LIST))
.DEFAULT_GOAL := help

export POSTGRES_URL=postgresql://next_stack:next_stack_dev@localhost:5432/next_stack?sslmode=disable

help: ## list make commands
	@echo "Root commands:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Initial setup (start DB, push schema)
	@echo "Setting up development environment..."
	docker compose down -v
	@docker compose up -d
	@echo "Database started. Waiting for it to be ready..."
	@sleep 3
	cd src && export POSTGRES_URL="$(POSTGRES_URL)" && bun run auth:generate && bun run db:push:ci
	@echo "Setup complete! Run 'make dev' to start the server."

dev: ## Start development server
	cd src && bun run dev

db-up: ## Start PostgreSQL database
	docker compose up -d
	@echo "Database started"

db-push: ## Push database schema changes
	cd src && bun run db:push

db-generate: ## Generate database schema changes
	cd src && bun run db:generate

migrate: ## Run database migrations (generates auth schema and drizzle migrations)
	cd src && \
	bun run db:generate && \
	bun run db:push:ci

vercel-build:
	make clean
	cd src && \
	bun install && \
	bun run auth:generate && \
	bun run db:push:ci && \
	bun run build

db-studio: ## Open Drizzle Studio (database GUI)
	cd src && bun run db:studio

build: ## Build the application
	cd src && bun run build

check: ## Type check the codebase
	cd src && bun run check

lint: ## Lint the codebase
	cd src && bun run lint

clean: ## Clean the project
	rm -rf src/node_modules
	rm -rf src/.next

check-vercel-env: ## Check Vercel environment variables
	bash scripts/check-vercel-env.sh preview
