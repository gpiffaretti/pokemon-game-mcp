"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mockBattleResult = {
    playerMove: { id: 10, name: 'tackle', type: 'normal' },
    opponentMove: { id: 10, name: 'tackle', type: 'normal' },
};
const mockEnrichedGame = {
    id: 'game-1',
    state: 'BATTLING',
    currentArea: null,
    wildPokemon: { id: 25, name: 'pikachu', types: ['electric'], moves: [] },
    currentPokemon: null,
    createdAt: null,
    updatedAt: null,
};
const mockCapturedPokemon = { id: 25, name: 'pikachu', types: ['electric'], moves: [] };
jest.mock('../../src/services/battleService', () => ({
    startBattle: jest.fn().mockResolvedValue(mockEnrichedGame),
    performMove: jest.fn().mockResolvedValue(mockBattleResult),
    flee: jest.fn().mockResolvedValue(undefined),
    throwPokeball: jest.fn().mockResolvedValue(mockCapturedPokemon),
}));
jest.mock('../../src/db/client', () => ({ db: {} }));
const app_1 = __importDefault(require("../../src/app"));
describe('Battle routes', () => {
    it('POST /api/v1/games/:gameId/start → 400 when wildPokemonId missing', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/games/game-1/start').send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });
    it('POST /api/v1/games/:gameId/start → 200 with enriched game', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/games/game-1/start').send({ wildPokemonId: 25 });
        expect(res.status).toBe(200);
        expect(res.body.state).toBe('BATTLING');
        expect(res.body.wildPokemon).toBeDefined();
    });
    it('POST /api/v1/games/:gameId/move → 400 when moveId missing', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/games/game-1/move').send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });
    it('POST /api/v1/games/:gameId/move → 200 with valid moveId', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/games/game-1/move').send({ moveId: 10 });
        expect(res.status).toBe(200);
        expect(res.body.playerMove).toBeDefined();
        expect(res.body.opponentMove).toBeDefined();
    });
    it('POST /api/v1/games/:gameId/flee → 204', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/games/game-1/flee');
        expect(res.status).toBe(204);
    });
    it('POST /api/v1/games/:gameId/catch → 400 when wildPokemonId missing', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/games/game-1/catch').send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });
    it('POST /api/v1/games/:gameId/catch → 200 with captured Pokemon', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/games/game-1/catch').send({ wildPokemonId: 25 });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('pikachu');
        expect(res.body.id).toBe(25);
    });
    it('POST /api/v1/games/:gameId/catch → 409 when already captured', async () => {
        const { throwPokeball } = require('../../src/services/battleService');
        throwPokeball.mockRejectedValueOnce(new Error('Pokemon already captured'));
        const res = await (0, supertest_1.default)(app_1.default).post('/api/v1/games/game-1/catch').send({ wildPokemonId: 25 });
        expect(res.status).toBe(409);
    });
});
//# sourceMappingURL=battle.test.js.map