import { GameState } from '../../src/types/game';
import { Move } from '../../src/types/pokemon';

const mockReturning = jest.fn();
const mockWhere = jest.fn();
const mockSet = jest.fn();
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockUpdate = jest.fn();

const makeGame = (overrides: Partial<{ state: GameState; wildPokemonId: number | null }> = {}) => ({
  id: 'game-1',
  state: GameState.BATTLING,
  currentAreaId: 1,
  wildPokemonId: 25,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const mockMove: Move = { id: 10, name: 'tackle', type: 'normal' };

jest.mock('../../src/db/client', () => ({
  db: {
    select: mockSelect,
    update: mockUpdate,
  },
}));

const mockPokemon = { id: 25, name: 'pikachu', types: ['electric'], moves: [mockMove] };

jest.mock('../../src/services/pokemonService', () => ({
  getCurrentPokemonRaw: jest.fn().mockResolvedValue({ pokemonId: 1 }),
  capturePokemon: jest.fn().mockResolvedValue({ gameId: 'game-1', pokemonId: 25 }),
}));

jest.mock('../../src/services/pokedexService', () => ({
  getPokemonMoves: jest.fn().mockResolvedValue([mockMove]),
  getPokemon: jest.fn().mockResolvedValue(mockPokemon),
  getArea: jest.fn().mockResolvedValue({ id: 1, name: 'pallet-town-area' }),
}));

jest.mock('../../src/services/gameService', () => ({
  enrichGame: jest.fn().mockResolvedValue({
    id: 'game-1',
    state: 'BATTLING',
    currentArea: null,
    wildPokemon: mockPokemon,
    currentPokemon: null,
    createdAt: null,
    updatedAt: null,
  }),
}));

import * as battleService from '../../src/services/battleService';
import * as pokemonService from '../../src/services/pokemonService';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('battleService.startBattle', () => {
  it('throws if game not found', async () => {
    mockWhere.mockResolvedValue([]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(battleService.startBattle('missing', 25)).rejects.toThrow('Game not found');
  });

  it('throws if not in EXPLORING state', async () => {
    mockWhere.mockResolvedValue([makeGame({ state: GameState.BATTLING })]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(battleService.startBattle('game-1', 25)).rejects.toThrow('Can only start a battle while exploring');
  });

  it('sets state to BATTLING when exploring', async () => {
    mockWhere.mockResolvedValue([makeGame({ state: GameState.EXPLORING })]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    const mockUpdateWhere = jest.fn().mockResolvedValue([makeGame()]);
    const mockReturning2 = jest.fn().mockResolvedValue([makeGame()]);
    mockSet.mockReturnValue({ where: jest.fn().mockReturnValue({ returning: mockReturning2 }) });
    mockUpdate.mockReturnValue({ set: mockSet });

    await battleService.startBattle('game-1', 25);
    expect(mockUpdate).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({ state: GameState.BATTLING, wildPokemonId: 25 }));
  });
});

describe('battleService.performMove', () => {
  it('throws if no active battle', async () => {
    mockWhere.mockResolvedValue([makeGame({ state: GameState.EXPLORING })]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(battleService.performMove('game-1', 10)).rejects.toThrow('No active battle');
  });

  it('throws if move not found for starting pokemon', async () => {
    mockWhere.mockResolvedValue([makeGame()]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(battleService.performMove('game-1', 999)).rejects.toThrow('Move not found for starting pokemon');
  });

  it('returns player and opponent moves', async () => {
    mockWhere.mockResolvedValue([makeGame()]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    const result = await battleService.performMove('game-1', 10);
    expect(result.playerMove).toEqual(mockMove);
    expect(result.opponentMove).toEqual(mockMove);
  });
});

describe('battleService.flee', () => {
  it('throws if no active battle', async () => {
    mockWhere.mockResolvedValue([makeGame({ state: GameState.EXPLORING })]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(battleService.flee('game-1')).rejects.toThrow('No active battle to flee from');
  });

  it('sets state back to EXPLORING', async () => {
    mockWhere.mockResolvedValue([makeGame()]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    const mockUpdateWhere = jest.fn().mockResolvedValue([]);
    mockSet.mockReturnValue({ where: mockUpdateWhere });
    mockUpdate.mockReturnValue({ set: mockSet });

    await battleService.flee('game-1');
    expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({ state: GameState.EXPLORING, wildPokemonId: null }));
  });
});

describe('battleService.throwPokeball', () => {
  it('throws if no active battle', async () => {
    mockWhere.mockResolvedValue([makeGame({ state: GameState.EXPLORING })]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    await expect(battleService.throwPokeball('game-1', 25)).rejects.toThrow('No active battle');
  });

  it('captures pokemon and returns the captured Pokemon object', async () => {
    mockWhere.mockResolvedValue([makeGame()]);
    mockFrom.mockReturnValue({ where: mockWhere });
    mockSelect.mockReturnValue({ from: mockFrom });

    const mockUpdateWhere = jest.fn().mockResolvedValue([]);
    mockSet.mockReturnValue({ where: mockUpdateWhere });
    mockUpdate.mockReturnValue({ set: mockSet });

    const result = await battleService.throwPokeball('game-1', 25);
    expect(pokemonService.capturePokemon).toHaveBeenCalledWith('game-1', 25);
    expect(result).toEqual(mockPokemon);
  });
});
