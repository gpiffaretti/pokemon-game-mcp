export const endpoints = {
  games: {
    create: () => `/games`,
    get: (gameId: string) => `/games/${gameId}`,
    finish: (gameId: string) => `/games/${gameId}/finish`,
  },
  pokemon: {
    captured: (gameId: string) => `/games/${gameId}/captured`,
    starting: (gameId: string) => `/games/${gameId}/starting`,
    startingMoves: (gameId: string) => `/games/${gameId}/starting/moves`,
  },
  area: {
    current: (gameId: string) => `/games/${gameId}/current`,
    move: (gameId: string) => `/games/${gameId}/move`,
    explore: (gameId: string) => `/games/${gameId}/explore`,
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
