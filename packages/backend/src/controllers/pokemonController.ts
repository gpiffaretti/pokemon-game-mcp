import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as pokemonService from '../services/pokemonService';

const setStartingPokemonSchema = z.object({
  pokemonId: z.number({ error: 'pokemonId must be a positive integer' }).int().positive(),
});

export async function getCapturedPokemon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pokemon = await pokemonService.getCapturedPokemon(req.params.gameId);
    res.json(pokemon);
  } catch (err) {
    next(err);
  }
}

export async function getStartingPokemon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pokemon = await pokemonService.getStartingPokemon(req.params.gameId);
    res.json(pokemon);
  } catch (err) {
    next(err);
  }
}

export async function setStartingPokemon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = setStartingPokemonSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }
    const pokemon = await pokemonService.setStartingPokemon(req.params.gameId, parsed.data.pokemonId);
    res.json(pokemon);
  } catch (err) {
    next(err);
  }
}

export async function getMovesForStartingPokemon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const moves = await pokemonService.getMovesForStartingPokemon(req.params.gameId);
    res.json(moves);
  } catch (err) {
    next(err);
  }
}
