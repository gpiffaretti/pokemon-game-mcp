import { Request, Response, NextFunction } from 'express';
import * as pokedexService from '../services/pokedexService';

export async function getPokemon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { nameOrId } = req.params;
    const pokemon = await pokedexService.getPokemon(isNaN(Number(nameOrId)) ? nameOrId : Number(nameOrId));
    res.json(pokemon);
  } catch (err) {
    next(err);
  }
}

export async function getArea(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const areaId = Number(req.params.areaId);
    const [area, encounters] = await Promise.all([
      pokedexService.getArea(areaId),
      pokedexService.getPokemonForArea(areaId),
    ]);
    const pokemon = await Promise.all(encounters.map((enc) => pokedexService.getPokemon(enc.pokemonId)));
    res.json({ ...area, pokemon });
  } catch (err) {
    next(err);
  }
}
