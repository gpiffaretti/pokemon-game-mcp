import request from 'supertest';
import { GameState } from '../../src/types/game';

const mockBattleResult = {
  playerMove: { id: 10, name: 'tackle', type: 'normal' },
  opponentMove: { id: 10, name: 'tackle', type: 'normal' },
};

const mockCaptureResult = { ...mockBattleResult, captured: true };

jest.mock('../../src/services/battleService', () => ({
  startBattle: jest.fn().mockResolvedValue(undefined),
  performMove: jest.fn().mockResolvedValue(mockBattleResult),
  flee: jest.fn().mockResolvedValue(undefined),
  throwPokeball: jest.fn().mockResolvedValue(mockCaptureResult),
}));

jest.mock('../../src/db/client', () => ({ db: {} }));

import app from '../../src/app';

describe('Battle routes', () => {
  it('POST /api/v1/games/:gameId/start → 400 when wildPokemonId missing', async () => {
    const res = await request(app).post('/api/v1/games/game-1/start').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/v1/games/:gameId/start → 204 with valid wildPokemonId', async () => {
    const res = await request(app).post('/api/v1/games/game-1/start').send({ wildPokemonId: 25 });
    expect(res.status).toBe(204);
  });

  it('POST /api/v1/games/:gameId/move → 400 when moveId missing', async () => {
    const res = await request(app).post('/api/v1/games/game-1/move').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/v1/games/:gameId/move → 200 with valid moveId', async () => {
    const res = await request(app).post('/api/v1/games/game-1/move').send({ moveId: 10 });
    expect(res.status).toBe(200);
    expect(res.body.playerMove).toBeDefined();
    expect(res.body.opponentMove).toBeDefined();
  });

  it('POST /api/v1/games/:gameId/flee → 204', async () => {
    const res = await request(app).post('/api/v1/games/game-1/flee');
    expect(res.status).toBe(204);
  });

  it('POST /api/v1/games/:gameId/catch → 400 when wildPokemonId missing', async () => {
    const res = await request(app).post('/api/v1/games/game-1/catch').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/v1/games/:gameId/catch → 200 with captured=true', async () => {
    const res = await request(app).post('/api/v1/games/game-1/catch').send({ wildPokemonId: 25 });
    expect(res.status).toBe(200);
    expect(res.body.captured).toBe(true);
  });

  it('POST /api/v1/games/:gameId/catch → 409 when already captured', async () => {
    const { throwPokeball } = require('../../src/services/battleService');
    throwPokeball.mockRejectedValueOnce(new Error('Pokemon already captured'));

    const res = await request(app).post('/api/v1/games/game-1/catch').send({ wildPokemonId: 25 });
    expect(res.status).toBe(409);
  });
});
