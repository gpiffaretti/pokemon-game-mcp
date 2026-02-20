import axios from 'axios';
import { Pokemon, Move } from '../types/pokemon';
import { Area, AreaPokemon } from '../types/area';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

export async function getPokemon(idOrName: number | string): Promise<Pokemon> {
  const { data } = await axios.get(`${POKEAPI_BASE}/pokemon/${idOrName}`);
  const types: string[] = data.types.map((t: any) => t.type.name);
  const moves: Move[] = data.moves.slice(0, 4).map((m: any) => ({
    id: m.move.url.split('/').filter(Boolean).pop(),
    name: m.move.name,
    type: 'normal',
  }));
  return { id: data.id, name: data.name, types, moves };
}

export async function getPokemonMoves(pokemonId: number): Promise<Move[]> {
  const { data } = await axios.get(`${POKEAPI_BASE}/pokemon/${pokemonId}`);
  const moves: Move[] = await Promise.all(
    data.moves.slice(0, 4).map(async (m: any) => {
      const moveId = parseInt(m.move.url.split('/').filter(Boolean).pop(), 10);
      const { data: moveData } = await axios.get(`${POKEAPI_BASE}/move/${moveId}`);
      return {
        id: moveId,
        name: moveData.name,
        type: moveData.type.name,
      };
    })
  );
  return moves;
}

export async function getArea(areaId: number): Promise<Area> {
  const { data } = await axios.get(`${POKEAPI_BASE}/location-area/${areaId}`);
  return { id: data.id, name: data.name };
}

export async function getPokemonForArea(areaId: number): Promise<AreaPokemon[]> {
  const { data } = await axios.get(`${POKEAPI_BASE}/location-area/${areaId}`);
  return data.pokemon_encounters.map((enc: any) => {
    const pokemonId = parseInt(enc.pokemon.url.split('/').filter(Boolean).pop(), 10);
    const maxChance = enc.version_details.reduce((max: number, vd: any) => {
      const chance = vd.encounter_details.reduce((m: number, ed: any) => Math.max(m, ed.chance), 0);
      return Math.max(max, chance);
    }, 1);
    return { areaId, pokemonId, encounterRate: maxChance };
  });
}
