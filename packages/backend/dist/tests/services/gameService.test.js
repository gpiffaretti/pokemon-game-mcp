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
const game_1 = require("../../src/types/game");
const mockReturning = jest.fn();
const mockWhere = jest.fn();
const mockSet = jest.fn();
const mockValues = jest.fn();
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const makeGame = (state) => ({
    id: 'game-1',
    state,
    currentAreaId: null,
    wildPokemonId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
});
jest.mock('../../src/db/client', () => ({
    db: {
        select: mockSelect,
        insert: mockInsert,
        update: mockUpdate,
    },
}));
const gameService = __importStar(require("../../src/services/gameService"));
beforeEach(() => {
    jest.clearAllMocks();
});
describe('gameService.createGame', () => {
    it('inserts a new game and returns it', async () => {
        const newGame = makeGame(game_1.GameState.SELECTING_STARTING_POKEMON);
        mockReturning.mockResolvedValue([newGame]);
        mockValues.mockReturnValue({ returning: mockReturning });
        mockInsert.mockReturnValue({ values: mockValues });
        const result = await gameService.createGame();
        expect(mockInsert).toHaveBeenCalled();
        expect(result).toEqual(newGame);
    });
});
describe('gameService.getGame', () => {
    it('returns the game when found', async () => {
        const game = makeGame(game_1.GameState.EXPLORING);
        mockWhere.mockResolvedValue([game]);
        mockFrom.mockReturnValue({ where: mockWhere });
        mockSelect.mockReturnValue({ from: mockFrom });
        const result = await gameService.getGame('game-1');
        expect(result).toEqual(game);
    });
    it('throws when game not found', async () => {
        mockWhere.mockResolvedValue([]);
        mockFrom.mockReturnValue({ where: mockWhere });
        mockSelect.mockReturnValue({ from: mockFrom });
        await expect(gameService.getGame('missing')).rejects.toThrow('Game not found');
    });
});
describe('gameService.updateGameState', () => {
    it('updates state and returns the updated game', async () => {
        const updated = makeGame(game_1.GameState.FINISHED);
        mockReturning.mockResolvedValue([updated]);
        mockWhere.mockReturnValue({ returning: mockReturning });
        mockSet.mockReturnValue({ where: mockWhere });
        mockUpdate.mockReturnValue({ set: mockSet });
        const result = await gameService.updateGameState('game-1', game_1.GameState.FINISHED);
        expect(result.state).toBe(game_1.GameState.FINISHED);
    });
    it('throws when game not found during update', async () => {
        mockReturning.mockResolvedValue([]);
        mockWhere.mockReturnValue({ returning: mockReturning });
        mockSet.mockReturnValue({ where: mockWhere });
        mockUpdate.mockReturnValue({ set: mockSet });
        await expect(gameService.updateGameState('missing', game_1.GameState.FINISHED)).rejects.toThrow('Game not found');
    });
});
describe('gameService.finishGame', () => {
    it('sets state to FINISHED', async () => {
        const finished = makeGame(game_1.GameState.FINISHED);
        mockReturning.mockResolvedValue([finished]);
        mockWhere.mockReturnValue({ returning: mockReturning });
        mockSet.mockReturnValue({ where: mockWhere });
        mockUpdate.mockReturnValue({ set: mockSet });
        const result = await gameService.finishGame('game-1');
        expect(result.state).toBe(game_1.GameState.FINISHED);
    });
});
//# sourceMappingURL=gameService.test.js.map