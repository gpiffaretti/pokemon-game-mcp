import { Game, CapturedPokemon } from '../types/game';
import { Pokemon, Move } from '../types/pokemon';
import { MoveResult, BattleResult, CaptureResult } from '../types/battle';
import { Area, AreaEncounter } from '../types/area';

export function formatGame(game: Game): string {
  const area = game.currentAreaId != null ? `area=${game.currentAreaId}` : 'no area';
  return `Game ${game.id}: state=${game.state}, ${area}`;
}

export function formatCapturedPokemonList(list: CapturedPokemon[]): string {
  if (list.length === 0) return 'No Pokemon captured yet.';
  return list.map((p, i) => `${i + 1}. Pokemon #${p.pokemonId} (captured at ${p.capturedAt})`).join('\n');
}

export function formatPokemon(pokemon: Pokemon): string {
  const types = pokemon.types.join(', ');
  const moves = pokemon.moves.map((m) => `${m.name} (${m.type})`).join(', ');
  return `${pokemon.name} [#${pokemon.id}] — Types: ${types} | Moves: ${moves}`;
}

export function formatMoveList(moves: Move[]): string {
  if (moves.length === 0) return 'No moves available.';
  return moves.map((m, i) => `${i + 1}. ${m.name} (${m.type}) [id: ${m.id}]`).join('\n');
}

export function formatMoveResult(result: MoveResult): string {
  return `You used ${result.playerMove.name}! Opponent used ${result.opponentMove.name}.`;
}

export function formatBattleResult(result: BattleResult): string {
  let text = formatMoveResult(result);
  if (result.captured) text += ' You caught the wild Pokemon!';
  if (result.fled) text += ' You fled the battle!';
  return text;
}

export function formatCaptureResult(result: CaptureResult): string {
  return `You caught the wild Pokemon! ${formatPokemon(result.capturedPokemon)}`;
}

export function formatArea(area: Area): string {
  return `Area #${area.id}: ${area.name}`;
}

export function formatAreaEncounters(area: Area, encounters: AreaEncounter[]): string {
  const header = `Area #${area.id}: ${area.name}`;
  if (encounters.length === 0) return `${header}\nNo Pokemon encounters in this area.`;
  const rows = encounters
    .map((e) => `  - ${e.pokemonName} (#${e.pokemonId}) — encounter rate: ${e.encounterRate}%`)
    .join('\n');
  return `${header}\nEncounters:\n${rows}`;
}
