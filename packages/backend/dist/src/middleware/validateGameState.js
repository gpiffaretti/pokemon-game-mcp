"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireState = requireState;
const client_1 = require("../db/client");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
function requireState(requiredState) {
    return async (req, _res, next) => {
        try {
            const { gameId } = req.params;
            const rows = await client_1.db.select().from(schema_1.games).where((0, drizzle_orm_1.eq)(schema_1.games.id, gameId));
            if (rows.length === 0) {
                next(new Error('Game not found'));
                return;
            }
            if (rows[0].state !== requiredState) {
                next(new Error(`Invalid game state: expected ${requiredState}, got ${rows[0].state}`));
                return;
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
//# sourceMappingURL=validateGameState.js.map