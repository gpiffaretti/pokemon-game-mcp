import { GameState } from '../../src/types/game';

const mockReturning = jest.fn();
const mockWhere = jest.fn();
const mockSet = jest.fn();
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockOnConflictDoUpdate = jest.fn();
const mockValues = jest.fn();

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
  getPokemonMoves: jest.fn().mockResolvedValue([{ id: 1, name: 'tackle', type: 'normal' }]),
  getPokemon: jest.fn().mockResolvedValue({ id: 1, name: 'bulbasaur', types: ['grass'], moves: [] }),
}));

jest.mock('../../src/services/gameService', () => ({
  enrichGame: jest.fn().mockImplementation((game: any) =>
    Promise.resolve({
      id: game.id,
      state: game.state,
      currentArea: null,
      wildPokemon: null,
      currentPokemon: { id: game.currentPokemonId, name: 'bulbasaur', types: ['grass'], moves: [] },
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    })
  ),
}));

import * as pokemonService from '../../src/services/pokemonService';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('pokemonService.capturePokemon', () => {
  it('throws if pokemon already captured', async () => {
    mockWhere.mockResolvedValue([{ gameId: 'game-1', pokemonId: 25 }]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(pokemonService.capturePokemon('game-1', 25)).rejects.toThrow('Pokemon already captured');
  });

  it('inserts and returns captured pokemon when not a duplicate', async () => {
    const captured = { gameId: 'game-1', pokemonId: 25, capturedAt: new Date() };
    mockWhere.mockResolvedValue([]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    mockReturning.mockResolvedValue([captured]);
    mockValues.mockReturnValue({ returning: mockReturning });
    mockInsert.mockReturnValue({ values: mockValues });

    const result = await pokemonService.capturePokemon('game-1', 25);
    expect(result).toEqual(captured);
    expect(mockInsert).toHaveBeenCalled();
  });
});

describe('pokemonService.setCurrentPokemon', () => {
  it('throws if game not found', async () => {
    mockWhere.mockResolvedValue([]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(pokemonService.setCurrentPokemon('missing', 1)).rejects.toThrow('Game not found');
  });

  it('throws if game is in BATTLING state', async () => {
    mockWhere.mockResolvedValue([makeGame(GameState.BATTLING)]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(pokemonService.setCurrentPokemon('game-1', 1)).rejects.toThrow('Cannot change current pokemon during a battle');
  });

  it('adds to captured and transitions state from SELECTING to EXPLORING for valid starter', async () => {
    const updatedGame = { ...makeGame(GameState.EXPLORING), currentPokemonId: 1 };
    mockWhere.mockResolvedValue([makeGame(GameState.SELECTING_STARTING_POKEMON)]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    const mockOnConflictDoNothing = jest.fn().mockResolvedValue([]);
    mockValues.mockReturnValue({ onConflictDoNothing: mockOnConflictDoNothing });
    mockInsert.mockReturnValue({ values: mockValues });

    const mockReturningUpdate = jest.fn().mockResolvedValue([updatedGame]);
    const mockUpdateWhere = jest.fn().mockReturnValue({ returning: mockReturningUpdate });
    mockSet.mockReturnValue({ where: mockUpdateWhere });
    mockUpdate.mockReturnValue({ set: mockSet });

    const result = await pokemonService.setCurrentPokemon('game-1', 1);
    expect(result.id).toBe('game-1');
    expect(result.state).toBe(GameState.EXPLORING);
    expect(result).toHaveProperty('currentPokemon');
    expect(result).not.toHaveProperty('currentPokemonId');
    expect(mockInsert).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({ state: GameState.EXPLORING, currentPokemonId: 1 }));
  });
});

describe('pokemonService.getMovesForCurrentPokemon', () => {
  it('throws if no current pokemon selected', async () => {
    mockWhere.mockResolvedValue([makeGame(GameState.EXPLORING)]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(pokemonService.getMovesForCurrentPokemon('game-1')).rejects.toThrow('No current pokemon selected');
  });

  it('returns moves for the current pokemon', async () => {
    mockWhere.mockResolvedValue([{ ...makeGame(GameState.EXPLORING), currentPokemonId: 1 }]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    const moves = await pokemonService.getMovesForCurrentPokemon('game-1');
    expect(moves).toEqual([{ id: 1, name: 'tackle', type: 'normal' }]);
  });
});
