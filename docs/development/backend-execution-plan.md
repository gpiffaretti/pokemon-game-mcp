# Backend Execution Plan

## Overview
Build the Express/TypeScript backend for the Pokemon Battle application following the layered structure defined in `.windsurf/rules/backend-structure.md`. Uses **Drizzle ORM** for type-safe database access with PostgreSQL.

---

## Phase 1: Project Scaffolding

### 1.1 — Initialize the backend package
- Create `packages/backend/package.json` with dependencies:
  - `express`, `dotenv`, `axios` (for PokeAPI)
  - `drizzle-orm`, `postgres` (Drizzle ORM with postgres.js driver)
  - Dev: `typescript`, `ts-node`, `nodemon`, `@types/express`, `@types/node`, `drizzle-kit`
- Create `packages/backend/tsconfig.json` (target ES2020, module CommonJS, strict mode)
- Create `packages/backend/.env.example` with `DATABASE_URL`, `PORT`
- Create `packages/backend/drizzle.config.ts` pointing to `src/db/schema.ts`

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
- `src/db/client.ts`: export a Drizzle client instance configured from `DATABASE_URL` using `postgres` + `drizzle()`
- `src/db/schema.ts`: Drizzle table definitions (replaces raw SQL migrations)

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

### 3.1 — Define Drizzle schema in `src/db/schema.ts`

Use Drizzle's `pgTable` helpers to define all tables with full TypeScript types inferred automatically.

**`games`**
```ts
export const games = pgTable('games', {
  id: uuid('id').primaryKey().defaultRandom(),
  state: varchar('state', { length: 40 }).notNull().default('SELECTING_STARTING_POKEMON'),
  currentAreaId: integer('current_area_id'),
  wildPokemonId: integer('wild_pokemon_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
```

**`capturedPokemon`**
```ts
export const capturedPokemon = pgTable('captured_pokemon', {
  gameId: uuid('game_id').references(() => games.id),
  pokemonId: integer('pokemon_id').notNull(),
  capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow(),
}, (t) => ({ pk: primaryKey({ columns: [t.gameId, t.pokemonId] }) }));
```

**`startingPokemon`**
```ts
export const startingPokemon = pgTable('starting_pokemon', {
  gameId: uuid('game_id').primaryKey().references(() => games.id),
  pokemonId: integer('pokemon_id').notNull(),
  selectedAt: timestamp('selected_at', { withTimezone: true }).defaultNow(),
});
```

### 3.2 — Generate and run migrations with Drizzle Kit
- Run `npx drizzle-kit generate` to produce SQL migration files in `drizzle/`
- Run `npx drizzle-kit migrate` to apply migrations to the database
- Add `db:generate` and `db:migrate` scripts to `package.json`

---

## Phase 4: Services

Implement business logic. Each service exports plain async functions. No `req`/`res`. All DB access uses the Drizzle client from `src/db/client.ts`.

### 4.1 — `gameService.ts`
- `createGame()` → `db.insert(games).values({}).returning()`, return new `Game`
- `getGame(gameId)` → `db.select().from(games).where(eq(games.id, gameId))`
- `updateGameState(gameId, state)` → `db.update(games).set({ state, updatedAt: new Date() }).where(...)`
- `finishGame(gameId)` → set state to `FINISHED`

### 4.2 — `pokemonService.ts`
- `getCapturedPokemon(gameId)` → `db.select().from(capturedPokemon).where(eq(capturedPokemon.gameId, gameId))`
- `capturePokemon(gameId, pokemonId)` → insert into `capturedPokemon` (guard: no duplicates)
- `getStartingPokemon(gameId)` → `db.select().from(startingPokemon).where(...)`
- `setStartingPokemon(gameId, pokemonId)` → `db.insert(startingPokemon).values({...}).onConflictDoUpdate(...)` (guard: only when not BATTLING)
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
- `gameService.test.ts`: mock Drizzle `db` client, test state transitions
- `battleService.test.ts`: test move selection, capture guard
- `pokemonService.test.ts`: test duplicate capture guard

### 8.3 — Integration smoke tests (`tests/controllers/`)
- Use `supertest` to hit each route group with a real (test) DB connection

---

## Completion Checklist

- [ ] Package scaffolded and compiles with `tsc --noEmit`
- [ ] Drizzle schema defined and migrations generated + applied cleanly
- [ ] All 5 service files implemented
- [ ] All 5 controller files implemented
- [ ] All 5 route files mounted
- [ ] Error handler and logger middleware active
- [ ] PokeAPI integration working (starter selection, area encounters, moves)
- [ ] Game state machine enforced (guards in services + `validateGameState` middleware)
- [ ] Duplicate capture prevention working
- [ ] Starting pokemon change blocked during `BATTLING` state
