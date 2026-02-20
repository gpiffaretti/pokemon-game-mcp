import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as areaService from '../services/areaService';

const moveToAreaSchema = z.object({
  areaId: z.number({ error: 'areaId must be a positive integer' }).int().positive(),
});

export async function getCurrentArea(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const area = await areaService.getCurrentArea(req.params.gameId);
    res.json(area);
  } catch (err) {
    next(err);
  }
}

export async function moveToArea(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = moveToAreaSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }
    const area = await areaService.moveToArea(req.params.gameId, parsed.data.areaId);
    res.json(area);
  } catch (err) {
    next(err);
  }
}

export async function findPokemonInArea(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pokemon = await areaService.findPokemonInArea(req.params.gameId);
    res.json(pokemon);
  } catch (err) {
    next(err);
  }
}
