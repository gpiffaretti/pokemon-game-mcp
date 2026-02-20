"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentArea = getCurrentArea;
exports.moveToArea = moveToArea;
exports.findPokemonInArea = findPokemonInArea;
const drizzle_orm_1 = require("drizzle-orm");
const client_1 = require("../db/client");
const schema_1 = require("../db/schema");
const game_1 = require("../types/game");
const pokedexService_1 = require("./pokedexService");
async function getCurrentArea(gameId) {
    const rows = await client_1.db.select().from(schema_1.games).where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
    if (rows.length === 0)
        throw new Error('Game not found');
    const game = rows[0];
    if (!game.currentAreaId)
        throw new Error('No current area set');
    return (0, pokedexService_1.getArea)(game.currentAreaId);
}
async function moveToArea(gameId, areaId) {
    const rows = await client_1.db.select().from(schema_1.games).where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
    if (rows.length === 0)
        throw new Error('Game not found');
    if (rows[0].state !== game_1.GameState.EXPLORING) {
        throw new Error('Can only move areas while exploring');
    }
    await client_1.db
        .update(schema_1.games)
        .set({ currentAreaId: areaId, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
    return (0, pokedexService_1.getArea)(areaId);
}
async function findPokemonInArea(gameId) {
    const rows = await client_1.db.select().from(schema_1.games).where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
    if (rows.length === 0)
        throw new Error('Game not found');
    const game = rows[0];
    if (game.state !== game_1.GameState.EXPLORING) {
        throw new Error('Can only explore while in EXPLORING state');
    }
    if (!game.currentAreaId)
        throw new Error('No current area set');
    const encounters = await (0, pokedexService_1.getPokemonForArea)(game.currentAreaId);
    if (encounters.length === 0)
        throw new Error('No Pokemon found in this area');
    const totalWeight = encounters.reduce((sum, e) => sum + e.encounterRate, 0);
    let rand = Math.random() * totalWeight;
    for (const enc of encounters) {
        rand -= enc.encounterRate;
        if (rand <= 0)
            return enc;
    }
    return encounters[encounters.length - 1];
}
//# sourceMappingURL=areaService.js.map