"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
jest.mock('../../src/services/pokemonService', () => ({
    getStarterOptions: jest.fn().mockResolvedValue([
        { id: 1, name: 'bulbasaur', types: ['grass'], moves: [] },
        { id: 4, name: 'charmander', types: ['fire'], moves: [] },
        { id: 7, name: 'squirtle', types: ['water'], moves: [] },
    ]),
    getCapturedPokemon: jest.fn().mockResolvedValue([
        { gameId: 'game-1', pokemonId: 25, capturedAt: new Date().toISOString() },
    ]),
    getCurrentPokemon: jest.fn().mockResolvedValue({ pokemonId: 1 }),
    setCurrentPokemon: jest.fn().mockResolvedValue({
        id: 'game-1', state: 'EXPLORING', currentAreaId: null, wildPokemonId: null,
        currentPokemonId: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }),
    getMovesForCurrentPokemon: jest.fn().mockResolvedValue([{ id: 10, name: 'tackle', type: 'normal' }]),
}));
jest.mock('../../src/db/client', () => ({ db: {} }));
const app_1 = __importDefault(require("../../src/app"));
describe('Pokemon routes', () => {
    it('GET /api/v1/games/starter-options → 200 with starter list', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/v1/games/starter-options');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(3);
    });
    it('GET /api/v1/games/:gameId/captured → 200 with captured list', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/v1/games/game-1/captured');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });
    it('GET /api/v1/games/:gameId/current → 200 with current pokemon', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/v1/games/game-1/current');
        expect(res.status).toBe(200);
        expect(res.body.pokemonId).toBe(1);
    });
    it('PUT /api/v1/games/:gameId/current → 400 when pokemonId missing', async () => {
        const res = await (0, supertest_1.default)(app_1.default).put('/api/v1/games/game-1/current').send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });
    it('PUT /api/v1/games/:gameId/current → 400 when pokemonId is not a number', async () => {
        const res = await (0, supertest_1.default)(app_1.default).put('/api/v1/games/game-1/current').send({ pokemonId: 'abc' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });
    it('PUT /api/v1/games/:gameId/current → 200 with valid pokemonId', async () => {
        const res = await (0, supertest_1.default)(app_1.default).put('/api/v1/games/game-1/current').send({ pokemonId: 1 });
        expect(res.status).toBe(200);
        expect(res.body.currentPokemonId).toBe(1);
    });
    it('PUT /api/v1/games/:gameId/current → 500 when changing during battle', async () => {
        const { setCurrentPokemon } = require('../../src/services/pokemonService');
        setCurrentPokemon.mockRejectedValueOnce(new Error('Cannot change current pokemon during a battle'));
        const res = await (0, supertest_1.default)(app_1.default).put('/api/v1/games/game-1/current').send({ pokemonId: 1 });
        expect(res.status).toBe(500);
    });
    it('GET /api/v1/games/:gameId/current/moves → 200 with moves', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/v1/games/game-1/current/moves');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });
});
//# sourceMappingURL=pokemon.test.js.map