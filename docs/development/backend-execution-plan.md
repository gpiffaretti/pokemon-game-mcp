# Backend Execution Plan

## Overview
Build the Express/TypeScript backend for the Pokemon Battle application following the layered structure defined in `.windsurf/rules/backend-structure.md`. No ORM or repository layer — services query PostgreSQL directly.

---

## Phase 1: Project Scaffolding

### 1.1 — Initialize the backend package
- Create `packages/backend/package.json` with dependencies:
  - `express`, `pg`, `dotenv`, `axios` (for PokeAPI)
  - Dev: `typescript`, `ts-node`, `nodemon`, `@types/express`, `@types/pg`, `@types/node`
- Create `packages/backend/tsconfig.json` (target ES2020, module CommonJS, strict mode)
- Create `packages/backend/.env.example` with `DATABASE_URL`, `PORT`

### 1.2 — Create the folder skeleton
```
src/
  controllers/
  services/
  routes/
  middleware/
  types/
  utils/
  app.ts
  server.ts
```

### 1.3 — Bootstrap Express app
- `src/app.ts`: create and export the Express app, mount routers, attach middleware
- `src/server.ts`: import app, connect to DB, start listening on `PORT`
- `src/utils/db.ts`: export a `pg.Pool` instance configured from `DATABASE_URL`

---

## Phase 2: Types

Define all shared TypeScript interfaces before writing any logic.

### 2.1 — `src/types/game.ts`
```ts
enum GameState { SELECTING_STARTING_POKEMON, EXPLORING, BATTLING, FINISHED }
interface Game { id: string; state: GameState; currentAreaId: number; createdAt: Date; updatedAt: Date; }
interface CapturedPokemon { gameId: string; pokemonId: number; capturedAt: Date; }
interface StartingPokemon { gameId: string; pokemonId: number; selectedAt: Date; }
```

### 2.2 — `src/types/pokemon.ts`
```ts
interface Pokemon { id: number; name: string; types: string[]; moves: Move[]; }
interface Move { id: number; name: string; type: string; }
```

### 2.3 — `src/types/area.ts`
```ts
interface Area { id: number; name: string; }
interface AreaPokemon { areaId: number; pokemonId: number; encounterRate: number; }
```

### 2.4 — `src/types/battle.ts`
```ts
interface MoveResult { playerMove: Move; opponentMove: Move; }
interface BattleResult { playerMove: Move; opponentMove: Move; captured?: boolean; fled?: boolean; }
```

---

## Phase 3: Database Schema

### 3.1 — Create migration SQL files in `packages/backend/migrations/`
- `001_create_games_table.sql`
- `002_create_captured_pokemon_table.sql`
- `003_create_starting_pokemon_table.sql`

### 3.2 — Schema details

