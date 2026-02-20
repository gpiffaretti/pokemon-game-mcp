import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { games } from '../db/schema';
import { GameState } from '../types/game';
import { MoveResult, BattleResult } from '../types/battle';
import { Move } from '../types/pokemon';
import { getPokemonMoves } from './pokedexService';
import { capturePokemon, getStartingPokemon } from './pokemonService';

export async function startBattle(gameId: string, wildPokemonId: number): Promise<void> {
  const rows = await db.select().from(games).where(eq(games.id, gameId));
  if (rows.length === 0) throw new Error('Game not found');
  if (rows[0].state !== GameState.EXPLORING) {
    throw new Error('Can only start a battle while exploring');
  }
  await db
    .update(games)
    .set({ state: GameState.BATTLING, wildPokemonId, updatedAt: new Date() })
    .where(eq(games.id, gameId));
}

export async function performMove(gameId: string, playerMoveId: number): Promise<MoveResult> {
  const rows = await db.select().from(games).where(eq(games.id, gameId));
  if (rows.length === 0) throw new Error('Game not found');
  const game = rows[0];
  if (game.state !== GameState.BATTLING) {
    throw new Error('No active battle');
  }
  if (!game.wildPokemonId) throw new Error('No wild pokemon in battle');

  const starter = await getStartingPokemon(gameId);
  if (!starter) throw new Error('No starting pokemon selected');

  const [playerMoves, opponentMoves] = await Promise.all([
    getPokemonMoves(starter.pokemonId),
    getPokemonMoves(game.wildPokemonId),
  ]);

  const playerMove = playerMoves.find((m) => m.id === playerMoveId);
  if (!playerMove) throw new Error('Move not found for starting pokemon');

  const opponentMove = opponentMoves[Math.floor(Math.random() * opponentMoves.length)];

  return { playerMove, opponentMove };
}

export async function flee(gameId: string): Promise<void> {
  const rows = await db.select().from(games).where(eq(games.id, gameId));
  if (rows.length === 0) throw new Error('Game not found');
  if (rows[0].state !== GameState.BATTLING) {
    throw new Error('No active battle to flee from');
  }
  await db
    .update(games)
    .set({ state: GameState.EXPLORING, wildPokemonId: null, updatedAt: new Date() })
    .where(eq(games.id, gameId));
}

export async function throwPokeball(gameId: string, wildPokemonId: number): Promise<BattleResult> {
  const rows = await db.select().from(games).where(eq(games.id, gameId));
  if (rows.length === 0) throw new Error('Game not found');
  if (rows[0].state !== GameState.BATTLING) {
    throw new Error('No active battle');
  }

  await capturePokemon(gameId, wildPokemonId);

  await db
    .update(games)
    .set({ state: GameState.EXPLORING, wildPokemonId: null, updatedAt: new Date() })
    .where(eq(games.id, gameId));

  return { playerMove: { id: 0, name: 'pokeball', type: 'normal' }, opponentMove: { id: 0, name: 'none', type: 'normal' }, captured: true };
}
