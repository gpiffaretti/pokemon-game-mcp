"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGame = createGame;
exports.getGame = getGame;
exports.updateGameState = updateGameState;
exports.finishGame = finishGame;
const drizzle_orm_1 = require("drizzle-orm");
const client_1 = require("../db/client");
const schema_1 = require("../db/schema");
const game_1 = require("../types/game");
async function createGame() {
    const rows = await client_1.db.insert(schema_1.games).values({}).returning();
    return rows[0];
}
async function getGame(gameId) {
    const rows = await client_1.db.select().from(schema_1.games).where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
    if (rows.length === 0)
        throw new Error('Game not found');
    return rows[0];
}
async function updateGameState(gameId, state) {
    const rows = await client_1.db
        .update(schema_1.games)
        .set({ state, updatedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId))
        .returning();
    if (rows.length === 0)
        throw new Error('Game not found');
    return rows[0];
}
async function finishGame(gameId) {
    return updateGameState(gameId, game_1.GameState.FINISHED);
}
//# sourceMappingURL=gameService.js.map