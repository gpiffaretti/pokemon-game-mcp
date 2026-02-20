import { Game, GameState, EnrichedGame } from '../types/game';
declare function enrichGame(game: Game): Promise<EnrichedGame>;
export declare function createGame(): Promise<EnrichedGame>;
export declare function getGame(gameId: string): Promise<EnrichedGame>;
export declare function updateGameState(gameId: string, state: GameState): Promise<EnrichedGame>;
export declare function finishGame(gameId: string): Promise<EnrichedGame>;
export { enrichGame };
//# sourceMappingURL=gameService.d.ts.map