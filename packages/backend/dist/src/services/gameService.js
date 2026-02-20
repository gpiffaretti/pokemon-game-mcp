"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGame = createGame;
exports.getGame = getGame;
exports.updateGameState = updateGameState;
exports.finishGame = finishGame;
exports.enrichGame = enrichGame;
const drizzle_orm_1 = require("drizzle-orm");
const client_1 = require("../db/client");
const schema_1 = require("../db/schema");
const game_1 = require("../types/game");
const pokedexService_1 = require("./pokedexService");
async function enrichGame(game) {
    const [currentArea, wildPokemon, currentPokemon] = await Promise.all([
        game.currentAreaId ? (0, pokedexService_1.getArea)(game.currentAreaId) : Promise.resolve(null),
        game.wildPokemonId ? (0, pokedexService_1.getPokemon)(game.wildPokemonId) : Promise.resolve(null),
        game.currentPokemonId ? (0, pokedexService_1.getPokemon)(game.currentPokemonId) : Promise.resolve(null),
    ]);
    return {
        id: game.id,
        state: game.state,
        currentArea,
        wildPokemon,
        currentPokemon,
        createdAt: game.createdAt,
        updatedAt: game.updatedAt,
    };
}
async function createGame() {
    const rows = await client_1.db.insert(schema_1.games).values({}).returning();
    return enrichGame(rows[0]);
}
async function getGame(gameId) {
    const rows = await client_1.db.select().from(schema_1.games).where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
    if (rows.length === 0)
        throw new Error('Game not found');
    return enrichGame(rows[0]);
}
async function updateGameState(gameId, state) {
    const rows = await client_1.db
        .update(schema_1.games)
        .set({ state, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId))
        .returning();
    if (rows.length === 0)
        throw new Error('Game not found');
    return enrichGame(rows[0]);
}
async function finishGame(gameId) {
    return updateGameState(gameId, game_1.GameState.FINISHED);
}
//# sourceMappingURL=gameService.js.map