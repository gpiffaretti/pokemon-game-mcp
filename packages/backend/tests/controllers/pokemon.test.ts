import request from 'supertest';
import { GameState } from '../../src/types/game';

const mockCaptured = [{ gameId: 'game-1', pokemonId: 25, capturedAt: new Date().toISOString() }];
const mockStarter = { gameId: 'game-1', pokemonId: 1, selectedAt: new Date().toISOString() };
const mockMoves = [{ id: 10, name: 'tackle', type: 'normal' }];

jest.mock('../../src/services/pokemonService', () => ({
  getCapturedPokemon: jest.fn().mockResolvedValue(mockCaptured),
  getStartingPokemon: jest.fn().mockResolvedValue(mockStarter),
  setStartingPokemon: jest.fn().mockResolvedValue(mockStarter),
  getMovesForStartingPokemon: jest.fn().mockResolvedValue(mockMoves),
}));

jest.mock('../../src/db/client', () => ({ db: {} }));

import app from '../../src/app';

describe('Pokemon routes', () => {
  it('GET /api/v1/games/:gameId/captured → 200 with captured list', async () => {
    const res = await request(app).get('/api/v1/games/game-1/captured');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('GET /api/v1/games/:gameId/starting → 200 with starter', async () => {
    const res = await request(app).get('/api/v1/games/game-1/starting');
    expect(res.status).toBe(200);
    expect(res.body.pokemonId).toBe(1);
  });

  it('PUT /api/v1/games/:gameId/starting → 400 when pokemonId missing', async () => {
    const res = await request(app).put('/api/v1/games/game-1/starting').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('PUT /api/v1/games/:gameId/starting → 400 when pokemonId is not a number', async () => {
    const res = await request(app).put('/api/v1/games/game-1/starting').send({ pokemonId: 'abc' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('PUT /api/v1/games/:gameId/starting → 200 with valid pokemonId', async () => {
    const res = await request(app).put('/api/v1/games/game-1/starting').send({ pokemonId: 1 });
    expect(res.status).toBe(200);
    expect(res.body.pokemonId).toBe(1);
  });

  it('PUT /api/v1/games/:gameId/starting → 409 when changing during battle', async () => {
    const { setStartingPokemon } = require('../../src/services/pokemonService');
    setStartingPokemon.mockRejectedValueOnce(new Error('Cannot change starting pokemon during a battle'));

    const res = await request(app).put('/api/v1/games/game-1/starting').send({ pokemonId: 1 });
    expect(res.status).toBe(500);
  });

  it('GET /api/v1/games/:gameId/starting/moves → 200 with moves', async () => {
    const res = await request(app).get('/api/v1/games/game-1/starting/moves');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});
