import { Area, AreaPokemon } from '../types/area';
export declare function getCurrentArea(gameId: string): Promise<Area>;
export declare function moveToArea(gameId: string, areaId: number): Promise<Area>;
export declare function findPokemonInArea(gameId: string): Promise<AreaPokemon>;
//# sourceMappingURL=areaService.d.ts.map