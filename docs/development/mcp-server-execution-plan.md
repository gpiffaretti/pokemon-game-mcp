# MCP Server Execution Plan

## Overview
Build the TypeScript MCP server for the Pokemon Battle application. This server is the **primary user interface** — it exposes MCP tools that an LLM client calls to drive the game through natural language. All game state lives in the backend REST API; the MCP server is a stateless adapter that translates tool calls into HTTP requests.

---

## Phase 1: Project Scaffolding

### 1.1 — Configure `packages/mcp-server/package.json`
- Add missing scripts:
  - `"build": "tsc"`
  - `"start": "node dist/index.js"`
  - `"dev": "ts-node src/index.ts"`
- Add `axios` as a runtime dependency (HTTP client for backend API calls)
- Add `ts-node` as a dev dependency
- Set `"type": "module"` or configure CommonJS output to match backend conventions

### 1.2 — Create `packages/mcp-server/tsconfig.json`
- Target: `ES2020`, module: `CommonJS` (or `NodeNext` if using ESM)
- `strict: true`, `outDir: "dist"`, `rootDir: "src"`

### 1.3 — Create the folder skeleton
```
src/
  tools/          # One file per tool group (game, pokemon, area, battle, pokedex)
  client/         # Typed HTTP client wrapping the backend REST API
  types/          # Shared TypeScript interfaces mirroring backend types
  utils/          # Response formatters, error helpers
  index.ts        # MCP server entry point — registers all tools and starts server
```

### 1.4 — Create `src/index.ts` entry point
- Instantiate `McpServer` from `@modelcontextprotocol/sdk/server/mcp.js`
- Register all tool groups
- Connect via `StdioServerTransport` (standard MCP stdio transport)

---

## Phase 2: Backend API Client

A single typed HTTP client so all tool files share one place for base URL config and error handling.

### 2.1 — `src/client/apiClient.ts`
- Export an `axios` instance configured with:
  - `baseURL` from `BACKEND_URL` env var (default: `http://localhost:3000/api/v1`)
  - `Content-Type: application/json` header
- Export typed helper functions wrapping `get`, `post`, `put`:
  ```ts
  export async function apiGet<T>(path: string): Promise<T>
  export async function apiPost<T>(path: string, body?: unknown): Promise<T>
  export async function apiPut<T>(path: string, body?: unknown): Promise<T>
  ```
- On non-2xx responses, throw an `Error` with the backend's error message extracted from the response body

### 2.2 — `src/client/endpoints.ts`
- Centralize all URL builders as pure functions:
  ```ts
  export const endpoints = {
    games: {
      create: () => `/games`,
      get: (gameId: string) => `/games/${gameId}`,
      finish: (gameId: string) => `/games/${gameId}/finish`,
    },
    pokemon: {
      captured: (gameId: string) => `/games/${gameId}/captured`,
      starting: (gameId: string) => `/games/${gameId}/starting`,
      startingMoves: (gameId: string) => `/games/${gameId}/starting/moves`,
    },
    area: {
      current: (gameId: string) => `/games/${gameId}/current`,
      move: (gameId: string) => `/games/${gameId}/move`,
      explore: (gameId: string) => `/games/${gameId}/explore`,
    },
    battle: {
      start: (gameId: string) => `/games/${gameId}/start`,
      move: (gameId: string) => `/games/${gameId}/move`,
      flee: (gameId: string) => `/games/${gameId}/flee`,
      catch: (gameId: string) => `/games/${gameId}/catch`,
    },
    pokedex: {
      pokemon: (nameOrId: string | number) => `/pokedex/pokemon/${nameOrId}`,
      area: (areaId: number) => `/pokedex/area/${areaId}`,
    },
  };
  ```

---

## Phase 3: Shared Types

Mirror the backend types so tool files are fully type-safe without importing from the backend package.

### 3.1 — `src/types/game.ts`
```ts
export type GameState = 'SELECTING_STARTING_POKEMON' | 'EXPLORING' | 'BATTLING' | 'FINISHED';
export interface Game { id: string; state: GameState; currentAreaId: number | null; createdAt: string; updatedAt: string; }
export interface CapturedPokemon { gameId: string; pokemonId: number; capturedAt: string; }
export interface StartingPokemon { gameId: string; pokemonId: number; selectedAt: string; }
```

### 3.2 — `src/types/pokemon.ts`
```ts
export interface Move { id: number; name: string; type: string; }
export interface Pokemon { id: number; name: string; types: string[]; moves: Move[]; }
```

### 3.3 — `src/types/battle.ts`
```ts
export interface MoveResult { playerMove: Move; opponentMove: Move; }
export interface BattleResult { playerMove: Move; opponentMove: Move; captured?: boolean; fled?: boolean; }
```

### 3.4 — `src/types/area.ts`
```ts
export interface Area { id: number; name: string; }
export interface AreaEncounter { pokemonId: number; pokemonName: string; encounterRate: number; }
```

---

## Phase 4: Tools

Each tool file registers a group of related MCP tools on the `McpServer` instance. Tools use `zod` for input schema validation (already a dependency). All tool responses return `{ content: [{ type: 'text', text: string }] }`.

### 4.1 — `src/tools/gameTools.ts`