**`games`**
```sql
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state VARCHAR(40) NOT NULL DEFAULT 'SELECTING_STARTING_POKEMON',
  current_area_id INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**`captured_pokemon`**
```sql
CREATE TABLE captured_pokemon (
  game_id UUID REFERENCES games(id),
  pokemon_id INT NOT NULL,
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (game_id, pokemon_id)
);
```

**`starting_pokemon`**
```sql
CREATE TABLE starting_pokemon (
  game_id UUID PRIMARY KEY REFERENCES games(id),
  pokemon_id INT NOT NULL,
  selected_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 — Create a simple migration runner script (`scripts/migrate.ts`)

---

## Phase 4: Services

Implement business logic. Each service exports plain async functions. No `req`/`res`.

### 4.1 — `gameService.ts`
- `createGame()` → insert into `games`, return new `Game`
- `getGame(gameId)` → fetch game row
- `updateGameState(gameId, state)` → update `state` + `updated_at`
- `finishGame(gameId)` → set state to `FINISHED`

### 4.2 — `pokemonService.ts`
- `getCapturedPokemon(gameId)` → fetch all from `captured_pokemon`
- `capturePokemon(gameId, pokemonId)` → insert into `captured_pokemon` (guard: no duplicates)
- `getStartingPokemon(gameId)` → fetch from `starting_pokemon`
- `setStartingPokemon(gameId, pokemonId)` → upsert into `starting_pokemon` (guard: only when not BATTLING)
- `getMovesForStartingPokemon(gameId)` → fetch starting pokemon, call `pokedexService.getPokemonMoves(pokemonId)`

### 4.3 — `pokedexService.ts`
- `getPokemon(pokemonId | name)` → GET `https://pokeapi.co/api/v2/pokemon/{id}`
- `getPokemonMoves(pokemonId)` → extract moves from PokeAPI response
- `getArea(areaId)` → GET `https://pokeapi.co/api/v2/location-area/{id}`
- `getPokemonForArea(areaId)` → extract encounter list from location-area response

### 4.4 — `areaService.ts`
- `getCurrentArea(gameId)` → fetch `current_area_id` from game, call `pokedexService.getArea()`
- `moveToArea(gameId, areaId)` → validate state is `EXPLORING`, update `current_area_id`
- `findPokemonInArea(gameId)` → get area encounters, pick random Pokemon weighted by encounter rate

### 4.5 — `battleService.ts`
- `startBattle(gameId, wildPokemonId)` → set state to `BATTLING`, store wild pokemon in memory/session
- `performMove(gameId, playerMoveId)` → pick random opponent move, return `MoveResult`
- `flee(gameId)` → set state back to `EXPLORING`
- `throwPokeball(gameId, wildPokemonId)` → call `pokemonService.capturePokemon()`, set state to `EXPLORING`

> **Note on wild pokemon during battle**: For the prototype, store `wildPokemonId` as a column on `games` (add in a migration) rather than introducing a session layer.

---

## Phase 5: Controllers

Thin handlers — parse input, call service, return JSON.

### 5.1 — `gameController.ts`
- `POST /` → `gameService.createGame()`
- `GET /:gameId` → `gameService.getGame()`
- `POST /:gameId/finish` → `gameService.finishGame()`

### 5.2 — `pokemonController.ts`
- `GET /:gameId/captured` → `pokemonService.getCapturedPokemon()`
- `GET /:gameId/starting` → `pokemonService.getStartingPokemon()`
- `PUT /:gameId/starting` → `pokemonService.setStartingPokemon()`
- `GET /:gameId/starting/moves` → `pokemonService.getMovesForStartingPokemon()`

### 5.3 — `areaController.ts`
- `GET /:gameId/current` → `areaService.getCurrentArea()`
- `PUT /:gameId/move` → `areaService.moveToArea()`
- `POST /:gameId/explore` → `areaService.findPokemonInArea()`

### 5.4 — `battleController.ts`
- `POST /:gameId/start` → `battleService.startBattle()`
- `POST /:gameId/move` → `battleService.performMove()`
- `POST /:gameId/flee` → `battleService.flee()`
- `POST /:gameId/catch` → `battleService.throwPokeball()`

### 5.5 — `pokedexController.ts`
- `GET /pokemon/:nameOrId` → `pokedexService.getPokemon()`
- `GET /area/:areaId` → `pokedexService.getArea()` + `getPokemonForArea()`

---

## Phase 6: Routes

Wire controllers to Express routers in `src/routes/`, then mount in `app.ts`.

| File | Mount path |
|---|---|
| `gameRoutes.ts` | `/api/v1/games` |
| `pokemonRoutes.ts` | `/api/v1/games` |
| `areaRoutes.ts` | `/api/v1/games` |
| `battleRoutes.ts` | `/api/v1/games` |
| `pokedexRoutes.ts` | `/api/v1/pokedex` |

---

## Phase 7: Middleware

### 7.1 — `src/middleware/requestLogger.ts`
Log method, path, status, and duration for every request.

### 7.2 — `src/middleware/errorHandler.ts`
Global error handler — map known error messages to status codes (404, 409, 400), default to 500.

### 7.3 — `src/middleware/validateGameState.ts`
Factory middleware: `requireState(GameState.EXPLORING)` — fetch game and assert state, call `next(err)` if mismatch. Used on routes that require a specific game state.

---

## Phase 8: Validation & Testing

### 8.1 — Input validation
- Add lightweight request body validation in controllers (check required fields, return 400 on missing)
- No external validation library needed for prototype

### 8.2 — Service unit tests (`tests/services/`)
- `gameService.test.ts`: mock `db` pool, test state transitions
- `battleService.test.ts`: test move selection, capture guard
- `pokemonService.test.ts`: test duplicate capture guard

### 8.3 — Integration smoke tests (`tests/controllers/`)
- Use `supertest` to hit each route group with a real (test) DB connection

---

## Completion Checklist

- [ ] Package scaffolded and compiles with `tsc --noEmit`
- [ ] DB migrations run cleanly
- [ ] All 5 service files implemented
- [ ] All 5 controller files implemented
- [ ] All 5 route files mounted
- [ ] Error handler and logger middleware active
- [ ] PokeAPI integration working (starter selection, area encounters, moves)
- [ ] Game state machine enforced (guards in services + `validateGameState` middleware)
- [ ] Duplicate capture prevention working
- [ ] Starting pokemon change blocked during `BATTLING` state
