import { Request, Response, NextFunction } from 'express';
import * as gameService from '../services/gameService';

export async function createGame(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const game = await gameService.createGame();
    res.status(201).json(game);
  } catch (err) {
    next(err);
  }
}

export async function getGame(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const game = await gameService.getGame(req.params.gameId);
    res.json(game);
  } catch (err) {
    next(err);
  }
}

export async function finishGame(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const game = await gameService.finishGame(req.params.gameId);
    res.json(game);
  } catch (err) {
    next(err);
  }
}