| Tool name | Input | Backend call | Description |
|---|---|---|---|
| `start_game` | _(none)_ | `POST /games` | Start a new game session, returns `gameId` |
| `get_game_status` | `gameId` | `GET /games/:gameId` | Get current game state and area |
| `finish_game` | `gameId` | `POST /games/:gameId/finish` | Declare the game complete |

### 4.2 — `src/tools/pokemonTools.ts`

| Tool name | Input | Backend call | Description |
|---|---|---|---|
| `get_captured_pokemon` | `gameId` | `GET /games/:gameId/captured` | List all captured Pokemon |
| `get_starting_pokemon` | `gameId` | `GET /games/:gameId/starting` | Get the current starting Pokemon |
| `set_starting_pokemon` | `gameId`, `pokemonId` | `PUT /games/:gameId/starting` | Set or change the starting Pokemon |
| `get_starting_pokemon_moves` | `gameId` | `GET /games/:gameId/starting/moves` | Get available moves for the starting Pokemon |

### 4.3 — `src/tools/areaTools.ts`

| Tool name | Input | Backend call | Description |
|---|---|---|---|
| `get_current_area` | `gameId` | `GET /games/:gameId/current` | Get the player's current area |
| `move_to_area` | `gameId`, `areaId` | `PUT /games/:gameId/move` | Navigate to a different area |
| `explore_area` | `gameId` | `POST /games/:gameId/explore` | Find a random wild Pokemon in the current area |

### 4.4 — `src/tools/battleTools.ts`

| Tool name | Input | Backend call | Description |
|---|---|---|---|
| `start_battle` | `gameId`, `wildPokemonId` | `POST /games/:gameId/start` | Initiate a battle with the encountered wild Pokemon |
| `perform_move` | `gameId`, `moveId` | `POST /games/:gameId}/move` | Use a move in battle; returns player + opponent move result |
| `flee_battle` | `gameId` | `POST /games/:gameId/flee` | Run away from the current battle |
| `throw_pokeball` | `gameId` | `POST /games/:gameId/catch` | Attempt to capture the wild Pokemon (100% success) |

### 4.5 — `src/tools/pokedexTools.ts`

| Tool name | Input | Backend call | Description |
|---|---|---|---|
| `lookup_pokemon` | `nameOrId` | `GET /pokedex/pokemon/:nameOrId` | Look up a Pokemon's data from the Pokedex |
| `lookup_area` | `areaId` | `GET /pokedex/area/:areaId` | Get area info and its Pokemon encounter list |

---

## Phase 5: Response Formatters

### 5.1 — `src/utils/formatters.ts`
Pure functions that convert raw API responses into readable natural language strings for the LLM context. Examples:
- `formatGame(game: Game): string` → `"Game [id]: state=EXPLORING, area=12"`
- `formatPokemonList(list: CapturedPokemon[]): string` → numbered list of Pokemon names
- `formatMoveResult(result: MoveResult): string` → `"You used Tackle! Opponent used Growl."`
- `formatAreaEncounters(area: Area, encounters: AreaEncounter[]): string` → area name + encounter table

### 5.2 — `src/utils/errors.ts`
- `formatError(err: unknown): string` — extract a clean message from `Error` or axios error response for inclusion in tool result text

---

## Phase 6: Environment & Configuration

### 6.1 — `.env.example`
```
BACKEND_URL=http://localhost:3000/api/v1
```

### 6.2 — Config loading in `src/index.ts`
- Use `dotenv` (add as dependency) to load `.env` at startup
- Validate `BACKEND_URL` is set; log a warning and fall back to default if missing

---

## Phase 7: Wiring & Entry Point

### 7.1 — Register all tools in `src/index.ts`
```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerGameTools } from './tools/gameTools.js';
import { registerPokemonTools } from './tools/pokemonTools.js';
import { registerAreaTools } from './tools/areaTools.js';
import { registerBattleTools } from './tools/battleTools.js';
import { registerPokedexTools } from './tools/pokedexTools.js';

const server = new McpServer({ name: 'pokemon-battle', version: '1.0.0' });

registerGameTools(server);
registerPokemonTools(server);
registerAreaTools(server);
registerBattleTools(server);
registerPokedexTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
```

Each `register*Tools` function receives the `McpServer` instance and calls `server.tool(name, schema, handler)` for each tool in its group.

---

## Phase 8: Testing

### 8.1 — Manual smoke test via MCP Inspector
- Run `npx @modelcontextprotocol/inspector node dist/index.js` with the backend running
- Verify each tool appears and returns expected output

### 8.2 — Unit tests for formatters (`tests/utils/`)
- `formatters.test.ts`: test each formatter with fixture data, assert output strings

### 8.3 — Integration tests for tools (`tests/tools/`)
- Mock `apiClient` with `jest.mock`
- Call each tool handler directly with valid input
- Assert the returned `content[0].text` contains expected substrings

---

## Completion Checklist

- [ ] `package.json` updated with all dependencies and scripts
- [ ] `tsconfig.json` configured and `tsc --noEmit` passes
- [ ] `apiClient.ts` and `endpoints.ts` implemented
- [ ] All 4 shared type files defined
- [ ] All 5 tool group files implemented (14 tools total)
- [ ] Response formatters implemented for all data types
- [ ] `BACKEND_URL` env var loaded and documented
- [ ] `src/index.ts` wires all tools and connects via stdio transport
- [ ] MCP Inspector smoke test passes for all tools
- [ ] Formatter unit tests written
