import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { games } from '../db/schema';
import { Game, GameState } from '../types/game';

export async function createGame(): Promise<Game> {
  const rows = await db.insert(games).values({}).returning();
  return rows[0] as Game;
}

export async function getGame(gameId: string): Promise<Game> {
  const rows = await db.select().from(games).where(eq(games.id, gameId));
  if (rows.length === 0) throw new Error('Game not found');
  return rows[0] as Game;
}

export async function updateGameState(gameId: string, state: GameState): Promise<Game> {
  const rows = await db
    .update(games)
    .set({ state, updatedAt: new Date() })
    .where(eq(games.id, gameId))
    .returning();
  if (rows.length === 0) throw new Error('Game not found');
  return rows[0] as Game;
}

export async function finishGame(gameId: string): Promise<Game> {
  return updateGameState(gameId, GameState.FINISHED);
}
