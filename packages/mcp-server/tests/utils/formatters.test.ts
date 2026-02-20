import {
  formatGame,
  formatCapturedPokemonList,
  formatPokemon,
  formatMoveList,
  formatMoveResult,
  formatBattleResult,
  formatArea,
  formatAreaEncounters,
} from '../../src/utils/formatters';
import { Game } from '../../src/types/game';
import { Pokemon, Move } from '../../src/types/pokemon';
import { MoveResult, BattleResult } from '../../src/types/battle';
import { Area, AreaEncounter } from '../../src/types/area';

describe('formatGame', () => {
  it('includes game id, state, and area when area is set', () => {
    const game: Game = { id: 'abc-123', state: 'EXPLORING', currentAreaId: 5, createdAt: '', updatedAt: '' };
    expect(formatGame(game)).toBe('Game abc-123: state=EXPLORING, area=5');
  });

  it('shows "no area" when currentAreaId is null', () => {
    const game: Game = { id: 'xyz', state: 'SELECTING_STARTING_POKEMON', currentAreaId: null, createdAt: '', updatedAt: '' };
    expect(formatGame(game)).toBe('Game xyz: state=SELECTING_STARTING_POKEMON, no area');
  });
});

describe('formatCapturedPokemonList', () => {
  it('returns empty message when list is empty', () => {
    expect(formatCapturedPokemonList([])).toBe('No Pokemon captured yet.');
  });

  it('returns numbered list with pokemon ids and capture times', () => {
    const list = [
      { gameId: 'g1', pokemonId: 25, capturedAt: '2024-01-01T00:00:00Z' },
      { gameId: 'g1', pokemonId: 1, capturedAt: '2024-01-02T00:00:00Z' },
    ];
    const result = formatCapturedPokemonList(list);
    expect(result).toContain('1. Pokemon #25');
    expect(result).toContain('2. Pokemon #1');
  });
});

describe('formatPokemon', () => {
  it('formats pokemon name, id, types, and moves', () => {
    const pokemon: Pokemon = {
      id: 25,
      name: 'pikachu',
      types: ['electric'],
      moves: [{ id: 84, name: 'thunder-shock', type: 'electric' }],
    };
    const result = formatPokemon(pokemon);
    expect(result).toContain('pikachu');
    expect(result).toContain('#25');
    expect(result).toContain('electric');
    expect(result).toContain('thunder-shock');
  });

  it('handles multiple types and moves', () => {
    const pokemon: Pokemon = {
      id: 6,
      name: 'charizard',
      types: ['fire', 'flying'],
      moves: [
        { id: 1, name: 'flamethrower', type: 'fire' },
        { id: 2, name: 'fly', type: 'flying' },
      ],
    };
    const result = formatPokemon(pokemon);
    expect(result).toContain('fire, flying');
    expect(result).toContain('flamethrower');
    expect(result).toContain('fly');
  });
});

describe('formatMoveList', () => {
  it('returns no-moves message when list is empty', () => {
    expect(formatMoveList([])).toBe('No moves available.');
  });

  it('returns numbered list with move name, type, and id', () => {
    const moves: Move[] = [
      { id: 10, name: 'tackle', type: 'normal' },
      { id: 45, name: 'growl', type: 'normal' },
    ];
    const result = formatMoveList(moves);
    expect(result).toContain('1. tackle (normal) [id: 10]');
    expect(result).toContain('2. growl (normal) [id: 45]');
  });
});

describe('formatMoveResult', () => {
  it('formats player and opponent move names', () => {
    const result: MoveResult = {
      playerMove: { id: 10, name: 'tackle', type: 'normal' },
      opponentMove: { id: 45, name: 'growl', type: 'normal' },
    };
    expect(formatMoveResult(result)).toBe('You used tackle! Opponent used growl.');
  });
});

describe('formatBattleResult', () => {
  it('formats a basic move exchange with no capture or flee', () => {
    const result: BattleResult = {
      playerMove: { id: 10, name: 'tackle', type: 'normal' },
      opponentMove: { id: 45, name: 'growl', type: 'normal' },
    };
    expect(formatBattleResult(result)).toBe('You used tackle! Opponent used growl.');
  });

  it('appends capture message when captured is true', () => {
    const result: BattleResult = {
      playerMove: { id: 10, name: 'tackle', type: 'normal' },
      opponentMove: { id: 45, name: 'growl', type: 'normal' },
      captured: true,
    };
    expect(formatBattleResult(result)).toContain('You caught the wild Pokemon!');
  });

  it('appends flee message when fled is true', () => {
    const result: BattleResult = {
      playerMove: { id: 10, name: 'tackle', type: 'normal' },
      opponentMove: { id: 45, name: 'growl', type: 'normal' },
      fled: true,
    };
    expect(formatBattleResult(result)).toContain('You fled the battle!');
  });
});

describe('formatArea', () => {
  it('formats area id and name', () => {
    const area: Area = { id: 12, name: 'pallet-town-area' };
    expect(formatArea(area)).toBe('Area #12: pallet-town-area');
  });
});

describe('formatAreaEncounters', () => {
  it('shows no-encounters message when list is empty', () => {
    const area: Area = { id: 1, name: 'viridian-forest' };
    const result = formatAreaEncounters(area, []);
    expect(result).toContain('Area #1: viridian-forest');
    expect(result).toContain('No Pokemon encounters');
  });

  it('lists encounters with name, id, and encounter rate', () => {
    const area: Area = { id: 1, name: 'viridian-forest' };
    const encounters: AreaEncounter[] = [
      { pokemonId: 10, pokemonName: 'caterpie', encounterRate: 50 },
      { pokemonId: 13, pokemonName: 'weedle', encounterRate: 30 },
    ];
    const result = formatAreaEncounters(area, encounters);
    expect(result).toContain('caterpie (#10)');
    expect(result).toContain('50%');
    expect(result).toContain('weedle (#13)');
    expect(result).toContain('30%');
  });
});
