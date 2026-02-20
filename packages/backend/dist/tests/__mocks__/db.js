"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.mockGame = void 0;
const game_1 = require("../../src/types/game");
exports.mockGame = {
    id: 'test-game-id',
    state: game_1.GameState.EXPLORING,
    currentAreaId: 1,
    wildPokemonId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
};
const chainable = {
    values: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([exports.mockGame]),
    onConflictDoUpdate: jest.fn().mockReturnThis(),
};
exports.db = {
    select: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([exports.mockGame]),
        }),
    }),
    insert: jest.fn().mockReturnValue(chainable),
    update: jest.fn().mockReturnValue(chainable),
};
//# sourceMappingURL=db.js.map