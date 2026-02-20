export type GameState = 'SELECTING_STARTING_POKEMON' | 'EXPLORING' | 'BATTLING' | 'FINISHED';

export interface Game {
  id: string;
  state: GameState;
  currentAreaId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CapturedPokemon {
  gameId: string;
  pokemonId: number;
  capturedAt: string;
}

export interface StartingPokemon {
  gameId: string;
  pokemonId: number;
  selectedAt: string;
}
