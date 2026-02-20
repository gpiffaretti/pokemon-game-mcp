import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as battleService from '../services/battleService';

const startBattleSchema = z.object({
  wildPokemonId: z.number({ error: 'wildPokemonId must be a positive integer' }).int().positive(),
});

const performMoveSchema = z.object({
  moveId: z.number({ error: 'moveId must be a positive integer' }).int().positive(),
});

const throwPokeballSchema = z.object({
  wildPokemonId: z.number({ error: 'wildPokemonId must be a positive integer' }).int().positive(),
});

export async function startBattle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = startBattleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }
    await battleService.startBattle(req.params.gameId, parsed.data.wildPokemonId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function performMove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = performMoveSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }
    const result = await battleService.performMove(req.params.gameId, parsed.data.moveId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function flee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await battleService.flee(req.params.gameId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function throwPokeball(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = throwPokeballSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }
    const result = await battleService.throwPokeball(req.params.gameId, parsed.data.wildPokemonId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
