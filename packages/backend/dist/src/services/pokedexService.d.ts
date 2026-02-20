import { Pokemon, Move } from '../types/pokemon';
import { Area, AreaPokemon } from '../types/area';
export declare function getPokemon(idOrName: number | string): Promise<Pokemon>;
export declare function getPokemonMoves(pokemonId: number): Promise<Move[]>;
export declare function getArea(areaId: number): Promise<Area>;
export declare function getPokemonForArea(areaId: number): Promise<AreaPokemon[]>;
//# sourceMappingURL=pokedexService.d.ts.map