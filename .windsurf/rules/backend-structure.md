---
trigger: always_on
---

# Backend Structure Rules

## Directory Layout

```
packages/backend/
├── src/
│   ├── controllers/         # HTTP request/response handling only
│   ├── services/            # Business logic and game mechanics
│   ├── routes/              # Express router definitions
│   ├── middleware/          # Express middleware (logging, error handling, etc.)
│   ├── types/               # TypeScript interfaces and types
│   ├── utils/               # Pure helper functions
│   └── app.ts               # Express app setup (no logic)
├── tests/
│   ├── controllers/
│   └── services/
├── package.json
├── tsconfig.json
└── README.md
```

## Layer Responsibilities

### Controllers (`src/controllers/`)
- Handle HTTP request parsing and response formatting **only**
- Call one or more service methods to fulfill the request
- Return appropriate HTTP status codes and JSON responses
- Do **not** contain business logic or direct data manipulation
- One file per domain: `gameController.ts`, `battleController.ts`, `areaController.ts`, `pokedexController.ts`, `pokemonController.ts`

### Services (`src/services/`)
- Contain all business logic and game mechanics
- Orchestrate game state transitions
- Call PokeAPI for external Pokemon data
- Manage in-memory or DB-persisted game state
- One file per domain mirroring controllers: `gameService.ts`, `battleService.ts`, `areaService.ts`, `pokedexService.ts`, `pokemonService.ts`
- No HTTP-specific code (no `req`/`res` references)

### Routes (`src/routes/`)
- Define Express routers and map HTTP verbs + paths to controller methods
- Apply route-level middleware (e.g., validation)
- One file per domain: `gameRoutes.ts`, `battleRoutes.ts`, `areaRoutes.ts`, `pokedexRoutes.ts`, `pokemonRoutes.ts`
- Mounted in `app.ts` under a versioned prefix (e.g., `/api/v1`)

### Middleware (`src/middleware/`)
- `errorHandler.ts`: Global Express error handler (last middleware in chain)
- `requestLogger.ts`: Log incoming requests
- `validateGameState.ts`: Reusable guard to check game state preconditions

### Types (`src/types/`)
- `game.ts`: `Game`, `GameState` enum, `CapturedPokemon`, `StartingPokemon`
- `battle.ts`: `BattleResult`, `MoveResult`
- `area.ts`: `Area`, `AreaPokemon`
- `pokemon.ts`: `Pokemon`, `Move`
- No runtime logic — interfaces and enums only

### Utils (`src/utils/`)
- Pure, stateless helper functions (e.g., random selection, response formatters)
- No imports from controllers or services

## Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Controller files | `camelCase` + `Controller.ts` | `gameController.ts` |
| Service files | `camelCase` + `Service.ts` | `battleService.ts` |
| Route files | `camelCase` + `Routes.ts` | `areaRoutes.ts` |
| Type/interface names | `PascalCase` | `GameState`, `BattleResult` |
| Enum values | `SCREAMING_SNAKE_CASE` | `SELECTING_STARTING_POKEMON` |
| Functions/variables | `camelCase` | `startGame`, `currentArea` |

## Data Access

- For this prototype, **no dedicated repository/DAO layer** is used
- Services interact with PostgreSQL directly via a shared `db` client (e.g., `pg` pool) imported from `src/utils/db.ts`
- All SQL queries live inside service files, co-located with the logic that uses them
- If query complexity grows, extract to a `queries/` subfolder inside `src/` — do not introduce a full ORM layer without explicit direction

## Error Handling

- Services throw typed errors (e.g., `new Error('Game not found')`)
- Controllers catch errors and delegate to `next(err)`
- `errorHandler.ts` middleware maps error types to HTTP status codes
- Never swallow errors silently

## General Rules

- All files use **TypeScript** — no plain `.js` files in `src/`
- Keep controllers thin: if a method exceeds ~20 lines, move logic to a service
- Services must be independently testable (no Express dependencies)
- Avoid cross-domain service imports (e.g., `battleService` should not import `pokedexService` directly — compose in the controller or a dedicated orchestration service if needed)
- PokeAPI calls belong in `pokedexService.ts` — other services request data through it
