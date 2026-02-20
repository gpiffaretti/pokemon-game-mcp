"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const game_1 = require("../../src/types/game");
const mockGame = {
    id: 'game-1',
    state: game_1.GameState.SELECTING_STARTING_POKEMON,
    currentArea: null,
    wildPokemon: null,
    currentPokemon: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};
jest.mock('../../src/services/gameService', () => ({
    createGame: jest.fn().mockResolvedValue(mockGame),
    getGame: jest.fn().mockResolvedValue(mockGame),
    finishGame: jest.fn().mockResolvedValue({ ...mockGame, state: game_1.GameState.FINISHED }),
}));
jest.mock('../../src/db/client', () => ({ db: {} }));
const app_1 = __importDefault(require("../../src/app"));
describe('Game routes', () => {
    it('POST /api/v1/games → 201 with new game', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/games');
        expect(res.status).toBe(201);
        expect(res.body.id).toBe('game-1');
    });
    it('GET /api/v1/games/:gameId → 200 with game', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/v1/games/game-1');
        expect(res.status).toBe(200);
        expect(res.body.id).toBe('game-1');
    });
    it('GET /api/v1/games/:gameId → 404 when not found', async () => {
        const { getGame } = require('../../src/services/gameService');
        getGame.mockRejectedValueOnce(new Error('Game not found'));
        const res = await (0, supertest_1.default)(app_1.default).get('/api/v1/games/missing');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Game not found');
    });
    it('POST /api/v1/games/:gameId/finish → 200 with finished game', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/games/game-1/finish');
        expect(res.status).toBe(200);
        expect(res.body.state).toBe(game_1.GameState.FINISHED);
    });
});
//# sourceMappingURL=game.test.js.map