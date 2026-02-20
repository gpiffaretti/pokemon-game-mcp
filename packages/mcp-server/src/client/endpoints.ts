export const endpoints = {
  games: {
    create: () => `/games`,
    get: (gameId: string) => `/games/${gameId}`,
    finish: (gameId: string) => `/games/${gameId}/finish`,
  },
  pokemon: {
    starterOptions: () => `/games/starter-options`,
    captured: (gameId: string) => `/games/${gameId}/captured`,
    current: (gameId: string) => `/games/${gameId}/current`,
    currentMoves: (gameId: string) => `/games/${gameId}/current/moves`,
  },
  area: {
    current: (gameId: string) => `/games/${gameId}/current`,
    move: (gameId: string) => `/games/${gameId}/move`,
    findWildPokemon: (gameId: string) => `/games/${gameId}/find_wild_pokemon`,
  },
  battle: {
    start: (gameId: string) => `/games/${gameId}/start`,
    move: (gameId: string) => `/games/${gameId}/move`,
    flee: (gameId: string) => `/games/${gameId}/flee`,
    catch: (gameId: string) => `/games/${gameId}/catch`,
  },
  pokedex: {
    pokemon: (nameOrId: string | number) => `/pokedex/pokemon/${nameOrId}`,
    area: (areaId: number) => `/pokedex/area/${areaId}`,
  },
};
