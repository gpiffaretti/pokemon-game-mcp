import { Game, GameState } from '../types/game';
export declare function createGame(): Promise<Game>;
export declare function getGame(gameId: string): Promise<Game>;
export declare function updateGameState(gameId: string, state: GameState): Promise<Game>;
export declare function finishGame(gameId: string): Promise<Game>;
//# sourceMappingURL=gameService.d.ts.map