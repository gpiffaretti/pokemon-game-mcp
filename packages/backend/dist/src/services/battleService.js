"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBattle = startBattle;
exports.performMove = performMove;
exports.flee = flee;
exports.throwPokeball = throwPokeball;
const drizzle_orm_1 = require("drizzle-orm");
const client_1 = require("../db/client");
const schema_1 = require("../db/schema");
const game_1 = require("../types/game");
const pokedexService_1 = require("./pokedexService");
const pokemonService_1 = require("./pokemonService");
async function startBattle(gameId, wildPokemonId) {
    const rows = await client_1.db.select().from(schema_1.games).where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
    if (rows.length === 0)
        throw new Error('Game not found');
    if (rows[0].state !== game_1.GameState.EXPLORING) {
        throw new Error('Can only start a battle while exploring');
    }
    await client_1.db
        .update(schema_1.games)
        .set({ state: game_1.GameState.BATTLING, wildPokemonId, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
}
async function performMove(gameId, playerMoveId) {
    const rows = await client_1.db.select().from(schema_1.games).where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
    if (rows.length === 0)
        throw new Error('Game not found');
    const game = rows[0];
    if (game.state !== game_1.GameState.BATTLING) {
        throw new Error('No active battle');
    }
    if (!game.wildPokemonId)
        throw new Error('No wild pokemon in battle');
    const current = await (0, pokemonService_1.getCurrentPokemon)(gameId);
    if (!current)
        throw new Error('No current pokemon selected');
    const [playerMoves, opponentMoves] = await Promise.all([
        (0, pokedexService_1.getPokemonMoves)(current.pokemonId),
        (0, pokedexService_1.getPokemonMoves)(game.wildPokemonId),
    ]);
    const playerMove = playerMoves.find((m) => m.id === playerMoveId);
    if (!playerMove)
        throw new Error('Move not found for starting pokemon');
    const opponentMove = opponentMoves[Math.floor(Math.random() * opponentMoves.length)];
    return { playerMove, opponentMove };
}
async function flee(gameId) {
    const rows = await client_1.db.select().from(schema_1.games).where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
    if (rows.length === 0)
        throw new Error('Game not found');
    if (rows[0].state !== game_1.GameState.BATTLING) {
        throw new Error('No active battle to flee from');
    }
    await client_1.db
        .update(schema_1.games)
        .set({ state: game_1.GameState.EXPLORING, wildPokemonId: null, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
}
async function throwPokeball(gameId, wildPokemonId) {
    const rows = await client_1.db.select().from(schema_1.games).where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
    if (rows.length === 0)
        throw new Error('Game not found');
    if (rows[0].state !== game_1.GameState.BATTLING) {
        throw new Error('No active battle');
    }
    await (0, pokemonService_1.capturePokemon)(gameId, wildPokemonId);
    await client_1.db
        .update(schema_1.games)
        .set({ state: game_1.GameState.EXPLORING, wildPokemonId: null, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
    return { playerMove: { id: 0, name: 'pokeball', type: 'normal' }, opponentMove: { id: 0, name: 'none', type: 'normal' }, captured: true };
}
//# sourceMappingURL=battleService.js.map