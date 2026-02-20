import { Request, Response, NextFunction } from 'express';
import { GameState } from '../types/game';
export declare function requireState(requiredState: GameState): (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validateGameState.d.ts.map