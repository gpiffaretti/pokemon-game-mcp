import { Move, Pokemon } from './pokemon';

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

export interface CaptureResult {
  capturedPokemon: Pokemon;
}
