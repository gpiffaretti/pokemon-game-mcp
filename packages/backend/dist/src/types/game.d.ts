import { Pokemon } from './pokemon';
import { Area } from './area';
export declare enum GameState {
    SELECTING_STARTING_POKEMON = "SELECTING_STARTING_POKEMON",
    EXPLORING = "EXPLORING",
    BATTLING = "BATTLING",
    FINISHED = "FINISHED"
}
export interface Game {
    id: string;
    state: GameState;
    currentAreaId: number | null;
    wildPokemonId: number | null;
    currentPokemonId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}
export interface CapturedPokemon {
    gameId: string | null;
    pokemonId: number;
    capturedAt: Date | null;
}
export interface EnrichedGame {
    id: string;
    state: GameState;
    currentArea: Area | null;
    wildPokemon: Pokemon | null;
    currentPokemon: Pokemon | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}
//# sourceMappingURL=game.d.ts.map