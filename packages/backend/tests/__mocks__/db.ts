import { GameState } from '../../src/types/game';

export const mockGame = {
  id: 'test-game-id',
  state: GameState.EXPLORING,
  currentAreaId: 1,
  wildPokemonId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const chainable = {
  values: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  returning: jest.fn().mockResolvedValue([mockGame]),
  onConflictDoUpdate: jest.fn().mockReturnThis(),
};

export const db = {
  select: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue([mockGame]),
    }),
  }),
  insert: jest.fn().mockReturnValue(chainable),
  update: jest.fn().mockReturnValue(chainable),
};
