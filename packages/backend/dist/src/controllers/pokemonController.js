"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStarterOptions = getStarterOptions;
exports.getCapturedPokemon = getCapturedPokemon;
exports.getCurrentPokemon = getCurrentPokemon;
exports.setCurrentPokemon = setCurrentPokemon;
exports.getMovesForCurrentPokemon = getMovesForCurrentPokemon;
const zod_1 = require("zod");
const pokemonService = __importStar(require("../services/pokemonService"));
const setCurrentPokemonSchema = zod_1.z.object({
    pokemonId: zod_1.z.number({ error: 'pokemonId must be a positive integer' }).int().positive(),
});
async function getStarterOptions(req, res, next) {
    try {
        const options = await pokemonService.getStarterOptions();
        res.json(options);
    }
    catch (err) {
        next(err);
    }
}
async function getCapturedPokemon(req, res, next) {
    try {
        const pokemon = await pokemonService.getCapturedPokemon(req.params.gameId);
        res.json(pokemon);
    }
    catch (err) {
        next(err);
    }
}
async function getCurrentPokemon(req, res, next) {
    try {
        const pokemon = await pokemonService.getCurrentPokemon(req.params.gameId);
        res.json(pokemon);
    }
    catch (err) {
        next(err);
    }
}
async function setCurrentPokemon(req, res, next) {
    try {
        const parsed = setCurrentPokemonSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.issues[0].message });
            return;
        }
        const game = await pokemonService.setCurrentPokemon(req.params.gameId, parsed.data.pokemonId);
        res.json(game);
    }
    catch (err) {
        next(err);
    }
}
async function getMovesForCurrentPokemon(req, res, next) {
    try {
        const moves = await pokemonService.getMovesForCurrentPokemon(req.params.gameId);
        res.json(moves);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=pokemonController.js.map