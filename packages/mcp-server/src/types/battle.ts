import { Move } from './pokemon';

export interface MoveResult {
  playerMove: Move;
  opponentMove: Move;
}

export interface BattleResult {
  playerMove: Move;
  opponentMove: Move;
  captured?: boolean;
  fled?: boolean;
}
