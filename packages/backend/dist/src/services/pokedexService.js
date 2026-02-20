"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPokemon = getPokemon;
exports.getPokemonMoves = getPokemonMoves;
exports.getArea = getArea;
exports.getPokemonForArea = getPokemonForArea;
const axios_1 = __importDefault(require("axios"));
const POKEAPI_BASE = 'https://pokeapi.co/api/v2';
async function getPokemon(idOrName) {
    const { data } = await axios_1.default.get(`${POKEAPI_BASE}/pokemon/${idOrName}`);
    const types = data.types.map((t) => t.type.name);
    const moves = data.moves.slice(0, 4).map((m) => ({
        id: m.move.url.split('/').filter(Boolean).pop(),
        name: m.move.name,
        type: 'normal',
    }));
    return { id: data.id, name: data.name, types, moves };
}
async function getPokemonMoves(pokemonId) {
    const { data } = await axios_1.default.get(`${POKEAPI_BASE}/pokemon/${pokemonId}`);
    const moves = await Promise.all(data.moves.slice(0, 4).map(async (m) => {
        const moveId = parseInt(m.move.url.split('/').filter(Boolean).pop(), 10);
        const { data: moveData } = await axios_1.default.get(`${POKEAPI_BASE}/move/${moveId}`);
        return {
            id: moveId,
            name: moveData.name,
            type: moveData.type.name,
        };
    }));
    return moves;
}
async function getArea(areaId) {
    const { data } = await axios_1.default.get(`${POKEAPI_BASE}/location-area/${areaId}`);
    return { id: data.id, name: data.name };
}
async function getPokemonForArea(areaId) {
    const { data } = await axios_1.default.get(`${POKEAPI_BASE}/location-area/${areaId}`);
    return data.pokemon_encounters.map((enc) => {
        const pokemonId = parseInt(enc.pokemon.url.split('/').filter(Boolean).pop(), 10);
        const maxChance = enc.version_details.reduce((max, vd) => {
            const chance = vd.encounter_details.reduce((m, ed) => Math.max(m, ed.chance), 0);
            return Math.max(max, chance);
        }, 1);
        return { areaId, pokemonId, encounterRate: maxChance };
    });
}
//# sourceMappingURL=pokedexService.js.map