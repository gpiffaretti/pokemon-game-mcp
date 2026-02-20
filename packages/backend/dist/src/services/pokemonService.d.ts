import { CapturedPokemon, Game } from '../types/game';
import { Move, Pokemon } from '../types/pokemon';
export declare function getStarterOptions(): Promise<Pokemon[]>;
export declare function getCapturedPokemon(gameId: string): Promise<CapturedPokemon[]>;
export declare function capturePokemon(gameId: string, pokemonId: number): Promise<CapturedPokemon>;
export declare function getCurrentPokemon(gameId: string): Promise<{
    pokemonId: number;
} | null>;
export declare function setCurrentPokemon(gameId: string, pokemonId: number): Promise<Game>;
export declare function getMovesForCurrentPokemon(gameId: string): Promise<Move[]>;
//# sourceMappingURL=pokemonService.d.ts.map