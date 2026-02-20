export interface Move {
  id: number;
  name: string;
  type: string;
}

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  moves: Move[];
}
