import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { games } from '../db/schema';
import { Game, GameState, EnrichedGame } from '../types/game';
import { MoveResult } from '../types/battle';
import { Pokemon } from '../types/pokemon';
import { getPokemon, getPokemonMoves } from './pokedexService';
import { capturePokemon, getCurrentPokemonRaw } from './pokemonService';
import { enrichGame } from './gameService';

export async function startBattle(gameId: string, wildPokemonId: number): Promise<EnrichedGame> {
  const rows = await db.select().from(games).where(eq(games.id, gameId));
  if (rows.length === 0) throw new Error('Game not found');
  if (rows[0].state !== GameState.EXPLORING) {
    throw new Error('Can only start a battle while exploring');
  }
  const updatedRows = await db
    .update(games)
    .set({ state: GameState.BATTLING, wildPokemonId, updatedAt: new Date() })
    .where(eq(games.id, gameId))
    .returning();
  return enrichGame(updatedRows[0] as Game);
}

export async function performMove(gameId: string, playerMoveId: number): Promise<MoveResult> {
  const rows = await db.select().from(games).where(eq(games.id, gameId));
  if (rows.length === 0) throw new Error('Game not found');
  const game = rows[0];
  if (game.state !== GameState.BATTLING) {
    throw new Error('No active battle');
  }
  if (!game.wildPokemonId) throw new Error('No wild pokemon in battle');

  const current = await getCurrentPokemonRaw(gameId);
  if (!current) throw new Error('No current pokemon selected');

  const [playerMoves, opponentMoves] = await Promise.all([
    getPokemonMoves(current.pokemonId),
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

export async function throwPokeball(gameId: string): Promise<Pokemon> {
  const rows = await db.select().from(games).where(eq(games.id, gameId));
  if (rows.length === 0) throw new Error('Game not found');
  const game = rows[0];
  if (game.state !== GameState.BATTLING) {
    throw new Error('No active battle');
  }
  if (!game.wildPokemonId) throw new Error('No wild pokemon in battle');

  await capturePokemon(gameId, game.wildPokemonId);

  await db
    .update(games)
    .set({ state: GameState.EXPLORING, wildPokemonId: null, updatedAt: new Date() })
    .where(eq(games.id, gameId));

  return getPokemon(game.wildPokemonId);
}
