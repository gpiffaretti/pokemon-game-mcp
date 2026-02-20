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

describe('pokemonService.setStartingPokemon', () => {
  it('throws if game not found', async () => {
    mockWhere.mockResolvedValue([]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(pokemonService.setStartingPokemon('missing', 1)).rejects.toThrow('Game not found');
  });

  it('throws if game is in BATTLING state', async () => {
    mockWhere.mockResolvedValue([makeGame(GameState.BATTLING)]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(pokemonService.setStartingPokemon('game-1', 1)).rejects.toThrow('Cannot change starting pokemon during a battle');
  });

  it('upserts starting pokemon and transitions state from SELECTING to EXPLORING', async () => {
    const starter = { gameId: 'game-1', pokemonId: 1, selectedAt: new Date() };
    mockWhere.mockResolvedValue([makeGame(GameState.SELECTING_STARTING_POKEMON)]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    mockReturning.mockResolvedValue([starter]);
    mockOnConflictDoUpdate.mockReturnValue({ returning: mockReturning });
    mockValues.mockReturnValue({ onConflictDoUpdate: mockOnConflictDoUpdate });
    mockInsert.mockReturnValue({ values: mockValues });

    const mockUpdateWhere = jest.fn().mockResolvedValue([]);
    mockSet.mockReturnValue({ where: mockUpdateWhere });
    mockUpdate.mockReturnValue({ set: mockSet });

    const result = await pokemonService.setStartingPokemon('game-1', 1);
    expect(result).toEqual(starter);
    expect(mockUpdate).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({ state: GameState.EXPLORING }));
  });

  it('upserts starting pokemon without state transition when already EXPLORING', async () => {
    const starter = { gameId: 'game-1', pokemonId: 2, selectedAt: new Date() };
    mockWhere.mockResolvedValue([makeGame(GameState.EXPLORING)]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    mockReturning.mockResolvedValue([starter]);
    mockOnConflictDoUpdate.mockReturnValue({ returning: mockReturning });
    mockValues.mockReturnValue({ onConflictDoUpdate: mockOnConflictDoUpdate });
    mockInsert.mockReturnValue({ values: mockValues });

    const result = await pokemonService.setStartingPokemon('game-1', 2);
    expect(result).toEqual(starter);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe('pokemonService.getMovesForStartingPokemon', () => {
  it('throws if no starting pokemon selected', async () => {
    mockWhere.mockResolvedValue([]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(pokemonService.getMovesForStartingPokemon('game-1')).rejects.toThrow('No starting pokemon selected');
  });

  it('returns moves for the starting pokemon', async () => {
    mockWhere.mockResolvedValue([{ gameId: 'game-1', pokemonId: 1 }]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    const moves = await pokemonService.getMovesForStartingPokemon('game-1');
    expect(moves).toEqual([{ id: 1, name: 'tackle', type: 'normal' }]);
  });
});
