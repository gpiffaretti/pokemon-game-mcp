import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as pokemonService from '../services/pokemonService';

const setCurrentPokemonSchema = z.object({
  pokemonId: z.number({ error: 'pokemonId must be a positive integer' }).int().positive(),
});

export async function getStarterOptions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const options = await pokemonService.getStarterOptions();
    res.json(options);
  } catch (err) {
    next(err);
  }
}

export async function getCapturedPokemon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pokemon = await pokemonService.getCapturedPokemon(req.params.gameId);
    res.json(pokemon);
  } catch (err) {
    next(err);
  }
}

export async function getCurrentPokemon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pokemon = await pokemonService.getCurrentPokemon(req.params.gameId);
    res.json(pokemon);
  } catch (err) {
    next(err);
  }
}

export async function setCurrentPokemon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = setCurrentPokemonSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }
    const game = await pokemonService.setCurrentPokemon(req.params.gameId, parsed.data.pokemonId);
    res.json(game);
  } catch (err) {
    next(err);
  }
}

export async function getMovesForCurrentPokemon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const moves = await pokemonService.getMovesForCurrentPokemon(req.params.gameId);
    res.json(moves);
  } catch (err) {
    next(err);
  }
}
