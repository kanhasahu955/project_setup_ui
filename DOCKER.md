# Docker – dev / qa / prod

## Quick start

```bash
# Development (Vite dev server, HMR) – http://localhost:5173
docker compose --profile dev up --build

# QA (built app, nginx) – http://localhost:8080
docker compose --profile qa up --build

# Production (built app, nginx) – http://localhost:80
docker compose --profile prod up --build
```

## Stages

| Profile | Service   | Build mode   | Port | Use case        |
|---------|-----------|--------------|------|-----------------|
| `dev`   | app-dev   | —            | 5173 | Local dev, HMR  |
| `qa`    | app-qa    | `--mode qa`  | 8080 | QA / staging    |
| `prod`  | app-prod  | `--mode production` | 80   | Production      |

## Env files

- **.env.dev** – dev (optional; used by `app-dev`)
- **.env.qa** – used at **build** time for QA (`vite build --mode qa`)
- **.env.production** – used at **build** time for prod (`vite build --mode production`)

Use `VITE_*` for variables that must be available in the frontend.

## Build only (no compose)

```bash
# QA image
docker build --target serve --build-arg BUILD_MODE=qa -t live-bhoomi-ui:qa .

# Prod image
docker build --target serve --build-arg BUILD_MODE=production -t live-bhoomi-ui:prod .

# Run
docker run -p 8080:80 live-bhoomi-ui:qa
```
