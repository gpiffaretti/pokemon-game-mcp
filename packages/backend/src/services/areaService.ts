import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { games } from '../db/schema';
import { Area, AreaPokemon } from '../types/area';
import { GameState } from '../types/game';
import { getArea, getPokemonForArea } from './pokedexService';

export async function getCurrentArea(gameId: string): Promise<Area> {
  const rows = await db.select().from(games).where(eq(games.id, gameId));
  if (rows.length === 0) throw new Error('Game not found');
  const game = rows[0];
  if (!game.currentAreaId) throw new Error('No current area set');
  return getArea(game.currentAreaId);
}

export async function moveToArea(gameId: string, areaId: number): Promise<Area> {
  const rows = await db.select().from(games).where(eq(games.id, gameId));
  if (rows.length === 0) throw new Error('Game not found');
  if (rows[0].state !== GameState.EXPLORING) {
    throw new Error('Can only move areas while exploring');
  }
  await db
    .update(games)
    .set({ currentAreaId: areaId, updatedAt: new Date() })
    .where(eq(games.id, gameId));
  return getArea(areaId);
}

export async function findPokemonInArea(gameId: string): Promise<AreaPokemon> {
  const rows = await db.select().from(games).where(eq(games.id, gameId));
  if (rows.length === 0) throw new Error('Game not found');
  const game = rows[0];
  if (game.state !== GameState.EXPLORING) {
    throw new Error('Can only explore while in EXPLORING state');
  }
  if (!game.currentAreaId) throw new Error('No current area set');

  const encounters = await getPokemonForArea(game.currentAreaId);
  if (encounters.length === 0) throw new Error('No Pokemon found in this area');

  const totalWeight = encounters.reduce((sum, e) => sum + e.encounterRate, 0);
  let rand = Math.random() * totalWeight;
  for (const enc of encounters) {
    rand -= enc.encounterRate;
    if (rand <= 0) return enc;
  }
  return encounters[encounters.length - 1];
}
