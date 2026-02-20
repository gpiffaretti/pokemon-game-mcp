import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { capturedPokemon, games } from '../db/schema';
import { CapturedPokemon, Game, GameState, EnrichedGame } from '../types/game';
import { Move, Pokemon } from '../types/pokemon';
import { getPokemon, getPokemonMoves } from './pokedexService';
import { enrichGame } from './gameService';

const STARTER_POKEMON_IDS = [1, 4, 7];

export async function getStarterOptions(): Promise<Pokemon[]> {
  return Promise.all(STARTER_POKEMON_IDS.map((id) => getPokemon(id)));
}

export async function getCapturedPokemon(gameId: string): Promise<Pokemon[]> {
  const rows = await db.select().from(capturedPokemon).where(eq(capturedPokemon.gameId, gameId));
  return Promise.all(rows.map((r) => getPokemon(r.pokemonId)));
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

export async function getCurrentPokemon(gameId: string): Promise<Pokemon | null> {
  const rows = await db.select().from(games).where(eq(games.id, gameId));
  if (rows.length === 0) throw new Error('Game not found');
  const { currentPokemonId } = rows[0];
  return currentPokemonId != null ? getPokemon(currentPokemonId) : null;
}

export async function getCurrentPokemonRaw(gameId: string): Promise<{ pokemonId: number } | null> {
  const rows = await db.select().from(games).where(eq(games.id, gameId));
  if (rows.length === 0) throw new Error('Game not found');
  const { currentPokemonId } = rows[0];
  return currentPokemonId != null ? { pokemonId: currentPokemonId } : null;
}

export async function setCurrentPokemon(gameId: string, pokemonId: number): Promise<EnrichedGame> {
  const gameRows = await db.select().from(games).where(eq(games.id, gameId));
  if (gameRows.length === 0) throw new Error('Game not found');
  if (gameRows[0].state === GameState.BATTLING) {
    throw new Error('Cannot change current pokemon during a battle');
  }

  const isInitialSelection = gameRows[0].state === GameState.SELECTING_STARTING_POKEMON;

  if (isInitialSelection) {
    const validIds = STARTER_POKEMON_IDS;
    if (!validIds.includes(pokemonId)) {
      throw new Error(`Invalid starter. Choose one of: ${validIds.join(', ')}`);
    }
    await db
      .insert(capturedPokemon)
      .values({ gameId, pokemonId })
      .onConflictDoNothing();
  } else {
    const captured = await db.select().from(capturedPokemon).where(eq(capturedPokemon.gameId, gameId));
    if (!captured.some((p) => p.pokemonId === pokemonId)) {
      throw new Error('Pokemon not in captured collection');
    }
  }

  const updatedRows = await db
    .update(games)
    .set({
      currentPokemonId: pokemonId,
      ...(isInitialSelection ? { state: GameState.EXPLORING } : {}),
      updatedAt: new Date(),
    })
    .where(eq(games.id, gameId))
    .returning();

  return enrichGame(updatedRows[0] as Game);
}

export async function getMovesForCurrentPokemon(gameId: string): Promise<Move[]> {
  const current = await getCurrentPokemonRaw(gameId);
  if (!current) throw new Error('No current pokemon selected');
  return getPokemonMoves(current.pokemonId);
}
