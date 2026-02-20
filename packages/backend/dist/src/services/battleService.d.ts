import { MoveResult, BattleResult } from '../types/battle';
export declare function startBattle(gameId: string, wildPokemonId: number): Promise<void>;
export declare function performMove(gameId: string, playerMoveId: number): Promise<MoveResult>;
export declare function flee(gameId: string): Promise<void>;
export declare function throwPokeball(gameId: string, wildPokemonId: number): Promise<BattleResult>;
//# sourceMappingURL=battleService.d.ts.map