import { CapturedPokemon, EnrichedGame } from '../types/game';
import { Move, Pokemon } from '../types/pokemon';
export declare function getStarterOptions(): Promise<Pokemon[]>;
export declare function getCapturedPokemon(gameId: string): Promise<Pokemon[]>;
export declare function capturePokemon(gameId: string, pokemonId: number): Promise<CapturedPokemon>;
export declare function getCurrentPokemon(gameId: string): Promise<Pokemon | null>;
export declare function getCurrentPokemonRaw(gameId: string): Promise<{
    pokemonId: number;
} | null>;
export declare function setCurrentPokemon(gameId: string, pokemonId: number): Promise<EnrichedGame>;
export declare function getMovesForCurrentPokemon(gameId: string): Promise<Move[]>;
//# sourceMappingURL=pokemonService.d.ts.map