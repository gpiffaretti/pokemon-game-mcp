import request from 'supertest';
import { GameState } from '../../src/types/game';

const mockGame = {
  id: 'game-1',
  state: GameState.SELECTING_STARTING_POKEMON,
  currentArea: null,
  wildPokemon: null,
  currentPokemon: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

jest.mock('../../src/services/gameService', () => ({
  createGame: jest.fn().mockResolvedValue(mockGame),
  getGame: jest.fn().mockResolvedValue(mockGame),
  finishGame: jest.fn().mockResolvedValue({ ...mockGame, state: GameState.FINISHED }),
}));

jest.mock('../../src/db/client', () => ({ db: {} }));

import app from '../../src/app';

describe('Game routes', () => {
  it('POST /api/v1/games → 201 with new game', async () => {
    const res = await request(app).post('/api/v1/games');
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('game-1');
  });

  it('GET /api/v1/games/:gameId → 200 with game', async () => {
    const res = await request(app).get('/api/v1/games/game-1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('game-1');
  });

  it('GET /api/v1/games/:gameId → 404 when not found', async () => {
    const { getGame } = require('../../src/services/gameService');
    getGame.mockRejectedValueOnce(new Error('Game not found'));

    const res = await request(app).get('/api/v1/games/missing');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Game not found');
  });

  it('POST /api/v1/games/:gameId/finish → 200 with finished game', async () => {
    const res = await request(app).post('/api/v1/games/game-1/finish');
    expect(res.status).toBe(200);
    expect(res.body.state).toBe(GameState.FINISHED);
  });
});
