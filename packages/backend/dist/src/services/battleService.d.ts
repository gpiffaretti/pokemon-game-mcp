import { EnrichedGame } from '../types/game';
import { MoveResult } from '../types/battle';
import { Pokemon } from '../types/pokemon';
export declare function startBattle(gameId: string, wildPokemonId: number): Promise<EnrichedGame>;
export declare function performMove(gameId: string, playerMoveId: number): Promise<MoveResult>;
export declare function flee(gameId: string): Promise<void>;
export declare function throwPokeball(gameId: string): Promise<Pokemon>;
//# sourceMappingURL=battleService.d.ts.map