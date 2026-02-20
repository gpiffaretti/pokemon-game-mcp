import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { capturedPokemon, startingPokemon, games } from '../db/schema';
import { CapturedPokemon, StartingPokemon, GameState } from '../types/game';
import { Move } from '../types/pokemon';
import { getPokemonMoves } from './pokedexService';

export async function getCapturedPokemon(gameId: string): Promise<CapturedPokemon[]> {
  return db.select().from(capturedPokemon).where(eq(capturedPokemon.gameId, gameId)) as Promise<CapturedPokemon[]>;
}

export async function capturePokemon(gameId: string, pokemonId: number): Promise<CapturedPokemon> {
  const existing = await db
    .select()
    .from(capturedPokemon)
    .where(eq(capturedPokemon.gameId, gameId));
  if (existing.some((p) => p.pokemonId === pokemonId)) {
    throw new Error('Pokemon already captured');
  }
  const rows = await db
    .insert(capturedPokemon)
    .values({ gameId, pokemonId })
    .returning();
  return rows[0] as CapturedPokemon;
}

export async function getStartingPokemon(gameId: string): Promise<StartingPokemon | null> {
  const rows = await db.select().from(startingPokemon).where(eq(startingPokemon.gameId, gameId));
  return rows.length > 0 ? (rows[0] as StartingPokemon) : null;
}

export async function setStartingPokemon(gameId: string, pokemonId: number): Promise<StartingPokemon> {
  const gameRows = await db.select().from(games).where(eq(games.id, gameId));
  if (gameRows.length === 0) throw new Error('Game not found');
  if (gameRows[0].state === GameState.BATTLING) {
    throw new Error('Cannot change starting pokemon during a battle');
  }
  const rows = await db
    .insert(startingPokemon)
    .values({ gameId, pokemonId })
    .onConflictDoUpdate({ target: startingPokemon.gameId, set: { pokemonId, selectedAt: new Date() } })
    .returning();
  if (gameRows[0].state === GameState.SELECTING_STARTING_POKEMON) {
    await db
      .update(games)
      .set({ state: GameState.EXPLORING, updatedAt: new Date() })
      .where(eq(games.id, gameId));
  }
  return rows[0] as StartingPokemon;
}

export async function getMovesForStartingPokemon(gameId: string): Promise<Move[]> {
  const starter = await getStartingPokemon(gameId);
  if (!starter) throw new Error('No starting pokemon selected');
  return getPokemonMoves(starter.pokemonId);
}
