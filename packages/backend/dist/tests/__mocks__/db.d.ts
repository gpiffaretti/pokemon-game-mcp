import { GameState } from '../../src/types/game';
export declare const mockGame: {
    id: string;
    state: GameState;
    currentAreaId: number;
    wildPokemonId: null;
    createdAt: Date;
    updatedAt: Date;
};
export declare const db: {
    select: jest.Mock<any, any, any>;
    insert: jest.Mock<any, any, any>;
    update: jest.Mock<any, any, any>;
};
//# sourceMappingURL=db.d.ts.map