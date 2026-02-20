"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestLogger_1 = require("./middleware/requestLogger");
const errorHandler_1 = require("./middleware/errorHandler");
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const pokemonRoutes_1 = __importDefault(require("./routes/pokemonRoutes"));
const areaRoutes_1 = __importDefault(require("./routes/areaRoutes"));
const battleRoutes_1 = __importDefault(require("./routes/battleRoutes"));
const pokedexRoutes_1 = __importDefault(require("./routes/pokedexRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(requestLogger_1.requestLogger);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/v1/games', gameRoutes_1.default);
app.use('/api/v1/games', pokemonRoutes_1.default);
app.use('/api/v1/games', areaRoutes_1.default);
app.use('/api/v1/games', battleRoutes_1.default);
app.use('/api/v1/pokedex', pokedexRoutes_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map