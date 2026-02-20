"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const STATUS_MAP = {
    'Game not found': 404,
    'Pokemon not found': 404,
    'Area not found': 404,
    'Pokemon already captured': 409,
    'Invalid game state': 400,
    'Cannot change starting pokemon during battle': 400,
    'No starting pokemon selected': 400,
    'No wild pokemon in current battle': 400,
};
function errorHandler(err, _req, res, _next) {
    const status = STATUS_MAP[err.message] ?? 500;
    res.status(status).json({ error: err.message });
}
//# sourceMappingURL=errorHandler.js.map