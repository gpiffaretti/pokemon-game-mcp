import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { games } from '../db/schema';
import { Game, GameState, EnrichedGame } from '../types/game';
import { getArea, getPokemon } from './pokedexService';

async function enrichGame(game: Game): Promise<EnrichedGame> {
  const [currentArea, wildPokemon, currentPokemon] = await Promise.all([
    game.currentAreaId ? getArea(game.currentAreaId) : Promise.resolve(null),
    game.wildPokemonId ? getPokemon(game.wildPokemonId) : Promise.resolve(null),
    game.currentPokemonId ? getPokemon(game.currentPokemonId) : Promise.resolve(null),
  ]);
  return {
    id: game.id,
    state: game.state,
    currentArea,
    wildPokemon,
    currentPokemon,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
  };
}

export async function createGame(): Promise<EnrichedGame> {
  const rows = await db.insert(games).values({}).returning();
  return enrichGame(rows[0] as Game);
}

export async function getGame(gameId: string): Promise<EnrichedGame> {
  const rows = await db.select().from(games).where(eq(games.id, gameId));
  if (rows.length === 0) throw new Error('Game not found');
  return enrichGame(rows[0] as Game);
}

export async function updateGameState(gameId: string, state: GameState): Promise<EnrichedGame> {
  const rows = await db
    .update(games)
    .set({ state, updatedAt: new Date() })
    .where(eq(games.id, gameId))
    .returning();
  if (rows.length === 0) throw new Error('Game not found');
  return enrichGame(rows[0] as Game);
}

export async function finishGame(gameId: string): Promise<EnrichedGame> {
  return updateGameState(gameId, GameState.FINISHED);
}

export { enrichGame };
