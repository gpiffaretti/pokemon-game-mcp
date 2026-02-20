import { Request, Response, NextFunction } from 'express';

const STATUS_MAP: Record<string, number> = {
  'Game not found': 404,
  'Pokemon not found': 404,
  'Area not found': 404,
  'Pokemon already captured': 409,
  'Invalid game state': 400,
  'Cannot change starting pokemon during battle': 400,
  'No starting pokemon selected': 400,
  'No wild pokemon in current battle': 400,
};

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = STATUS_MAP[err.message] ?? 500;
  res.status(status).json({ error: err.message });
}
