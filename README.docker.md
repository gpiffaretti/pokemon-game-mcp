# Docker Setup Guide

## Quick Start

1. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Start the services:**
   ```bash
   docker-compose up -d
   ```

3. **Check the logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop the services:**
   ```bash
   docker-compose down
   ```

## Services

### PostgreSQL Database
- **Container:** `pokemon-game-db`
- **Port:** 5432 (configurable via `POSTGRES_PORT`)
- **Default credentials:**
  - User: `pokemon_user`
  - Password: `pokemon_password`
  - Database: `pokemon_game`

### Backend API
- **Container:** `pokemon-game-backend`
- **Port:** 3000 (configurable via `PORT`)
- **Auto-runs migrations on startup**

## Useful Commands

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Restart services
```bash
docker-compose restart
```

### Rebuild backend after code changes
```bash
docker-compose up -d --build backend
```

### Access database directly
```bash
docker-compose exec postgres psql -U pokemon_user -d pokemon_game
```

### Run migrations manually
```bash
docker-compose exec backend npm run db:migrate
```

### Stop and remove all containers and volumes
```bash
docker-compose down -v
```

## Environment Variables

All environment variables can be configured in the `.env` file. See `.env.example` for available options.

## Development Workflow

For local development without Docker, you can still run PostgreSQL in Docker and the backend locally:

```bash
# Start only the database
docker-compose up -d postgres

# Run backend locally
cd packages/backend
npm run dev
```
