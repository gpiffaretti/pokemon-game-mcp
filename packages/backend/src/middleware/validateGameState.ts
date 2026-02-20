import { Request, Response, NextFunction } from 'express';
import { db } from '../db/client';
import { games } from '../db/schema';
import { eq } from 'drizzle-orm';
import { GameState } from '../types/game';

export function requireState(requiredState: GameState) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const { gameId } = req.params;
      const rows = await db.select().from(games).where(eq(games.id, gameId));
      if (rows.length === 0) {
        next(new Error('Game not found'));
        return;
      }
      if (rows[0].state !== requiredState) {
        next(new Error(`Invalid game state: expected ${requiredState}, got ${rows[0].state}`));
        return;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
