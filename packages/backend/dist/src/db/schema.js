"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capturedPokemon = exports.games = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.games = (0, pg_core_1.pgTable)('games', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    state: (0, pg_core_1.varchar)('state', { length: 40 }).notNull().default('SELECTING_STARTING_POKEMON'),
    currentAreaId: (0, pg_core_1.integer)('current_area_id'),
    wildPokemonId: (0, pg_core_1.integer)('wild_pokemon_id'),
    currentPokemonId: (0, pg_core_1.integer)('current_pokemon_id'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow(),
});
exports.capturedPokemon = (0, pg_core_1.pgTable)('captured_pokemon', {
    gameId: (0, pg_core_1.uuid)('game_id').references(() => exports.games.id),
    pokemonId: (0, pg_core_1.integer)('pokemon_id').notNull(),
    capturedAt: (0, pg_core_1.timestamp)('captured_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
    pk: (0, pg_core_1.primaryKey)({ columns: [t.gameId, t.pokemonId] }),
}));
//# sourceMappingURL=schema.js.map