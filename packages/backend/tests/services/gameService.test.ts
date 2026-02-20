import { GameState } from '../../src/types/game';

const mockReturning = jest.fn();
const mockWhere = jest.fn();
const mockSet = jest.fn();
const mockValues = jest.fn();
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();

const makeGame = (state: GameState) => ({
  id: 'game-1',
  state,
  currentAreaId: null,
  wildPokemonId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

jest.mock('../../src/db/client', () => ({
  db: {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
  },
}));

jest.mock('../../src/services/pokedexService', () => ({
  getArea: jest.fn().mockResolvedValue({ id: 1, name: 'pallet-town-area' }),
  getPokemon: jest.fn().mockResolvedValue({ id: 1, name: 'bulbasaur', types: ['grass'], moves: [] }),
}));

import * as gameService from '../../src/services/gameService';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('gameService.createGame', () => {
  it('inserts a new game and returns enriched game', async () => {
    const newGame = makeGame(GameState.SELECTING_STARTING_POKEMON);
    mockReturning.mockResolvedValue([newGame]);
    mockValues.mockReturnValue({ returning: mockReturning });
    mockInsert.mockReturnValue({ values: mockValues });

    const result = await gameService.createGame();
    expect(mockInsert).toHaveBeenCalled();
    expect(result.id).toBe('game-1');
    expect(result.state).toBe(GameState.SELECTING_STARTING_POKEMON);
    expect(result).not.toHaveProperty('currentAreaId');
    expect(result).toHaveProperty('currentArea');
  });
});

describe('gameService.getGame', () => {
  it('returns enriched game when found', async () => {
    const game = makeGame(GameState.EXPLORING);
    mockWhere.mockResolvedValue([game]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    const result = await gameService.getGame('game-1');
    expect(result.id).toBe('game-1');
    expect(result.state).toBe(GameState.EXPLORING);
    expect(result).not.toHaveProperty('currentAreaId');
    expect(result).toHaveProperty('currentArea');
  });

  it('throws when game not found', async () => {
    mockWhere.mockResolvedValue([]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(gameService.getGame('missing')).rejects.toThrow('Game not found');
  });
});

describe('gameService.updateGameState', () => {
  it('updates state and returns the updated game', async () => {
    const updated = makeGame(GameState.FINISHED);
    mockReturning.mockResolvedValue([updated]);
    mockWhere.mockReturnValue({ returning: mockReturning });
    mockSet.mockReturnValue({ where: mockWhere });
    mockUpdate.mockReturnValue({ set: mockSet });

    const result = await gameService.updateGameState('game-1', GameState.FINISHED);
    expect(result.state).toBe(GameState.FINISHED);
  });

  it('throws when game not found during update', async () => {
    mockReturning.mockResolvedValue([]);
    mockWhere.mockReturnValue({ returning: mockReturning });
    mockSet.mockReturnValue({ where: mockWhere });
    mockUpdate.mockReturnValue({ set: mockSet });

    await expect(gameService.updateGameState('missing', GameState.FINISHED)).rejects.toThrow('Game not found');
  });
});

describe('gameService.finishGame', () => {
  it('sets state to FINISHED', async () => {
    const finished = makeGame(GameState.FINISHED);
    mockReturning.mockResolvedValue([finished]);
    mockWhere.mockReturnValue({ returning: mockReturning });
    mockSet.mockReturnValue({ where: mockWhere });
    mockUpdate.mockReturnValue({ set: mockSet });

    const result = await gameService.finishGame('game-1');
    expect(result.state).toBe(GameState.FINISHED);
  });
});
