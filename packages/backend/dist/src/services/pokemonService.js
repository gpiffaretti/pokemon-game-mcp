"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStarterOptions = getStarterOptions;
exports.getCapturedPokemon = getCapturedPokemon;
exports.capturePokemon = capturePokemon;
exports.getCurrentPokemon = getCurrentPokemon;
exports.setCurrentPokemon = setCurrentPokemon;
exports.getMovesForCurrentPokemon = getMovesForCurrentPokemon;
const drizzle_orm_1 = require("drizzle-orm");
const client_1 = require("../db/client");
const schema_1 = require("../db/schema");
const game_1 = require("../types/game");
const pokedexService_1 = require("./pokedexService");
const STARTER_POKEMON_IDS = [1, 4, 7];
async function getStarterOptions() {
    return Promise.all(STARTER_POKEMON_IDS.map((id) => (0, pokedexService_1.getPokemon)(id)));
}
async function getCapturedPokemon(gameId) {
    return client_1.db.select().from(schema_1.capturedPokemon).where((0, drizzle_orm_1.eq)(schema_1.capturedPokemon.gameId, gameId));
}
async function capturePokemon(gameId, pokemonId) {
    const existing = await client_1.db
        .select()
        .from(schema_1.capturedPokemon)
        .where((0, drizzle_orm_1.eq)(schema_1.capturedPokemon.gameId, gameId));
    if (existing.some((p) => p.pokemonId === pokemonId)) {
        throw new Error('Pokemon already captured');
    }
    const rows = await client_1.db
        .insert(schema_1.capturedPokemon)
        .values({ gameId, pokemonId })
        .returning();
    return rows[0];
}
async function getCurrentPokemon(gameId) {
    const rows = await client_1.db.select().from(schema_1.games).where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
    if (rows.length === 0)
        throw new Error('Game not found');
    const { currentPokemonId } = rows[0];
    return currentPokemonId != null ? { pokemonId: currentPokemonId } : null;
}
async function setCurrentPokemon(gameId, pokemonId) {
    const gameRows = await client_1.db.select().from(schema_1.games).where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
    if (gameRows.length === 0)
        throw new Error('Game not found');
    if (gameRows[0].state === game_1.GameState.BATTLING) {
        throw new Error('Cannot change current pokemon during a battle');
    }
    const isInitialSelection = gameRows[0].state === game_1.GameState.SELECTING_STARTING_POKEMON;
    if (isInitialSelection) {
        const validIds = STARTER_POKEMON_IDS;
        if (!validIds.includes(pokemonId)) {
            throw new Error(`Invalid starter. Choose one of: ${validIds.join(', ')}`);
        }
        await client_1.db
            .insert(schema_1.capturedPokemon)
            .values({ gameId, pokemonId })
            .onConflictDoNothing();
    }
    else {
        const captured = await client_1.db.select().from(schema_1.capturedPokemon).where((0, drizzle_orm_1.eq)(schema_1.capturedPokemon.gameId, gameId));
        if (!captured.some((p) => p.pokemonId === pokemonId)) {
            throw new Error('Pokemon not in captured collection');
        }
    }
    const updatedRows = await client_1.db
        .update(schema_1.games)
        .set({
        currentPokemonId: pokemonId,
        ...(isInitialSelection ? { state: game_1.GameState.EXPLORING } : {}),
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId))
        .returning();
    return updatedRows[0];
}
async function getMovesForCurrentPokemon(gameId) {
    const current = await getCurrentPokemon(gameId);
    if (!current)
        throw new Error('No current pokemon selected');
    return (0, pokedexService_1.getPokemonMoves)(current.pokemonId);
}
//# sourceMappingURL=pokemonService.js.map