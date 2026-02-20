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
exports.startBattle = startBattle;
exports.performMove = performMove;
exports.flee = flee;
exports.throwPokeball = throwPokeball;
const zod_1 = require("zod");
const battleService = __importStar(require("../services/battleService"));
const startBattleSchema = zod_1.z.object({
    wildPokemonId: zod_1.z.number({ error: 'wildPokemonId must be a positive integer' }).int().positive(),
});
const performMoveSchema = zod_1.z.object({
    moveId: zod_1.z.number({ error: 'moveId must be a positive integer' }).int().positive(),
});
const throwPokeballSchema = zod_1.z.object({});
async function startBattle(req, res, next) {
    try {
        const parsed = startBattleSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.issues[0].message });
            return;
        }
        const game = await battleService.startBattle(req.params.gameId, parsed.data.wildPokemonId);
        res.json(game);
    }
    catch (err) {
        next(err);
    }
}
async function performMove(req, res, next) {
    try {
        const parsed = performMoveSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.issues[0].message });
            return;
        }
        const result = await battleService.performMove(req.params.gameId, parsed.data.moveId);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
async function flee(req, res, next) {
    try {
        await battleService.flee(req.params.gameId);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
async function throwPokeball(req, res, next) {
    try {
        const parsed = throwPokeballSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.issues[0].message });
            return;
        }
        const captured = await battleService.throwPokeball(req.params.gameId);
        res.json(captured);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=battleController.js.map